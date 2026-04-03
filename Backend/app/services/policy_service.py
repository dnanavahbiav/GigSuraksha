from __future__ import annotations

from datetime import datetime
from typing import Any

from app.repositories.policies import PolicyRepository
from app.repositories.workers import WorkerRepository
from app.services.quote_service import generate_quote
from app.utils.ids import generate_readable_id
from app.utils.time import compute_week_window, utcnow


def _coerce_valid_from(explicit_valid_from: datetime | None, feature_context: dict[str, Any] | None) -> datetime | None:
    if explicit_valid_from is not None:
        return explicit_valid_from
    if not feature_context:
        return None
    reference_date = feature_context.get("reference_date")
    if not reference_date:
        return None
    if isinstance(reference_date, datetime):
        return reference_date
    try:
        return datetime.fromisoformat(str(reference_date))
    except ValueError:
        return None


async def _resolve_worker_policy_input(database: Any, payload: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    worker_id = payload.get("worker_id")
    if worker_id:
        worker = await WorkerRepository(database).get_by_worker_id(worker_id)
        if worker is None:
            raise ValueError(f"Worker '{worker_id}' not found.")
        coverage_tier = payload.get("coverage_tier") or "standard"
        return worker["worker_id"], {
            "city": worker["city"],
            "zone": worker["zone"],
            "shift_type": worker["shift_type"],
            "coverage_tier": coverage_tier,
            "weekly_earnings": worker["weekly_earnings"],
            "weekly_active_hours": worker["weekly_active_hours"],
        }

    inline_worker_profile = payload.get("worker_profile")
    if inline_worker_profile:
        return generate_readable_id("wrk"), inline_worker_profile

    raise ValueError("Either worker_id or worker_profile must be provided.")


def _serialize_policy(document: dict[str, Any]) -> dict[str, Any]:
    return {
        "_id": document.get("_id"),
        "policy_id": document["policy_id"],
        "worker_id": document["worker_id"],
        "city": document["city"],
        "zone": document["zone"],
        "shift_type": document["shift_type"],
        "coverage_tier": document["coverage_tier"],
        "weekly_earnings": round(float(document["weekly_earnings"]), 2),
        "weekly_active_hours": round(float(document["weekly_active_hours"]), 2),
        "model_version": document["model_version"],
        "risk_summary": document["risk_summary"],
        "premium_breakdown": document["premium_breakdown"],
        "coverage_summary": document["coverage_summary"],
        "weekly_premium": int(document["premium_breakdown"]["final_weekly_premium"]),
        "max_weekly_payout": int(document["coverage_summary"]["max_weekly_payout"]),
        "coverage_percent": int(document["coverage_summary"]["coverage_percent"]),
        "valid_from": document["valid_from"],
        "valid_to": document["valid_to"],
        "status": document["status"],
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }


async def create_policy(database: Any, payload: dict[str, Any]) -> dict[str, Any]:
    feature_context = payload.get("feature_context") or None
    worker_id, worker_profile = await _resolve_worker_policy_input(database, payload)
    quote = generate_quote(worker_profile=worker_profile, feature_context=feature_context)
    valid_from, valid_to = compute_week_window(_coerce_valid_from(payload.get("valid_from"), feature_context))
    timestamp = utcnow()

    document = {
        "policy_id": generate_readable_id("pol"),
        "worker_id": worker_id,
        "city": quote["worker_profile"]["city"],
        "zone": quote["worker_profile"]["zone"],
        "shift_type": quote["worker_profile"]["shift_type"],
        "coverage_tier": quote["worker_profile"]["coverage_tier"],
        "weekly_earnings": quote["worker_profile"]["weekly_earnings"],
        "weekly_active_hours": quote["worker_profile"]["weekly_active_hours"],
        "model_version": quote["model_version"],
        "risk_summary": quote["risk_summary"],
        "premium_breakdown": quote["premium_breakdown"],
        "coverage_summary": quote["coverage_summary"],
        "valid_from": valid_from,
        "valid_to": valid_to,
        "status": "active",
        "created_at": timestamp,
        "updated_at": timestamp,
    }
    created = await PolicyRepository(database).create(document)
    return _serialize_policy(created)


async def get_policy(database: Any, policy_id: str) -> dict[str, Any] | None:
    policy = await PolicyRepository(database).get_by_policy_id(policy_id)
    if policy is None:
        return None
    return _serialize_policy(policy)


async def list_worker_policies(database: Any, worker_id: str) -> list[dict[str, Any]]:
    policies = await PolicyRepository(database).list_by_worker(worker_id)
    return [_serialize_policy(policy) for policy in policies]
