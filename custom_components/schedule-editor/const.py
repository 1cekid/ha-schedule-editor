"""Constants for the Schedule Editor integration."""

DOMAIN = "schedule_editor"

CONF_LABELS = "labels"

SCHEDULE_DOMAIN = "schedule"
SCHEDULE_ID_KEY = "schedule_id"
WEEKDAYS = (
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
)

# Key under which the websocket API keeps its registered commands in hass.data.
WEBSOCKET_DATA_KEY = "websocket_api"

SIGNAL_CONFIG_CHANGED = f"{DOMAIN}_config_changed"

# Frontend panel
PANEL_URL_PATH = "schedule-editor"
PANEL_ELEMENT = "schedule-editor-panel"
PANEL_FILE = "schedule-editor-panel.js"
STATIC_URL_PATH = f"/{DOMAIN}_static"

# Day names for the `week` attribute, keyed by language code. English is the fallback.
WEEKDAY_NAMES: dict[str, tuple[str, ...]] = {
    "en": ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"),
    "de": ("Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"),
}
