"""Which schedule entities are enabled for user editing (label based)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .const import CONF_LABELS, DOMAIN, SCHEDULE_DOMAIN


def enabled_labels(hass: HomeAssistant) -> set[str]:
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries:
        return set()
    return set(entries[0].options.get(CONF_LABELS, []))


def editable_entries(hass: HomeAssistant) -> list[er.RegistryEntry]:
    """Schedule entities that carry at least one enabled label."""
    registry = er.async_get(hass)
    found: dict[str, er.RegistryEntry] = {}
    for label_id in enabled_labels(hass):
        for entry in er.async_entries_for_label(registry, label_id):
            if entry.domain == SCHEDULE_DOMAIN and entry.unique_id:
                found[entry.entity_id] = entry
    return list(found.values())
