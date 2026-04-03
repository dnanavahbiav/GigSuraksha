from __future__ import annotations

from typing import Any

from app.config import (
    COVERAGE_TIER_CONFIG,
    SAFE_ZONE_DISCOUNT_AMOUNT,
    SHIFT_LOADING_BY_TYPE,
    ZONE_LOADING_BY_RISK_BAND,
)
from src.config.metadata import CITY_ALIASES, CITY_METADATA, SHIFT_ALIASES, SHIFT_DEFINITIONS, ZONE_METADATA


def normalize_key(value: str) -> str:
    return " ".join(value.strip().lower().replace("-", " ").replace("_", " ").split())


CITY_NAME_MAP = {normalize_key(city): city for city in CITY_METADATA}
CITY_NAME_MAP.update({normalize_key(alias): city for alias, city in CITY_ALIASES.items()})

SHIFT_NAME_MAP = {
    normalize_key(shift_type): shift_type
    for shift_type in SHIFT_DEFINITIONS
}
SHIFT_NAME_MAP.update({normalize_key(alias): shift_type for alias, shift_type in SHIFT_ALIASES.items()})

ZONE_ALIAS_MAP = {normalize_key(zone): zone for zone in ZONE_METADATA}
ZONE_ALIAS_MAP.update(
    {
        "sector 49": "Gurgaon Sec 49",
        "sec 49": "Gurgaon Sec 49",
        "gurgaon sector 49": "Gurgaon Sec 49",
        "gurugram sector 49": "Gurgaon Sec 49",
        "gurgaon sec 49": "Gurgaon Sec 49",
        "gurugram sec 49": "Gurgaon Sec 49",
    }
)


def zone_baseline_risk_score(zone_metadata: dict[str, Any]) -> float:
    return round(
        zone_metadata["flood_prone_score"] * 0.45
        + zone_metadata["aqi_sensitivity_score"] * 0.30
        + zone_metadata["zone_access_risk_score"] * 0.25,
        4,
    )


def zone_risk_band_from_score(score: float) -> str:
    if score >= 0.60:
        return "HIGH"
    if score >= 0.40:
        return "MEDIUM"
    return "LOW"


def normalize_city(city: str) -> str:
    canonical = CITY_NAME_MAP.get(normalize_key(city))
    if canonical is None:
        raise ValueError(f"Unsupported city '{city}'.")
    return canonical


def normalize_shift_type(shift_type: str) -> str:
    canonical = SHIFT_NAME_MAP.get(normalize_key(shift_type))
    if canonical is None:
        raise ValueError(f"Unsupported shift_type '{shift_type}'.")
    return canonical


def normalize_zone(zone: str) -> str:
    canonical = ZONE_ALIAS_MAP.get(normalize_key(zone))
    if canonical is None:
        raise ValueError(f"Unsupported zone '{zone}'.")
    return canonical


def get_zone_profile(zone: str) -> dict[str, Any]:
    canonical_zone = normalize_zone(zone)
    metadata = ZONE_METADATA[canonical_zone]
    baseline_score = zone_baseline_risk_score(metadata)
    risk_band = zone_risk_band_from_score(baseline_score)
    safe_zone_discount_amount = SAFE_ZONE_DISCOUNT_AMOUNT if risk_band == "LOW" else 0
    return {
        "zone": canonical_zone,
        "city": metadata["city"],
        "zone_flood_prone_score": metadata["flood_prone_score"],
        "zone_aqi_sensitivity_score": metadata["aqi_sensitivity_score"],
        "zone_access_risk_score": metadata["zone_access_risk_score"],
        "zone_baseline_risk_score": baseline_score,
        "zone_risk_band": risk_band,
        "zone_risk_loading": ZONE_LOADING_BY_RISK_BAND[risk_band],
        "safe_zone_discount_amount": safe_zone_discount_amount,
        "is_safe_zone": safe_zone_discount_amount > 0,
    }


def get_shift_profile(shift_type: str) -> dict[str, Any]:
    canonical_shift = normalize_shift_type(shift_type)
    metadata = SHIFT_DEFINITIONS[canonical_shift]
    insured_shift_hours_per_week = len(metadata["hours"]) * 7
    return {
        "shift_type": canonical_shift,
        "label": metadata["label"],
        "start_hour": metadata["start_hour"],
        "end_hour": metadata["end_hour"],
        "insured_shift_hours_per_week": insured_shift_hours_per_week,
        "shift_loading": SHIFT_LOADING_BY_TYPE[canonical_shift],
    }


def get_coverage_profile(coverage_tier: str) -> dict[str, Any]:
    canonical_tier = coverage_tier.strip().lower()
    if canonical_tier not in COVERAGE_TIER_CONFIG:
        raise ValueError(f"Unsupported coverage_tier '{coverage_tier}'.")
    return {
        "coverage_tier": canonical_tier,
        **COVERAGE_TIER_CONFIG[canonical_tier],
    }
