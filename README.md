# Schedule Editor

Lets non-admin users edit selected `schedule` helpers. Existing helpers and
automations stay untouched; this only adds a permission layer and a
websocket API for a custom card.

## Setup
1. Copy `custom_components/schedule_editor` into your HA config directory and restart.
2. Add the integration; pick one or more labels.
3. Put one of those labels on every schedule helper that users may edit.

Only UI-created schedules can be edited (like in the default UI).

## Websocket API (for the card)
- `schedule_editor/list` -> `[{entity_id, name, icon, monday..sunday: [{from, to, data?}]}]`
- `schedule_editor/update` `{entity_id, monday..sunday}` -> updated entry.
  All seven days are required. Send blocks back exactly as received, so an
  existing `data` attribute is preserved. Name and icon cannot be changed.

Each successful edit adds an activity-log entry for the schedule entity.

## Mirror sensors
For every enabled schedule a binary sensor `<name> (mirror)` is created
(removed again when the label is removed). State is passed through from the
schedule. Attributes:
- `original_entity_id`
- `original_entity`: all attributes of the schedule entity (`friendly_name`,
  `icon`, `editable`, `next_event`, data of a currently running block, ...)
- `week`: list of exactly 7 days, index 0 = Monday ... 6 = Sunday. Each day:
  `friendly_name` (system language, English fallback), `status`
  (`past`/`current`/`future`), `events`: ordered list of
  `{start_time, end_time, data, status}`. Times are `HH:MM:SS`; end of day is `24:00:00`.

`week` and `original_entity` are excluded from the recorder.
