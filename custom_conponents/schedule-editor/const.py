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
