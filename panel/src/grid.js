// Pure grid logic for the schedule editor: no DOM, no Home Assistant.
//
// Times are integers: minutes since midnight (0..1440). 1440 is the end of the
// day and is sent to / received from the schedule helper as "24:00:00".
// A schedule is `days`: an array of 7 arrays of blocks (0 = Monday), where a
// block is { id, from, to, data? }. All operations return new arrays and never
// mutate their input, so snapshots can be used directly for undo/redo.

export const DAY_MINUTES = 1440;
export const SNAP = 30;
export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

let counter = 0;
const nextId = () => ++counter;

export const clamp = (value, lo, hi) => Math.min(Math.max(value, lo), hi);

// ---------------------------------------------------------------- time ----

export function parseTime(value) {
  const [h = "0", m = "0"] = String(value).split(":");
  const minutes = Number(h) * 60 + Number(m);
  return Number.isFinite(minutes) ? clamp(minutes, 0, DAY_MINUTES) : NaN;
}

const pad = (n) => String(n).padStart(2, "0");

/** "HH:MM" for display; the end of the day is "24:00". */
export function formatHM(min) {
  return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
}

/** "HH:MM:SS" as the schedule helper expects it. */
export function formatTime(min) {
  return `${formatHM(min)}:00`;
}

/** Value for <input type="time">. Native inputs cannot show 24:00, so the end of day is 00:00. */
export function toInputValue(min) {
  return min >= DAY_MINUTES ? "00:00" : formatHM(min);
}

/** Parse an <input type="time"> value. As an end time, 00:00 means the end of the day. */
export function fromInputValue(value, isEnd = false) {
  if (!/^\d{1,2}:\d{2}/.test(value || "")) return NaN;
  const min = parseTime(value);
  return isEnd && min === 0 ? DAY_MINUTES : min;
}

// ------------------------------------------------------- conversions ----

const sortBlocks = (blocks) => [...blocks].sort((a, b) => a.from - b.from || a.to - b.to);

/** Build `days` from an item of `schedule_editor/list` (or `/update`). */
export function fromList(item) {
  return WEEKDAYS.map((day) =>
    sortBlocks(
      (item[day] || []).map((raw) => {
        const from = parseTime(raw.from);
        const to = parseTime(raw.to) || DAY_MINUTES;
        const block = { id: nextId(), from, to };
        // Unknown extra data is carried through untouched.
        if (raw.data && Object.keys(raw.data).length) block.data = raw.data;
        return block;
      })
    )
  );
}

/** The week part of a `schedule_editor/update` message. */
export function toPayload(days) {
  const payload = {};
  WEEKDAYS.forEach((day, index) => {
    payload[day] = days[index].map((block) => {
      const item = { from: formatTime(block.from), to: formatTime(block.to) };
      if (block.data) item.data = block.data;
      return item;
    });
  });
  return payload;
}

// -------------------------------------------------------- geometry ----

export const minuteToPx = (minute, slotH) => (minute / SNAP) * slotH;
export const pxToMinute = (px, slotH) => (px / slotH) * SNAP;

export const snapMin = (minute) => Math.round(minute / SNAP) * SNAP;
export const floorSnap = (minute) => Math.floor(minute / SNAP) * SNAP;

export function overlaps(blocks, from, to, ignoreId) {
  return blocks.some((b) => b.id !== ignoreId && from < b.to && to > b.from);
}

/** Free space around a minute: previous block end .. next block start. */
export function gapAround(blocks, minute, ignoreId) {
  let lo = 0;
  let hi = DAY_MINUTES;
  for (const b of blocks) {
    if (b.id === ignoreId) continue;
    if (b.to <= minute) lo = Math.max(lo, b.to);
    else if (b.from > minute) hi = Math.min(hi, b.from);
  }
  return { lo, hi };
}

/**
 * Which block (and which part of it) is at a minute.
 * Zones: "start" / "end" are the resize edges (at most a third of the block each),
 * "body" moves the block. Returns null on empty space.
 */
export function hitTest(blocks, minute, pxPerMin, edgePx) {
  const block = blocks.find((b) => minute >= b.from && minute < b.to);
  if (!block) return null;
  const heightPx = (block.to - block.from) * pxPerMin;
  const edge = Math.min(edgePx, heightPx / 3);
  const fromTop = (minute - block.from) * pxPerMin;
  const fromBottom = (block.to - minute) * pxPerMin;
  const zone = fromTop <= edge ? "start" : fromBottom <= edge ? "end" : "body";
  return { block, zone };
}

// ------------------------------------------------------ operations ----

/**
 * Block created by pressing at `anchorMin` and dragging to `currentMin`:
 * covers the slots between both, limited to the free space around the anchor.
 * Returns null if nothing fits.
 */
export function createRange(blocks, anchorMin, currentMin) {
  const a = floorSnap(anchorMin);
  const c = floorSnap(currentMin);
  const { lo, hi } = gapAround(blocks, anchorMin);
  const from = Math.max(Math.min(a, c), lo);
  const to = Math.min(Math.max(a, c) + SNAP, hi);
  return to > from ? { from, to } : null;
}

/** New position of a block whose start or end edge is dragged to `pointerMin`. */
export function resizeBlock(blocks, block, edge, pointerMin) {
  const { lo, hi } = gapAround(blocks, (block.from + block.to) / 2, block.id);
  const minLen = Math.min(SNAP, block.to - block.from);
  if (edge === "start") {
    return { from: clamp(snapMin(pointerMin), lo, block.to - minLen), to: block.to };
  }
  return { from: block.from, to: clamp(snapMin(pointerMin), block.from + minLen, hi) };
}

/**
 * Where a dragged block would land. `grab` is the offset between the block start
 * and the pointer at the start of the drag. Other blocks are not an obstacle on
 * the way: only the final position is checked (`valid`).
 */
export function moveBlock(days, block, toDay, pointerMin, grab) {
  const length = block.to - block.from;
  const from = clamp(snapMin(pointerMin - grab), 0, DAY_MINUTES - length);
  const to = from + length;
  return { day: toDay, from, to, valid: !overlaps(days[toDay], from, to, block.id) };
}

/** Check manually entered times. Returns an error code or null. */
export function validateTimes(blocks, id, from, to) {
  if (!Number.isFinite(from) || !Number.isFinite(to)) return "invalid";
  if (to <= from) return "order";
  if (overlaps(blocks, from, to, id)) return "overlap";
  return null;
}

// ---------------------------------------------------------- edits ----

const withDay = (days, index, blocks) =>
  days.map((day, k) => (k === index ? sortBlocks(blocks) : day));

export function addBlock(days, day, from, to) {
  return withDay(days, day, [...days[day], { id: nextId(), from, to }]);
}

export function updateBlock(days, day, id, from, to) {
  return withDay(
    days,
    day,
    days[day].map((b) => (b.id === id ? { ...b, from, to } : b))
  );
}

export function removeBlock(days, day, id) {
  return withDay(
    days,
    day,
    days[day].filter((b) => b.id !== id)
  );
}

/** Move a block to another day and/or time. */
export function relocateBlock(days, fromDay, id, toDay, from, to) {
  const block = days[fromDay].find((b) => b.id === id);
  if (!block) return days;
  if (fromDay === toDay) return updateBlock(days, fromDay, id, from, to);
  const moved = { ...block, from, to };
  return days.map((day, k) => {
    if (k === fromDay) return day.filter((b) => b.id !== id);
    if (k === toDay) return sortBlocks([...day, moved]);
    return day;
  });
}
