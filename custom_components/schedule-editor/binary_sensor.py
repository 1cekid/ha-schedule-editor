"""Mirror binary sensors: schedule state plus the complete week."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, State, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_state_change_event,
)
from homeassistant.util import dt as dt_util

from .const import SCHEDULE_DOMAIN, SIGNAL_CONFIG_CHANGED
from .editable import editable_entries
from .schedule_backend import ScheduleBackendError, async_get_configs
from .week import build_week, next_boundary, weekday_names

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Create a mirror for every enabled schedule and keep that set up to date."""
    registry = er.async_get(hass)
    known: set[str] = set()

    async def _async_reconcile() -> None:
        try:
            configs = await async_get_configs(hass, None)
        except ScheduleBackendError as err:
            _LOGGER.warning("Cannot read schedules: %s", err)
            return

        wanted = {
            source.unique_id: source
            for source in editable_entries(hass)
            if source.unique_id in configs
        }

        for registered in er.async_entries_for_config_entry(registry, entry.entry_id):
            if registered.domain == "binary_sensor" and registered.unique_id not in wanted:
                registry.async_remove(registered.entity_id)
                known.discard(registered.unique_id)

        new = [
            ScheduleMirror(source.entity_id, schedule_id, configs[schedule_id])
            for schedule_id, source in wanted.items()
            if schedule_id not in known
        ]
        known.update(mirror.unique_id for mirror in new)
        if new:
            async_add_entities(new)

    @callback
    def _on_registry_update(event: Event) -> None:
        data = event.data
        if not data["entity_id"].startswith(f"{SCHEDULE_DOMAIN}."):
            return
        #if data["action"] == "update" and ("labels" not in data.get("changes", {}) and data["entity_id"] not in known):
        #    return
        hass.async_create_task(_async_reconcile())

    entry.async_on_unload(
        hass.bus.async_listen(er.EVENT_ENTITY_REGISTRY_UPDATED, _on_registry_update)
    )
    await _async_reconcile()


class ScheduleMirror(BinarySensorEntity):
    """Mirrors a schedule helper and adds the whole week as an attribute."""

    _attr_should_poll = False
    # Big and derived from other data: keep it out of the database.
    _unrecorded_attributes = frozenset({"week", "original_entity"})

    def __init__(self, source_entity_id: str, schedule_id: str, config: dict[str, Any]) -> None:
        self._source = source_entity_id
        self._config = config
        self._attr_unique_id = schedule_id
        self._unsub_timer: CALLBACK_TYPE | None = None

    @property
    def name(self) -> str:
        return f"{self._config['name']} (mirror)"

    @property
    def _source_state(self) -> State | None:
        return self.hass.states.get(self._source)

    @property
    def available(self) -> bool:
        state = self._source_state
        return state is not None and state.state != STATE_UNAVAILABLE

    @property
    def is_on(self) -> bool | None:
        state = self._source_state
        if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return None
        return state.state == STATE_ON

    @property
    def icon(self) -> str:
        state = self._source_state
        return (state.attributes.get("icon") if state else None) or "mdi:calendar-clock"

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        state = self._source_state
        return {
            "original_entity_id": self._source,
            "original_entity": dict(state.attributes) if state else {},
            "week": build_week(
                self._config, dt_util.now(), weekday_names(self.hass.config.language)
            ),
        }

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_track_state_change_event(self.hass, [self._source], self._handle_source_change)
        )
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_CONFIG_CHANGED, self._handle_config_signal)
        )
        await self._async_refresh_config(write=False)
        self._schedule_next_tick()

    async def async_will_remove_from_hass(self) -> None:
        self._cancel_timer()

    @callback
    def _handle_source_change(self, event: Event) -> None:
        # The config may have changed together with the source's state or attributes.
        self.hass.async_create_task(self._async_refresh_config())

    @callback
    def _handle_config_signal(self, schedule_id: str) -> None:
        if schedule_id == self._attr_unique_id:
            self.hass.async_create_task(self._async_refresh_config())

    async def _async_refresh_config(self, write: bool = True) -> None:
        try:
            configs = await async_get_configs(self.hass, None)
        except ScheduleBackendError as err:
            _LOGGER.debug("Cannot refresh %s: %s", self._source, err)
        else:
            if (config := configs.get(self._attr_unique_id)) is not None:
                self._config = config
        if write:
            self.async_write_ha_state()
            self._schedule_next_tick()

    @callback
    def _schedule_next_tick(self) -> None:
        self._cancel_timer()
        self._unsub_timer = async_track_point_in_time(
            self.hass, self._handle_tick, next_boundary(self._config, dt_util.now())
        )

    @callback
    def _handle_tick(self, _now: Any) -> None:
        self._unsub_timer = None
        self.async_write_ha_state()
        self._schedule_next_tick()

    @callback
    def _cancel_timer(self) -> None:
        if self._unsub_timer is not None:
            self._unsub_timer()
            self._unsub_timer = None
