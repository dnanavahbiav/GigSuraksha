from __future__ import annotations

from datetime import date, datetime, time, timedelta

from app.services.catalog import normalize_shift_type
from app.utils.time import intervals_overlap

SHIFT_WINDOW_BY_TYPE = {
    "morning_rush": (time(hour=7), time(hour=11), False),
    "afternoon": (time(hour=12), time(hour=16), False),
    "evening_rush": (time(hour=18), time(hour=22), False),
    "late_night": (time(hour=22), time(hour=1), True),
}


def _shift_interval_for_day(shift_type: str, day_value: date) -> tuple[datetime, datetime]:
    canonical_shift = normalize_shift_type(shift_type)
    start_time, end_time, crosses_midnight = SHIFT_WINDOW_BY_TYPE[canonical_shift]
    start_dt = datetime.combine(day_value, start_time)
    end_day = day_value + timedelta(days=1) if crosses_midnight else day_value
    end_dt = datetime.combine(end_day, end_time)
    return start_dt, end_dt


def compute_shift_overlap_hours(
    shift_type: str,
    event_start: datetime,
    event_end: datetime,
) -> float:
    canonical_shift = normalize_shift_type(shift_type)
    total_overlap = 0.0
    start_day = event_start.date() - timedelta(days=1)
    end_day = event_end.date()
    day_count = (end_day - start_day).days
    for offset in range(day_count + 1):
        shift_start, shift_end = _shift_interval_for_day(canonical_shift, start_day + timedelta(days=offset))
        total_overlap += intervals_overlap(event_start, event_end, shift_start, shift_end)
    return round(total_overlap, 2)


def has_shift_overlap(shift_type: str, event_start: datetime, event_end: datetime) -> bool:
    return compute_shift_overlap_hours(shift_type, event_start, event_end) > 0
