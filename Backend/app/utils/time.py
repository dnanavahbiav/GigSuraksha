from __future__ import annotations

from datetime import datetime, timedelta


def utcnow() -> datetime:
    return datetime.utcnow()


def ensure_datetime(value: datetime | None) -> datetime:
    return value or utcnow()


def compute_week_window(valid_from: datetime | None) -> tuple[datetime, datetime]:
    start = ensure_datetime(valid_from)
    end = start + timedelta(days=7)
    return start, end


def intervals_overlap(
    start_a: datetime,
    end_a: datetime,
    start_b: datetime,
    end_b: datetime,
) -> float:
    latest_start = max(start_a, start_b)
    earliest_end = min(end_a, end_b)
    overlap_seconds = (earliest_end - latest_start).total_seconds()
    if overlap_seconds <= 0:
        return 0.0
    return round(overlap_seconds / 3600.0, 2)
