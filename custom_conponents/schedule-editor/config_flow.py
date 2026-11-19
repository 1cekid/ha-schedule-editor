"""Config and options flow for the Schedule Editor."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers.selector import LabelSelector, LabelSelectorConfig

from .const import CONF_LABELS, DOMAIN


def _schema(labels: list[str]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Optional(CONF_LABELS, default=labels): LabelSelector(
                LabelSelectorConfig(multiple=True)
            )
        }
    )


class ScheduleEditorConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle the initial setup."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                title="Schedule Editor", data={}, options=user_input
            )
        return self.async_show_form(step_id="user", data_schema=_schema([]))

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return ScheduleEditorOptionsFlow()


class ScheduleEditorOptionsFlow(OptionsFlow):
    """Change which labels enable schedules for user editing."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        return self.async_show_form(
            step_id="init",
            data_schema=_schema(self.config_entry.options.get(CONF_LABELS, [])),
        )
