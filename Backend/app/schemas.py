from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field, model_validator

CoverageTier = Literal["basic", "standard", "comprehensive"]
RiskBand = Literal["LOW", "MEDIUM", "HIGH"]
PolicyStatus = Literal["active", "expired", "cancelled"]
ClaimStatus = Literal["auto_initiated", "approved", "rejected"]
SeverityLevel = Literal["low", "moderate", "high", "severe"]


class RiskPredictRequest(BaseModel):
    city: str
    zone: str
    shift_type: str
    coverage_tier: CoverageTier = "standard"
    feature_context: dict[str, Any] = Field(default_factory=dict)


class RiskPredictResponse(BaseModel):
    model_version: str
    city: str
    zone: str
    shift_type: str
    coverage_tier: str | None = None
    risk_score: int
    risk_band: RiskBand
    expected_disrupted_hours: float
    premium_loading: int
    premium_breakdown_hint: dict[str, int]
    top_risk_drivers: list[str]


class WorkerProfileInput(BaseModel):
    city: str
    zone: str
    shift_type: str
    coverage_tier: CoverageTier
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
    risk_band: RiskBand
    expected_disrupted_hours: float
    premium_loading: int
    top_risk_drivers: list[str]
    zone_risk_band: RiskBand
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


class WorkerRegistrationRequest(BaseModel):
    name: str = Field(min_length=2)
    phone: str = Field(min_length=8)
    city: str
    platform: str
    zone: str
    shift_type: str
    weekly_earnings: float = Field(gt=0)
    weekly_active_hours: float = Field(gt=0)
    upi_id: str = Field(min_length=3)


class WorkerResponse(BaseModel):
    worker_id: str
    name: str
    phone: str
    city: str
    platform: str
    zone: str
    shift_type: str
    weekly_earnings: float
    weekly_active_hours: float
    upi_id: str
    created_at: datetime
    updated_at: datetime


class PolicyCreateRequest(BaseModel):
    worker_id: str | None = None
    coverage_tier: CoverageTier | None = None
    worker_profile: WorkerProfileInput | None = None
    feature_context: dict[str, Any] = Field(default_factory=dict)
    valid_from: datetime | None = None

    @model_validator(mode="after")
    def validate_input_source(self) -> "PolicyCreateRequest":
        if self.worker_id and self.worker_profile:
            raise ValueError("Provide either worker_id or worker_profile, not both.")
        if not self.worker_id and not self.worker_profile:
            raise ValueError("Either worker_id or worker_profile must be provided.")
        if self.worker_id and self.coverage_tier is None:
            self.coverage_tier = "standard"
        return self


class PolicyResponse(BaseModel):
    policy_id: str
    worker_id: str
    city: str
    zone: str
    shift_type: str
    coverage_tier: str
    weekly_earnings: float
    weekly_active_hours: float
    model_version: str
    risk_summary: RiskSummaryResponse
    premium_breakdown: PremiumBreakdownResponse
    coverage_summary: CoverageSummaryResponse
    weekly_premium: int
    max_weekly_payout: int
    coverage_percent: int
    valid_from: datetime
    valid_to: datetime
    status: PolicyStatus
    created_at: datetime
    updated_at: datetime


class PolicyListResponse(BaseModel):
    policies: list[PolicyResponse]


class EventSimulationRequest(BaseModel):
    event_type: str
    city: str
    zone: str
    severity: SeverityLevel
    start_time: datetime
    duration_hours: float = Field(gt=0)
    source: str = "simulation"
    verified: bool = True
    metadata: dict[str, Any] = Field(default_factory=dict)


class EventResponse(BaseModel):
    event_id: str
    event_type: str
    city: str
    zone: str
    severity: str
    start_time: datetime
    duration_hours: float
    end_time: datetime
    source: str
    verified: bool
    metadata: dict[str, Any]
    created_at: datetime


class ClaimResponse(BaseModel):
    claim_id: str
    worker_id: str
    policy_id: str
    event_id: str
    city: str
    zone: str
    event_type: str
    severity: str
    affected_hours: float
    protected_hourly_income: float
    severity_multiplier: float
    payout_estimate: float
    status: str
    validation_checks: dict[str, bool]
    created_at: datetime
    updated_at: datetime


class EventSimulationResponse(BaseModel):
    event: EventResponse
    claims_created: int
    claims: list[ClaimResponse]


class ClaimsListResponse(BaseModel):
    claims: list[ClaimResponse]


class ForecastCardResponse(BaseModel):
    city: str
    zone: str
    shift_type: str
    coverage_tier: str
    risk_band: RiskBand
    risk_score: int
    expected_disrupted_hours: float
    suggested_weekly_premium: int
    model_version: str


class AdminSummaryResponse(BaseModel):
    total_workers: int
    total_active_policies: int
    total_events: int
    total_claims: int
    claims_by_status: dict[str, int]
    claims_by_event_type: dict[str, int]
    recent_events: list[EventResponse]
    recent_claims: list[ClaimResponse]
    forecast_cards: list[ForecastCardResponse]
