# Backend Integration Contract

## Prediction Input Schema

```json
{
  "city": "Bengaluru",
  "zone": "Koramangala",
  "shift_type": "evening_rush",
  "coverage_tier": "standard",
  "feature_context": {
    "reference_date": "2026-04-03"
  }
}
```

## Prediction Output Schema

```json
{
  "model_version": "weekly-disruption-risk-v1",
  "risk_score": 67,
  "risk_band": "HIGH",
  "expected_disrupted_hours": 5.4,
  "premium_loading": 12,
  "premium_breakdown_hint": {
    "ml_risk_loading": 12
  },
  "top_risk_drivers": [
    "heavy rain frequency",
    "flood-prone zone",
    "evening rush exposure"
  ]
}
```

## Python Loading Logic

```python
from src.portable_ml import predict_weekly_risk

result = predict_weekly_risk(
    city="Bengaluru",
    zone="Koramangala",
    shift_type="evening_rush",
    coverage_tier="standard",
    feature_context={"reference_date": "2026-04-03"},
)
```

## Notes

- `city`, `zone`, and `shift_type` are normalized internally.
- If `feature_context.reference_date` is provided, the model fetches the most recent complete week of Open-Meteo history up to that date.
- Backend premium logic should use only `premium_breakdown_hint.ml_risk_loading` from ML, while keeping the final premium formula deterministic.
