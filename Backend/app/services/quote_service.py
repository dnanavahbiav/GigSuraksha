from __future__ import annotations

from typing import Any

from app.config import BASE_PREMIUM
from app.services.catalog import get_coverage_profile, get_shift_profile, get_zone_profile, normalize_city
from app.services.ml_service import predict_risk


def generate_quote(worker_profile: dict[str, Any], feature_context: dict[str, Any] | None = None) -> dict[str, Any]:
    weekly_earnings = float(worker_profile["weekly_earnings"])
    weekly_active_hours = float(worker_profile["weekly_active_hours"])
    if weekly_earnings <= 0:
        raise ValueError("weekly_earnings must be greater than 0.")
    if weekly_active_hours <= 0:
        raise ValueError("weekly_active_hours must be greater than 0.")

    zone_profile = get_zone_profile(worker_profile["zone"])
    shift_profile = get_shift_profile(worker_profile["shift_type"])
    coverage_profile = get_coverage_profile(worker_profile["coverage_tier"])
    canonical_city = normalize_city(worker_profile["city"])
    if canonical_city != zone_profile["city"]:
        canonical_city = zone_profile["city"]

    risk_summary = predict_risk(
        city=canonical_city,
        zone=zone_profile["zone"],
        shift_type=shift_profile["shift_type"],
        coverage_tier=coverage_profile["coverage_tier"],
        feature_context=feature_context,
    )

    zone_risk_loading = zone_profile["zone_risk_loading"]
    shift_exposure_loading = shift_profile["shift_loading"]
    coverage_factor = coverage_profile["coverage_factor"]
    ml_risk_loading = int(risk_summary["premium_loading"])
    safe_zone_discount_amount = zone_profile["safe_zone_discount_amount"]
    final_weekly_premium = (
        BASE_PREMIUM
        + zone_risk_loading
        + shift_exposure_loading
        + coverage_factor
        + ml_risk_loading
        - safe_zone_discount_amount
    )

    protected_weekly_income = round(
        weekly_earnings * (coverage_profile["coverage_percent"] / 100.0),
        2,
    )
    protected_hours_basis = round(
        min(weekly_active_hours, float(shift_profile["insured_shift_hours_per_week"])),
        2,
    )
    if protected_hours_basis <= 0:
        raise ValueError("Protected hours basis must be greater than 0.")
    protected_hourly_income = round(protected_weekly_income / protected_hours_basis, 2)

    return {
        "model_version": risk_summary["model_version"],
        "worker_profile": {
            "city": canonical_city,
            "zone": zone_profile["zone"],
            "shift_type": shift_profile["shift_type"],
            "coverage_tier": coverage_profile["coverage_tier"],
            "weekly_earnings": round(weekly_earnings, 2),
            "weekly_active_hours": round(weekly_active_hours, 2),
        },
        "risk_summary": {
            "risk_score": int(risk_summary["risk_score"]),
            "risk_band": risk_summary["risk_band"],
            "expected_disrupted_hours": float(risk_summary["expected_disrupted_hours"]),
            "premium_loading": ml_risk_loading,
            "top_risk_drivers": risk_summary["top_risk_drivers"],
            "zone_risk_band": zone_profile["zone_risk_band"],
            "zone_baseline_risk_score": zone_profile["zone_baseline_risk_score"],
        },
        "premium_breakdown": {
            "base_premium": BASE_PREMIUM,
            "zone_risk_loading": zone_risk_loading,
            "shift_exposure_loading": shift_exposure_loading,
            "coverage_factor": coverage_factor,
            "ml_risk_loading": ml_risk_loading,
            "safe_zone_discount": -safe_zone_discount_amount,
            "final_weekly_premium": int(final_weekly_premium),
        },
        "coverage_summary": {
            "coverage_tier": coverage_profile["coverage_tier"],
            "coverage_percent": coverage_profile["coverage_percent"],
            "max_weekly_payout": coverage_profile["max_weekly_payout"],
            "insured_shift_hours_per_week": shift_profile["insured_shift_hours_per_week"],
            "protected_hours_basis": protected_hours_basis,
            "protected_weekly_income": protected_weekly_income,
            "protected_hourly_income": protected_hourly_income,
        },
    }
