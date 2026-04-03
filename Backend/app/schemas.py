from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class RiskPredictRequest(BaseModel):
    city: str
    zone: str
    shift_type: str
    coverage_tier: Literal["basic", "standard", "comprehensive"] = "standard"
    feature_context: dict[str, Any] = Field(default_factory=dict)


class RiskPredictResponse(BaseModel):
    model_version: str
    city: str
    zone: str
    shift_type: str
    coverage_tier: str | None = None
    risk_score: int
    risk_band: Literal["LOW", "MEDIUM", "HIGH"]
    expected_disrupted_hours: float
    premium_loading: int
    premium_breakdown_hint: dict[str, int]
    top_risk_drivers: list[str]


class WorkerProfileInput(BaseModel):
    city: str
    zone: str
    shift_type: str
    coverage_tier: Literal["basic", "standard", "comprehensive"]
    weekly_earnings: float = Field(gt=0)
    weekly_active_hours: float = Field(gt=0)


class QuoteGenerateRequest(BaseModel):
    worker_profile: WorkerProfileInput
    feature_context: dict[str, Any] = Field(default_factory=dict)


class WorkerProfileResponse(BaseModel):
    city: str
    zone: str
    shift_type: str
    coverage_tier: str
    weekly_earnings: float
    weekly_active_hours: float


class RiskSummaryResponse(BaseModel):
    risk_score: int
    risk_band: Literal["LOW", "MEDIUM", "HIGH"]
    expected_disrupted_hours: float
    premium_loading: int
    top_risk_drivers: list[str]
    zone_risk_band: Literal["LOW", "MEDIUM", "HIGH"]
    zone_baseline_risk_score: float


class PremiumBreakdownResponse(BaseModel):
    base_premium: int
    zone_risk_loading: int
    shift_exposure_loading: int
    coverage_factor: int
    ml_risk_loading: int
    safe_zone_discount: int
    final_weekly_premium: int


class CoverageSummaryResponse(BaseModel):
    coverage_tier: str
    coverage_percent: int
    max_weekly_payout: int
    insured_shift_hours_per_week: int
    protected_hours_basis: float
    protected_weekly_income: float
    protected_hourly_income: float


class QuoteGenerateResponse(BaseModel):
    model_version: str
    worker_profile: WorkerProfileResponse
    risk_summary: RiskSummaryResponse
    premium_breakdown: PremiumBreakdownResponse
    coverage_summary: CoverageSummaryResponse


class DemoQuoteRequestsResponse(BaseModel):
    quotes: list[QuoteGenerateRequest]
