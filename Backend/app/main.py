from __future__ import annotations

import json
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware

from app.config import DEMO_REQUESTS_PATH, get_settings
from app.db import create_database
from app.schemas import (
    AdminSummaryResponse,
    ClaimsListResponse,
    ClaimResponse,
    DemoQuoteRequestsResponse,
    EventSimulationRequest,
    EventSimulationResponse,
    PolicyCreateRequest,
    PolicyListResponse,
    PolicyResponse,
    QuoteGenerateRequest,
    QuoteGenerateResponse,
    RiskPredictRequest,
    RiskPredictResponse,
    WorkerRegistrationRequest,
    WorkerResponse,
)
from app.services.admin_service import get_admin_summary
from app.services.claim_service import get_claim, list_claims, list_worker_claims
from app.services.event_service import simulate_event
from app.services.ml_service import predict_risk
from app.services.policy_service import create_policy, get_policy, list_worker_policies
from app.services.quote_service import generate_quote
from app.services.worker_service import get_worker, register_worker


def model_to_dict(instance: object) -> dict[str, Any]:
    if hasattr(instance, "model_dump"):
        return instance.model_dump()  # type: ignore[no-any-return]
    return instance.dict()  # type: ignore[attr-defined,no-any-return]


def get_database_from_request(request: Request) -> Any:
    return request.app.state.database


@asynccontextmanager
async def lifespan(app: FastAPI):
    database = app.state.injected_database
    owns_database = database is None
    if database is None:
        database = await create_database()
    app.state.database = database
    try:
        yield
    finally:
        if owns_database and database is not None:
            await database.close()


def create_app(database: Any | None = None) -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="GigSuraksha Backend",
        version="0.2.0",
        description="Phase 2 backend for GigSuraksha weekly income protection.",
        lifespan=lifespan,
    )
    app.state.injected_database = database
    if database is not None:
        app.state.database = database

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def health(request: Request) -> dict[str, str]:
        await get_database_from_request(request).ping()
        return {"status": "ok"}

    @app.post("/api/ml/risk/predict", response_model=RiskPredictResponse)
    async def post_ml_risk_predict(payload: RiskPredictRequest) -> dict[str, Any]:
        try:
            data = model_to_dict(payload)
            feature_context = data.get("feature_context") or None
            return predict_risk(
                city=data["city"],
                zone=data["zone"],
                shift_type=data["shift_type"],
                coverage_tier=data["coverage_tier"],
                feature_context=feature_context,
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except FileNotFoundError as exc:
            raise HTTPException(status_code=500, detail="ML model artifact not found.") from exc

    @app.post("/api/quote/generate", response_model=QuoteGenerateResponse)
    async def post_quote_generate(payload: QuoteGenerateRequest) -> dict[str, Any]:
        try:
            data = model_to_dict(payload)
            return generate_quote(
                worker_profile=data["worker_profile"],
                feature_context=data.get("feature_context") or None,
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except FileNotFoundError as exc:
            raise HTTPException(status_code=500, detail="ML model artifact not found.") from exc

    @app.post("/api/workers/register", response_model=WorkerResponse)
    async def post_worker_register(payload: WorkerRegistrationRequest, request: Request) -> dict[str, Any]:
        try:
            return await register_worker(get_database_from_request(request), model_to_dict(payload))
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    @app.get("/api/workers/{worker_id}", response_model=WorkerResponse)
    async def get_worker_by_id(worker_id: str, request: Request) -> dict[str, Any]:
        worker = await get_worker(get_database_from_request(request), worker_id)
        if worker is None:
            raise HTTPException(status_code=404, detail="Worker not found.")
        return worker

    @app.post("/api/policies/create", response_model=PolicyResponse)
    async def post_policy_create(payload: PolicyCreateRequest, request: Request) -> dict[str, Any]:
        try:
            return await create_policy(get_database_from_request(request), model_to_dict(payload))
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except FileNotFoundError as exc:
            raise HTTPException(status_code=500, detail="ML model artifact not found.") from exc

    @app.get("/api/policies/worker/{worker_id}", response_model=PolicyListResponse)
    async def get_policies_for_worker(worker_id: str, request: Request) -> dict[str, Any]:
        policies = await list_worker_policies(get_database_from_request(request), worker_id)
        return {"policies": policies}

    @app.get("/api/policies/{policy_id}", response_model=PolicyResponse)
    async def get_policy_by_id(policy_id: str, request: Request) -> dict[str, Any]:
        policy = await get_policy(get_database_from_request(request), policy_id)
        if policy is None:
            raise HTTPException(status_code=404, detail="Policy not found.")
        return policy

    @app.post("/api/events/simulate", response_model=EventSimulationResponse)
    async def post_event_simulate(payload: EventSimulationRequest, request: Request) -> dict[str, Any]:
        try:
            return await simulate_event(get_database_from_request(request), model_to_dict(payload))
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    @app.get("/api/claims/worker/{worker_id}", response_model=ClaimsListResponse)
    async def get_claims_for_worker(worker_id: str, request: Request) -> dict[str, Any]:
        claims = await list_worker_claims(get_database_from_request(request), worker_id)
        return {"claims": claims}

    @app.get("/api/claims/{claim_id}", response_model=ClaimResponse)
    async def get_claim_by_id(claim_id: str, request: Request) -> dict[str, Any]:
        claim = await get_claim(get_database_from_request(request), claim_id)
        if claim is None:
            raise HTTPException(status_code=404, detail="Claim not found.")
        return claim

    @app.get("/api/claims", response_model=ClaimsListResponse)
    async def get_claims(
        request: Request,
        status: str | None = Query(default=None),
    ) -> dict[str, Any]:
        claims = await list_claims(get_database_from_request(request), status=status)
        return {"claims": claims}

    @app.get("/api/admin/summary", response_model=AdminSummaryResponse)
    async def get_admin_dashboard_summary(request: Request) -> dict[str, Any]:
        return await get_admin_summary(get_database_from_request(request))

    @app.get("/api/demo/quote-requests", response_model=DemoQuoteRequestsResponse)
    async def get_demo_quote_requests() -> dict[str, Any]:
        quotes = json.loads(DEMO_REQUESTS_PATH.read_text(encoding="utf-8"))
        return {"quotes": quotes}

    return app


app = create_app()
