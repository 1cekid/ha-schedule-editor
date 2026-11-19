"""Pure helpers for the weekly view (no Home Assistant imports)."""

from __future__ import annotations

from datetime import datetime, time, timedelta
from typing import Any

from .const import WEEKDAY_NAMES, WEEKDAYS

END_OF_DAY = "24:00:00"


def weekday_names(language: str | None) -> tuple[str, ...]:
    """Day names for a language code like 'de' or 'de-AT'; English as fallback."""
    code = (language or "en").lower().replace("_", "-")
    return WEEKDAY_NAMES.get(code) or WEEKDAY_NAMES.get(code.split("-")[0]) or WEEKDAY_NAMES["en"]


def iso_time(value: Any, *, end: bool = False) -> str:
    """Normalize a schedule time to 'HH:MM:SS'. End of day is '24:00:00'."""
    if isinstance(value, time):
        text = END_OF_DAY if value == time.max else value.replace(microsecond=0).isoformat()
    else:
        parts = str(value).split(":")
        parts += ["00"] * (3 - len(parts))
        text = ":".join(part.zfill(2) for part in parts[:3])
    if end and text == "00:00:00":
        text = END_OF_DAY
    return text


def normalize_config(config: dict[str, Any]) -> dict[str, Any]:
    """Return the config with sorted blocks and string times."""
    result = {key: value for key, value in config.items() if key not in WEEKDAYS}
    for day in WEEKDAYS:
        blocks = []
        for block in config.get(day) or []:
            item: dict[str, Any] = {
                "from": iso_time(block["from"]),
                "to": iso_time(block["to"], end=True),
            }
            if block.get("data"):
                item["data"] = dict(block["data"])
            blocks.append(item)
        blocks.sort(key=lambda item: (item["from"], item["to"]))
        result[day] = blocks
    return result


def build_week(
    config: dict[str, Any], now: datetime, names: tuple[str, ...]
) -> list[dict[str, Any]]:
    """The 7-day list (0 = Monday) with future/current/past status per day and event."""
    today = now.weekday()
    now_text = now.strftime("%H:%M:%S")
    week = []
    for index, day in enumerate(WEEKDAYS):
        if index < today:
            day_status = "past"
        elif index == today:
            day_status = "current"
        else:
            day_status = "future"

        events = []
        for block in config.get(day, []):
            if day_status != "current":
                status = day_status
            elif now_text < block["from"]:
                status = "future"
            elif now_text < block["to"]:
                status = "current"
            else:
                status = "past"
            events.append(
                {
                    "start_time": block["from"],
                    "end_time": block["to"],
                    "data": dict(block.get("data", {})),
                    "status": status,
                }
            )
        week.append({"friendly_name": names[index], "status": day_status, "events": events})
    return week


def next_boundary(config: dict[str, Any], now: datetime) -> datetime:
    """Next moment a status can change: a block start/end today, or midnight."""
    tzinfo = now.tzinfo
    candidates = [datetime.combine(now.date() + timedelta(days=1), time.min, tzinfo=tzinfo)]
    for block in config.get(WEEKDAYS[now.weekday()], []):
        for value in (block["from"], block["to"]):
            if value == END_OF_DAY:
                continue
            moment = datetime.combine(now.date(), time.fromisoformat(value), tzinfo=tzinfo)
            if moment > now:
                candidates.append(moment)
    return min(candidates)
