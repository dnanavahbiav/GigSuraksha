from __future__ import annotations

from typing import Any

from app.repositories.claims import ClaimRepository


def serialize_claim(document: dict[str, Any]) -> dict[str, Any]:
    return {
        "_id": document.get("_id"),
        "claim_id": document["claim_id"],
        "worker_id": document["worker_id"],
        "policy_id": document["policy_id"],
        "event_id": document["event_id"],
        "city": document["city"],
        "zone": document["zone"],
        "event_type": document["event_type"],
        "severity": document["severity"],
        "affected_hours": round(float(document["affected_hours"]), 2),
        "protected_hourly_income": round(float(document["protected_hourly_income"]), 2),
        "severity_multiplier": float(document["severity_multiplier"]),
        "payout_estimate": round(float(document["payout_estimate"]), 2),
        "status": document["status"],
        "validation_checks": document["validation_checks"],
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }


async def get_claim(database: Any, claim_id: str) -> dict[str, Any] | None:
    claim = await ClaimRepository(database).get_by_claim_id(claim_id)
    if claim is None:
        return None
    return serialize_claim(claim)


async def list_worker_claims(database: Any, worker_id: str) -> list[dict[str, Any]]:
    claims = await ClaimRepository(database).list_by_worker(worker_id)
    return [serialize_claim(claim) for claim in claims]


async def list_claims(database: Any, status: str | None = None) -> list[dict[str, Any]]:
    claims = await ClaimRepository(database).list_all(status=status)
    return [serialize_claim(claim) for claim in claims]
