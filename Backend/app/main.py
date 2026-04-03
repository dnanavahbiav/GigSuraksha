from __future__ import annotations

import json

from fastapi import FastAPI, HTTPException

from app.config import DEMO_REQUESTS_PATH
from app.schemas import (
    DemoQuoteRequestsResponse,
    QuoteGenerateRequest,
    QuoteGenerateResponse,
    RiskPredictRequest,
    RiskPredictResponse,
)
from app.services.ml_service import predict_risk
from app.services.quote_service import generate_quote


def model_to_dict(instance: object) -> dict:
    if hasattr(instance, "model_dump"):
        return instance.model_dump()  # type: ignore[no-any-return]
    return instance.dict()  # type: ignore[attr-defined,no-any-return]


app = FastAPI(
    title="GigSuraksha Backend",
    version="0.1.0",
    description="Quote-generation backend for GigSuraksha weekly income protection.",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/ml/risk/predict", response_model=RiskPredictResponse)
def post_ml_risk_predict(payload: RiskPredictRequest) -> dict:
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
def post_quote_generate(payload: QuoteGenerateRequest) -> dict:
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


@app.get("/api/demo/quote-requests", response_model=DemoQuoteRequestsResponse)
def get_demo_quote_requests() -> dict:
    quotes = json.loads(DEMO_REQUESTS_PATH.read_text(encoding="utf-8"))
    return {"quotes": quotes}
