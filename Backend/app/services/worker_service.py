from __future__ import annotations

from typing import Any

from app.repositories.workers import WorkerRepository
from app.services.catalog import normalize_platform, validate_city_zone, normalize_shift_type
from app.utils.ids import generate_readable_id
from app.utils.time import utcnow


def _serialize_worker(document: dict[str, Any]) -> dict[str, Any]:
    return {
        "_id": document.get("_id"),
        "worker_id": document["worker_id"],
        "name": document["name"],
        "phone": document["phone"],
        "city": document["city"],
        "platform": document["platform"],
        "zone": document["zone"],
        "shift_type": document["shift_type"],
        "weekly_earnings": round(float(document["weekly_earnings"]), 2),
        "weekly_active_hours": round(float(document["weekly_active_hours"]), 2),
        "upi_id": document["upi_id"],
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }


async def register_worker(database: Any, payload: dict[str, Any]) -> dict[str, Any]:
    weekly_earnings = float(payload["weekly_earnings"])
    weekly_active_hours = float(payload["weekly_active_hours"])
    if weekly_earnings <= 0:
        raise ValueError("weekly_earnings must be greater than 0.")
    if weekly_active_hours <= 0:
        raise ValueError("weekly_active_hours must be greater than 0.")

    city, zone_profile = validate_city_zone(payload["city"], payload["zone"])
    shift_type = normalize_shift_type(payload["shift_type"])
    platform = normalize_platform(payload["platform"])
    timestamp = utcnow()
    repository = WorkerRepository(database)
    document = {
        "worker_id": generate_readable_id("wrk"),
        "name": payload["name"].strip(),
        "phone": payload["phone"].strip(),
        "city": city,
        "platform": platform,
        "zone": zone_profile["zone"],
        "shift_type": shift_type,
        "weekly_earnings": round(weekly_earnings, 2),
        "weekly_active_hours": round(weekly_active_hours, 2),
        "upi_id": payload["upi_id"].strip(),
        "created_at": timestamp,
        "updated_at": timestamp,
    }
    created = await repository.create(document)
    return _serialize_worker(created)


async def get_worker(database: Any, worker_id: str) -> dict[str, Any] | None:
    repository = WorkerRepository(database)
    worker = await repository.get_by_worker_id(worker_id)
    if worker is None:
        return None
    return _serialize_worker(worker)
