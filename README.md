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

## Editor dashboard
The integration adds a dashboard at `/schedule-editor`. It has no sidebar
entry, is open to non-admin users and is generated automatically, so it
cannot be edited in the dashboard editor.

- `/schedule-editor` shows a tile for every editable schedule.
- `/schedule-editor/<object_id>` opens one schedule, e.g.
  `/schedule-editor/heating` for `schedule.heating`. On any dashboard card,
  use the tap action "Navigate" with this path.

Views appear and disappear on their own when the label of a schedule changes.
The editor is also available as a card for your own dashboards:
`type: custom:schedule-editor-card` with `entity: schedule.heating`.

Week grid, 30-minute snapping, no overlapping blocks:
- Mouse: click on empty space adds a 30-minute block, drag adds a longer one.
  Drag a block to move it (also to another day), drag its top or bottom edge to resize it.
  Click a block to edit exact times or delete it. Ctrl+Z / Ctrl+Y undo and redo.
- Touch: every interaction starts with a long press (about 0.4 s), so normal
  scrolling is untouched. Long press and release on empty space adds a block,
  long press and drag adds or moves one, long press on an edge resizes, and
  long press and release on a block opens the edit sheet.
- Undo/redo covers the current session; nothing is stored until you press Save.
  Unsaved changes survive leaving the view (until the page is reloaded).

## Frontend sources
The panel is built from `panel/` and the result is committed to
`custom_components/schedule_editor/frontend/`, so the integration works without a build step.

```
cd panel
npm install
npm test        # grid logic
npm run build   # writes custom_components/schedule_editor/frontend/schedule-editor.js
```
