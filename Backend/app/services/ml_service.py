from __future__ import annotations

import pickle
from functools import lru_cache
from typing import Any

from app.services.catalog import get_zone_profile, normalize_city, normalize_shift_type
from src.portable_ml import predict_weekly_risk
from src.utils.paths import MODEL_ARTIFACT_PATH


@lru_cache(maxsize=1)
def get_model_summary() -> dict[str, Any]:
    with MODEL_ARTIFACT_PATH.open("rb") as handle:
        artifact = pickle.load(handle)
    return artifact["summary"]


def predict_risk(
    city: str,
    zone: str,
    shift_type: str,
    coverage_tier: str,
    feature_context: dict[str, Any] | None = None,
) -> dict[str, Any]:
    zone_profile = get_zone_profile(zone)
    canonical_city = normalize_city(city)
    canonical_shift = normalize_shift_type(shift_type)
    if canonical_city != zone_profile["city"]:
        canonical_city = zone_profile["city"]

    prediction = predict_weekly_risk(
        city=canonical_city,
        zone=zone_profile["zone"],
        shift_type=canonical_shift,
        coverage_tier=coverage_tier,
        feature_context=feature_context,
        artifact_path=MODEL_ARTIFACT_PATH,
    )
    prediction["model_version"] = get_model_summary()["model_version"]
    return prediction
