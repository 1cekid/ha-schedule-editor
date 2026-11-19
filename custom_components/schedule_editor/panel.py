"""Hidden full-page panel that hosts the schedule editor frontend.

The panel is reachable at /schedule-editor (optionally with ?entity=schedule.x),
has no sidebar entry and is open to non-admin users. Dashboards link to it with
a normal "Navigate" tap action.
"""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN, PANEL_ELEMENT, PANEL_FILE, PANEL_URL_PATH, STATIC_URL_PATH

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = Path(__file__).parent / "frontend"


def _file_hash(path: Path) -> str:
    return hashlib.sha1(path.read_bytes()).hexdigest()[:10]


async def async_register_panel(hass: HomeAssistant) -> None:
    """Serve the bundled frontend and register the panel."""
    bundle = FRONTEND_DIR / PANEL_FILE
    if not await hass.async_add_executor_job(bundle.is_file):
        _LOGGER.error("Frontend bundle %s is missing; the editor panel is not available", bundle)
        return

    domain_data = hass.data.setdefault(DOMAIN, {})
    if not domain_data.get("static_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL_PATH, str(FRONTEND_DIR), cache_headers=False)]
        )
        domain_data["static_registered"] = True

    # The hash in the URL makes browsers pick up a new bundle after an update.
    version = await hass.async_add_executor_job(_file_hash, bundle)
    try:
        await panel_custom.async_register_panel(
            hass,
            webcomponent_name=PANEL_ELEMENT,
            frontend_url_path=PANEL_URL_PATH,
            module_url=f"{STATIC_URL_PATH}/{PANEL_FILE}?v={version}",
            require_admin=False,
            config={},
        )
    except ValueError:
        _LOGGER.debug("Panel %s is already registered", PANEL_URL_PATH)


@callback
def async_unregister_panel(hass: HomeAssistant) -> None:
    frontend.async_remove_panel(hass, PANEL_URL_PATH, warn_if_unknown=False)