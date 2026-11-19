"""Bridge to the core schedule helper.

The core schedule helper only exposes create/update/delete through
admin-only websocket commands (``schedule/*``). There is no public Python API
or service for writing. To reuse its validation, storage and entity update
logic (instead of duplicating it), this module looks up the handlers the
helper registered and calls them directly, skipping the admin wrapper.

This is the ONLY place that relies on Home Assistant internals:
  * the command registry in ``hass.data["websocket_api"]``
  * the handlers being wrapped with ``functools.wraps`` (``__wrapped__``)
  * the handlers only using ``send_result`` / ``send_error`` on the connection

Authorization is therefore the caller's job (see websocket.py).
"""

from __future__ import annotations

import inspect
import logging
from typing import Any

import voluptuous as vol
from voluptuous.humanize import humanize_error

from homeassistant.auth.models import User
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import WEBSOCKET_DATA_KEY
from .week import normalize_config

_LOGGER = logging.getLogger(__name__)


class ScheduleBackendError(HomeAssistantError):
    """Raised when the core schedule helper rejects or cannot do something."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


class _CaptureConnection:
    """Minimal stand-in for a websocket connection that records the reply."""

    def __init__(self, user: User | None) -> None:
        self.user = user
        self.result: Any = None
        self.error: tuple[str, str] | None = None

    def send_result(self, msg_id: int, result: Any = None) -> None:
        self.result = result

    def send_error(self, msg_id: int, code: str, message: str, *args: Any, **kwargs: Any) -> None:
        self.error = (code, message)

    def send_message(self, message: Any) -> None:
        _LOGGER.debug("Unexpected message from schedule handler: %s", message)

    def context(self, msg: dict[str, Any]) -> Context:
        return Context(user_id=self.user.id if self.user else None)


def _unwrap(handler: Any) -> Any:
    """Strip the decorators (require_admin, async_response) off a handler."""
    while (inner := getattr(handler, "__wrapped__", None)) is not None:
        handler = inner
    return handler


async def async_call_schedule_command(
    hass: HomeAssistant,
    user: User | None,
    command: str,
    payload: dict[str, Any] | None = None,
) -> Any:
    """Run a core schedule websocket command and return its result."""
    registered = hass.data.get(WEBSOCKET_DATA_KEY, {}).get(command)
    if registered is None:
        raise ScheduleBackendError(
            "not_loaded", f"Schedule command {command} is not registered"
        )
    handler, schema = registered

    msg: dict[str, Any] = {"id": 1, "type": command, **(payload or {})}
    try:
        if schema is not False:
            msg = schema(msg)
    except vol.Invalid as err:
        raise ScheduleBackendError("invalid_format", humanize_error(msg, err)) from err

    connection = _CaptureConnection(user)
    outcome = _unwrap(handler)(hass, connection, msg)
    if inspect.isawaitable(outcome):
        await outcome

    if connection.error is not None:
        raise ScheduleBackendError(*connection.error)
    return connection.result


async def async_get_configs(
    hass: HomeAssistant, user: User | None
) -> dict[str, dict[str, Any]]:
    """Return all UI-managed schedule configs keyed by storage id."""
    items = await async_call_schedule_command(hass, user, "schedule/list")
    return {item["id"]: normalize_config(item) for item in items or []}
