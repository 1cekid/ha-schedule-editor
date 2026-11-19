"""Websocket commands for the Schedule Editor (usable by non-admin users)."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.auth.models import User
from homeassistant.auth.permissions.const import POLICY_CONTROL, POLICY_READ
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError, Unauthorized
from homeassistant.helpers import config_validation as cv, entity_registry as er

from .const import CONF_LABELS, DOMAIN, SCHEDULE_DOMAIN, SCHEDULE_ID_KEY, WEEKDAYS
from .schedule_backend import async_call_schedule_command, async_get_configs

# Blocks are validated strictly by the core schedule helper itself; here we
# only check the shape. `data` is passed through untouched.
BLOCK_SCHEMA = vol.Schema(
    {
        vol.Required("from"): cv.string,
        vol.Required("to"): cv.string,
        vol.Optional("data"): dict,
    }
)


def _enabled_labels(hass: HomeAssistant) -> set[str]:
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries:
        return set()
    return set(entries[0].options.get(CONF_LABELS, []))


def _public(entity_id: str, config: dict[str, Any]) -> dict[str, Any]:
    return {
        "entity_id": entity_id,
        "name": config["name"],
        "icon": config.get("icon"),
        **{day: config.get(day, []) for day in WEEKDAYS},
    }


def _editable_entries(hass: HomeAssistant) -> list[er.RegistryEntry]:
    """Schedule entities that carry at least one enabled label."""
    labels = _enabled_labels(hass)
    registry = er.async_get(hass)
    found: dict[str, er.RegistryEntry] = {}
    for label_id in labels:
        for entry in er.async_entries_for_label(registry, label_id):
            if entry.domain == SCHEDULE_DOMAIN and entry.unique_id:
                found[entry.entity_id] = entry
    return list(found.values())


def _can(user: User, entity_id: str, policy: str) -> bool:
    return user.permissions.check_entity(entity_id, policy)


@websocket_api.websocket_command({vol.Required("type"): "schedule_editor/list"})
@websocket_api.async_response
async def ws_list(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """List the schedules this user may edit, including their weekly blocks."""
    configs = await async_get_configs(hass, connection.user)
    result = []
    for entry in _editable_entries(hass):
        config = configs.get(entry.unique_id)  # YAML schedules are not in here
        if config is None or not _can(connection.user, entry.entity_id, POLICY_READ):
            continue
        result.append(_public(entry.entity_id, config))
    result.sort(key=lambda item: item["name"].casefold())
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "schedule_editor/update",
        vol.Required("entity_id"): cv.entity_id,
        **{vol.Required(day): [BLOCK_SCHEMA] for day in WEEKDAYS},
    }
)
@websocket_api.async_response
async def ws_update(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Replace the weekly blocks of one schedule. Name and icon stay as they are."""
    entity_id: str = msg["entity_id"]
    entry = er.async_get(hass).async_get(entity_id)

    if (
        entry is None
        or entry.domain != SCHEDULE_DOMAIN
        or not entry.unique_id
        or not (entry.labels & _enabled_labels(hass))
    ):
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "Schedule not found or not editable"
        )
        return
    if not _can(connection.user, entity_id, POLICY_CONTROL):
        raise Unauthorized(entity_id=entity_id, permission=POLICY_CONTROL)

    configs = await async_get_configs(hass, connection.user)
    current = configs.get(entry.unique_id)
    if current is None:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "Schedule not found or not editable"
        )
        return

    payload: dict[str, Any] = {
        SCHEDULE_ID_KEY: entry.unique_id,
        "name": current["name"],
        **{day: msg[day] for day in WEEKDAYS},
    }
    if current.get("icon"):
        payload["icon"] = current["icon"]

    updated = await async_call_schedule_command(
        hass, connection.user, "schedule/update", payload
    )
    await _async_log_change(hass, connection, msg, entry, updated["name"])
    connection.send_result(msg["id"], _public(entity_id, updated))


async def _async_log_change(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    entry: er.RegistryEntry,
    name: str,
) -> None:
    """Write an activity-log (logbook) entry attributed to the editing user."""
    if not hass.services.has_service("logbook", "log"):
        return
    try:
        await hass.services.async_call(
            "logbook",
            "log",
            {
                "name": name,
                "message": "schedule was edited",
                "domain": SCHEDULE_DOMAIN,
                "entity_id": entry.entity_id,
            },
            blocking=True,
            context=connection.context(msg),
        )
    except (HomeAssistantError, vol.Invalid):
        # The schedule is already saved; a logging problem must not fail the edit.
        pass


@callback
def async_register_websocket_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_list)
    websocket_api.async_register_command(hass, ws_update)
