from __future__ import annotations

from datetime import timedelta
from typing import Any

from app.repositories.claims import ClaimRepository
from app.repositories.events import EventRepository
from app.repositories.policies import PolicyRepository
from app.services.catalog import (
    normalize_event_type,
    normalize_severity,
    severity_multiplier,
    validate_city_zone,
)
from app.services.claim_service import serialize_claim
from app.utils.ids import generate_readable_id
from app.utils.shifts import compute_shift_overlap_hours
from app.utils.time import intervals_overlap, utcnow


def serialize_event(document: dict[str, Any]) -> dict[str, Any]:
    return {
        "_id": document.get("_id"),
        "event_id": document["event_id"],
        "event_type": document["event_type"],
        "city": document["city"],
        "zone": document["zone"],
        "severity": document["severity"],
        "start_time": document["start_time"],
        "duration_hours": round(float(document["duration_hours"]), 2),
        "end_time": document["end_time"],
        "source": document["source"],
        "verified": bool(document["verified"]),
        "metadata": document["metadata"],
        "created_at": document["created_at"],
    }


def _policy_active_for_event(policy: dict[str, Any], event_start: Any, event_end: Any) -> bool:
    if policy.get("status") != "active":
        return False
    return intervals_overlap(policy["valid_from"], policy["valid_to"], event_start, event_end) > 0


async def simulate_event(database: Any, payload: dict[str, Any]) -> dict[str, Any]:
    city, zone_profile = validate_city_zone(payload["city"], payload["zone"])
    event_type = normalize_event_type(payload["event_type"])
    severity = normalize_severity(payload["severity"])
    start_time = payload["start_time"]
    duration_hours = float(payload["duration_hours"])
    if duration_hours <= 0:
        raise ValueError("duration_hours must be greater than 0.")
    end_time = start_time + timedelta(hours=duration_hours)
    timestamp = utcnow()
    event_document = {
        "event_id": generate_readable_id("evt"),
        "event_type": event_type,
        "city": city,
        "zone": zone_profile["zone"],
        "severity": severity,
        "start_time": start_time,
        "duration_hours": round(duration_hours, 2),
        "end_time": end_time,
        "source": payload["source"],
        "verified": bool(payload["verified"]),
        "metadata": payload.get("metadata") or {},
        "created_at": timestamp,
    }
    created_event = await EventRepository(database).create(event_document)

    policies = await PolicyRepository(database).list_active_by_location(city=city, zone=zone_profile["zone"])
    claims_repository = ClaimRepository(database)
    created_claims: list[dict[str, Any]] = []
    multiplier = severity_multiplier(severity)

    for policy in policies:
        overlap_hours = compute_shift_overlap_hours(policy["shift_type"], start_time, end_time)
        duplicate_claim = await claims_repository.get_duplicate(
            worker_id=policy["worker_id"],
            policy_id=policy["policy_id"],
            event_id=created_event["event_id"],
        )
        validation_checks = {
            "policy_active": _policy_active_for_event(policy, start_time, end_time),
            "zone_match": policy["city"] == city and policy["zone"] == zone_profile["zone"],
            "shift_overlap": overlap_hours > 0,
            "event_verified": bool(created_event["verified"]),
            "duplicate_claim": duplicate_claim is not None,
        }
        if not all(
            [
                validation_checks["policy_active"],
                validation_checks["zone_match"],
                validation_checks["shift_overlap"],
                validation_checks["event_verified"],
            ]
        ):
            continue
        if validation_checks["duplicate_claim"]:
            continue

        protected_hourly_income = float(policy["coverage_summary"]["protected_hourly_income"])
        weekly_cap_remaining = float(policy["coverage_summary"]["max_weekly_payout"])
        payout_estimate = min(protected_hourly_income * overlap_hours * multiplier, weekly_cap_remaining)
        claim_document = {
            "claim_id": generate_readable_id("clm"),
            "worker_id": policy["worker_id"],
            "policy_id": policy["policy_id"],
            "event_id": created_event["event_id"],
            "city": city,
            "zone": zone_profile["zone"],
            "event_type": event_type,
            "severity": severity,
            "affected_hours": round(overlap_hours, 2),
            "protected_hourly_income": round(protected_hourly_income, 2),
            "severity_multiplier": multiplier,
            "payout_estimate": round(payout_estimate, 2),
            "status": "approved",
            "validation_checks": validation_checks,
            "created_at": timestamp,
            "updated_at": timestamp,
        }
        created_claim = await claims_repository.create(claim_document)
        created_claims.append(serialize_claim(created_claim))

    return {
        "event": serialize_event(created_event),
        "claims_created": len(created_claims),
        "claims": created_claims,
    }
