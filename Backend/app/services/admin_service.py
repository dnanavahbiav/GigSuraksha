from __future__ import annotations

import json
from collections import Counter
from typing import Any

from app.config import DEMO_OUTPUTS_PATH
from app.repositories.claims import ClaimRepository
from app.repositories.events import EventRepository
from app.repositories.policies import PolicyRepository
from app.repositories.workers import WorkerRepository
from app.services.claim_service import serialize_claim
from app.services.event_service import serialize_event


def _load_forecast_cards() -> list[dict[str, Any]]:
    if not DEMO_OUTPUTS_PATH.exists():
        return []
    outputs = json.loads(DEMO_OUTPUTS_PATH.read_text(encoding="utf-8"))
    cards: list[dict[str, Any]] = []
    for item in outputs:
        cards.append(
            {
                "city": item["worker_profile"]["city"],
                "zone": item["worker_profile"]["zone"],
                "shift_type": item["worker_profile"]["shift_type"],
                "coverage_tier": item["worker_profile"]["coverage_tier"],
                "risk_band": item["risk_summary"]["risk_band"],
                "risk_score": item["risk_summary"]["risk_score"],
                "expected_disrupted_hours": item["risk_summary"]["expected_disrupted_hours"],
                "suggested_weekly_premium": item["premium_breakdown"]["final_weekly_premium"],
                "model_version": item["model_version"],
            }
        )
    return cards


async def get_admin_summary(database: Any) -> dict[str, Any]:
    worker_repository = WorkerRepository(database)
    policy_repository = PolicyRepository(database)
    event_repository = EventRepository(database)
    claim_repository = ClaimRepository(database)

    recent_events_raw = await event_repository.list_recent(limit=5)
    recent_claims_raw = await claim_repository.list_all(limit=5)
    all_claims_raw = await claim_repository.list_all()

    claims_by_status = Counter(claim["status"] for claim in all_claims_raw)
    claims_by_event_type = Counter(claim["event_type"] for claim in all_claims_raw)

    return {
        "total_workers": await worker_repository.count(),
        "total_active_policies": await policy_repository.count_active(),
        "total_events": await event_repository.count(),
        "total_claims": await claim_repository.count(),
        "claims_by_status": dict(claims_by_status),
        "claims_by_event_type": dict(claims_by_event_type),
        "recent_events": [serialize_event(event) for event in recent_events_raw],
        "recent_claims": [serialize_claim(claim) for claim in recent_claims_raw],
        "forecast_cards": _load_forecast_cards(),
    }
