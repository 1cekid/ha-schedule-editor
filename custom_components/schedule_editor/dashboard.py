"""Generated dashboard that hosts the schedule editor.

A dashboard at /schedule-editor is registered without a sidebar entry and is
open to non-admin users. Its views are generated here: an overview plus one
subview per editable schedule (/schedule-editor/<object_id>). They are real
views (not a frontend strategy), so the navigation picker lists them. It is in
YAML mode, so it cannot be edited in the dashboard editor.
"""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path
from typing import Any

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace.const import LOVELACE_DATA, MODE_YAML
from homeassistant.components.lovelace.dashboard import LovelaceConfig
from homeassistant.const import EVENT_LOVELACE_UPDATED
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.json import json_bytes, json_fragment

from .const import (
    DASHBOARD_ICON,
    DASHBOARD_TITLE,
    DASHBOARD_URL_PATH,
    DOMAIN,
    FRONTEND_FILE,
    STATIC_URL_PATH,
)
from .editable import editable_entries
from .schedule_backend import ScheduleBackendError, async_get_configs

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = Path(__file__).parent / "frontend"
CARD_TYPE = "custom:schedule-editor-card"

_TEXTS = {
    "en": {
        "title": "Schedules",
        "none": "No schedules are enabled for editing. Add one of the labels "
        "configured in the Schedule Editor integration to a schedule helper.",
    },
    "de": {
        "title": "Zeitpläne",
        "none": "Es sind keine Zeitpläne zur Bearbeitung freigegeben. Vergib eines der "
        "in der Integration „Schedule Editor“ eingestellten Labels an einen Zeitplan-Helfer.",
    },
}


def build_config(schedules: list[dict[str, Any]], language: str) -> dict[str, Any]:
    """Overview with one tile per schedule, then one subview per schedule.

    `schedules`: [{entity_id, name, icon}], already sorted.
    """
    texts = _TEXTS.get(language.split("-")[0], _TEXTS["en"])
    tiles = []
    views = []
    for item in schedules:
        path = item["entity_id"].split(".", 1)[1]
        navigate = {"action": "navigate", "navigation_path": f"/{DASHBOARD_URL_PATH}/{path}"}
        tiles.append(
            {
                "type": "tile",
                "entity": item["entity_id"],
                "name": item["name"],
                "tap_action": navigate,
                "icon_tap_action": navigate,
            }
        )
        views.append(
            {
                "title": item["name"],
                "path": path,
                "icon": item.get("icon") or DASHBOARD_ICON,
                "subview": True,
                "type": "panel",
                "cards": [{"type": CARD_TYPE, "entity": item["entity_id"]}],
            }
        )
    overview = {
        "title": texts["title"],
        "path": "overview",
        "icon": DASHBOARD_ICON,
        "cards": tiles or [{"type": "markdown", "content": texts["none"]}],
    }
    return {"title": texts["title"], "views": [overview, *views]}


class ScheduleEditorDashboard(LovelaceConfig):
    """Fixed dashboard config; the views are generated in the frontend."""

    def __init__(self, hass: HomeAssistant) -> None:
        super().__init__(
            hass,
            DASHBOARD_URL_PATH,
            {
                "id": DASHBOARD_URL_PATH,
                "mode": MODE_YAML,
                "title": DASHBOARD_TITLE,
                "icon": DASHBOARD_ICON,
                "show_in_sidebar": False,
                "require_admin": False,
            },
        )

    @property
    def mode(self) -> str:
        return MODE_YAML

    async def async_get_info(self) -> dict[str, Any]:
        config = await self.async_load(False)
        return {"mode": self.mode, "views": len(config["views"])}

    async def async_load(self, force: bool) -> dict[str, Any]:
        try:
            configs = await async_get_configs(self.hass, None)
        except ScheduleBackendError as err:
            _LOGGER.warning("Cannot read schedules: %s", err)
            configs = {}
        schedules = [
            {
                "entity_id": entry.entity_id,
                "name": configs[entry.unique_id]["name"],
                "icon": configs[entry.unique_id].get("icon"),
            }
            for entry in editable_entries(self.hass)
            if entry.unique_id in configs
        ]
        schedules.sort(key=lambda item: item["name"].casefold())
        return build_config(schedules, self.hass.config.language)

    async def async_json(self, force: bool) -> json_fragment:
        return json_fragment(json_bytes(await self.async_load(force)))


def _file_hash(path: Path) -> str:
    return hashlib.sha1(path.read_bytes()).hexdigest()[:10]


async def async_register_dashboard(hass: HomeAssistant) -> None:
    """Serve the frontend bundle and register the dashboard."""
    bundle = FRONTEND_DIR / FRONTEND_FILE
    if not await hass.async_add_executor_job(bundle.is_file):
        _LOGGER.error("Frontend bundle %s is missing; the editor dashboard is not available", bundle)
        return

    domain_data = hass.data.setdefault(DOMAIN, {})
    if not domain_data.get("static_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL_PATH, str(FRONTEND_DIR), cache_headers=False)]
        )
        domain_data["static_registered"] = True

    # Loaded on every page, so the card exists wherever it is used. The hash makes browsers pick up a new bundle.
    version = await hass.async_add_executor_job(_file_hash, bundle)
    module_url = f"{STATIC_URL_PATH}/{FRONTEND_FILE}?v={version}"
    frontend.add_extra_js_url(hass, module_url)
    domain_data["module_url"] = module_url

    dashboards = hass.data[LOVELACE_DATA].dashboards
    existing = dashboards.get(DASHBOARD_URL_PATH)
    if existing is not None and not isinstance(existing, ScheduleEditorDashboard):
        _LOGGER.error(
            "A dashboard at /%s already exists; the editor dashboard is not registered",
            DASHBOARD_URL_PATH,
        )
        return
    dashboards[DASHBOARD_URL_PATH] = ScheduleEditorDashboard(hass)
    frontend.async_register_built_in_panel(
        hass,
        "lovelace",
        frontend_url_path=DASHBOARD_URL_PATH,
        config={"mode": MODE_YAML},
        require_admin=False,
        update=existing is not None,
    )


@callback
def async_unregister_dashboard(hass: HomeAssistant) -> None:
    dashboards = hass.data[LOVELACE_DATA].dashboards
    if isinstance(dashboards.get(DASHBOARD_URL_PATH), ScheduleEditorDashboard):
        dashboards.pop(DASHBOARD_URL_PATH)
        frontend.async_remove_panel(hass, DASHBOARD_URL_PATH, warn_if_unknown=False)
    module_url = hass.data.get(DOMAIN, {}).pop("module_url", None)
    if module_url:
        frontend.remove_extra_js_url(hass, module_url)


@callback
def async_dashboard_changed(hass: HomeAssistant) -> None:
    """Tell open frontends to reload the views (the set of schedules changed)."""
    hass.bus.async_fire(EVENT_LOVELACE_UPDATED, {"url_path": DASHBOARD_URL_PATH})
