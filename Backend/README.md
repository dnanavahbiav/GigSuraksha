# GigSuraksha Backend

Phase 2 FastAPI backend for GigSuraksha, an AI-assisted parametric income protection platform for quick-commerce delivery workers.

## Deployed API

Production base URL:

- `https://gigsuraksha-backend.fly.dev`

This deployed backend already includes:

- the FastAPI API layer
- the integrated ML risk model
- deterministic quote generation
- worker, policy, event, claim, and admin endpoints

Frontend or external agents do not need the source code to consume the API. They can work from this README plus the base URL above.

## What to share with another LLM or agent

If another LLM only needs to use the deployed API, give it:

- this README
- the base URL `https://gigsuraksha-backend.fly.dev`
- the sample payload files in `samples/`

If it also needs implementation context, give it:

- `HANDOFF_FOR_LLM.md`

## What this backend does

- registers workers
- generates ML-backed weekly risk summaries
- computes deterministic weekly quotes
- creates weekly policy snapshots
- ingests simulated disruption events
- auto-creates rule-based claims from active policies
- exposes admin summary data for dashboards

## Core architecture

- Framework: FastAPI
- Runtime target: `python3.10`
- Persistence: MongoDB Atlas via `MONGODB_URI`
- Local/test fallback: in-memory store when Mongo is not configured or `USE_IN_MEMORY_DB=true`
- ML integration: existing model in `../Ml/`

Important boundary:

- ML is only used for weekly disruption risk scoring and premium loading.
- Claim validation, shift overlap, and payout estimation are deterministic and separate from ML.

## CORS

The backend is currently configured to allow all origins for demo deployment when `ALLOW_ALL_ORIGINS=true`, which is the current default.

If you want to tighten it later, set:

- `ALLOW_ALL_ORIGINS=false`
- `FRONTEND_ORIGIN`
- `FRONTEND_ORIGINS`

The detected local frontend dev origins are still:

- `http://localhost:3000`
- `http://127.0.0.1:3000`

## Environment variables

Copy `.env.example` to `.env` for local development.

```env
MONGODB_URI=
DATABASE_NAME=gigsuraksha
FRONTEND_ORIGIN=http://localhost:3000
FRONTEND_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
PORT=8001
USE_IN_MEMORY_DB=false
```

Notes:

- Keep real Mongo credentials out of committed source files.
- If `MONGODB_URI` is missing, the backend falls back to the in-memory adapter.
- If `MONGODB_URI` is provided but invalid, startup fails instead of silently switching to memory.

## Run locally

```bash
PYTHONPATH=Backend python3.10 -m uvicorn app.main:app --host 0.0.0.0 --port 8001
```

## Run tests

```bash
PYTHONPATH=Backend python3.10 -m unittest discover -s Backend/tests -p 'test_*.py'
```

## Deterministic premium formula

```text
Final Weekly Premium =
  Base Premium
+ Zone Risk Loading
+ Shift Exposure Loading
+ Coverage Factor
+ ML Risk Loading
- Safe Zone Discount
```

Mappings:

- Base Premium = `29`
- ML loading: `LOW=3`, `MEDIUM=8`, `HIGH=12`
- Coverage factor: `basic=4`, `standard=7`, `comprehensive=10`
- Shift loading: `morning_rush=3`, `afternoon=2`, `evening_rush=5`, `late_night=4`
- Zone loading: derived from zone metadata risk band
- Safe zone discount: `3` for low-risk zones, else `0`

Coverage summary rules:

- `protected_weekly_income = weekly_earnings * coverage_percent`
- `protected_hours_basis = min(weekly_active_hours, insured_shift_hours_per_week)`
- `protected_hourly_income = protected_weekly_income / protected_hours_basis`

## Claim logic

Shift windows:

- `morning_rush`: `07:00-11:00`
- `afternoon`: `12:00-16:00`
- `evening_rush`: `18:00-22:00`
- `late_night`: `22:00-01:00`

Claim auto-creation rules:

- match active policies on the same `city` and `zone`
- require policy validity overlap with the event window
- require event overlap with the insured shift window
- require `verified=true`
- prevent duplicate claims for the same `worker_id + policy_id + event_id`

Severity multipliers:

- `low = 0.4`
- `moderate = 0.65`
- `high = 0.85`
- `severe = 1.0`

Payout formula:

```text
Payout = min(
  ProtectedHourlyIncome * AffectedHours * SeverityMultiplier,
  MaxWeeklyPayout
)
```

## API contract

### `GET /health`

Response:

```json
{
  "status": "ok"
}
```

### `POST /api/ml/risk/predict`

Purpose:

- returns the ML risk prediction contract used by quoting and forecast views

Request:

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

Response:

```json
{
  "model_version": "weekly-disruption-risk-v1",
  "city": "Bengaluru",
  "zone": "Koramangala",
  "shift_type": "evening_rush",
  "coverage_tier": "standard",
  "risk_score": 0,
  "risk_band": "LOW",
  "expected_disrupted_hours": 0.02,
  "premium_loading": 3,
  "premium_breakdown_hint": {
    "ml_risk_loading": 3
  },
  "top_risk_drivers": [
    "evening rush exposure",
    "flood-prone zone",
    "access friction during rain"
  ]
}
```

### `POST /api/quote/generate`

Purpose:

- returns a frontend-friendly quote with normalized worker profile, risk summary, premium breakdown, and coverage summary

Request:

```json
{
  "worker_profile": {
    "city": "Bengaluru",
    "zone": "Koramangala",
    "shift_type": "evening_rush",
    "coverage_tier": "standard",
    "weekly_earnings": 6000,
    "weekly_active_hours": 40
  },
  "feature_context": {
    "reference_date": "2026-04-03"
  }
}
```

Response shape:

```json
{
  "model_version": "weekly-disruption-risk-v1",
  "worker_profile": {
    "city": "Bengaluru",
    "zone": "Koramangala",
    "shift_type": "evening_rush",
    "coverage_tier": "standard",
    "weekly_earnings": 6000.0,
    "weekly_active_hours": 40.0
  },
  "risk_summary": {
    "risk_score": 0,
    "risk_band": "LOW",
    "expected_disrupted_hours": 0.02,
    "premium_loading": 3,
    "top_risk_drivers": [
      "evening rush exposure",
      "flood-prone zone",
      "access friction during rain"
    ],
    "zone_risk_band": "MEDIUM",
    "zone_baseline_risk_score": 0.4645
  },
  "premium_breakdown": {
    "base_premium": 29,
    "zone_risk_loading": 8,
    "shift_exposure_loading": 5,
    "coverage_factor": 7,
    "ml_risk_loading": 3,
    "safe_zone_discount": 0,
    "final_weekly_premium": 52
  },
  "coverage_summary": {
    "coverage_tier": "standard",
    "coverage_percent": 70,
    "max_weekly_payout": 3500,
    "insured_shift_hours_per_week": 28,
    "protected_hours_basis": 28.0,
    "protected_weekly_income": 4200.0,
    "protected_hourly_income": 150.0
  }
}
```

### `POST /api/workers/register`

Purpose:

- persists a worker profile for later policy creation and dashboard retrieval

Request:

```json
{
  "name": "Ravi Kumar",
  "phone": "9876543210",
  "city": "Bengaluru",
  "platform": "Blinkit",
  "zone": "Koramangala",
  "shift_type": "evening_rush",
  "weekly_earnings": 6000,
  "weekly_active_hours": 40,
  "upi_id": "ravi@oksbi"
}
```

Response:

```json
{
  "worker_id": "wrk_20260403120000_ab12",
  "name": "Ravi Kumar",
  "phone": "9876543210",
  "city": "Bengaluru",
  "platform": "Blinkit",
  "zone": "Koramangala",
  "shift_type": "evening_rush",
  "weekly_earnings": 6000.0,
  "weekly_active_hours": 40.0,
  "upi_id": "ravi@oksbi",
  "created_at": "2026-04-03T12:00:00",
  "updated_at": "2026-04-03T12:00:00"
}
```

### `GET /api/workers/{worker_id}`

Purpose:

- fetches one registered worker by readable ID

Response:

- same shape as `POST /api/workers/register`

### `POST /api/policies/create`

Purpose:

- creates a weekly policy snapshot from either an existing `worker_id` or an inline `worker_profile`

Request with registered worker:

```json
{
  "worker_id": "wrk_20260403120000_ab12",
  "coverage_tier": "standard",
  "feature_context": {
    "reference_date": "2026-04-03"
  },
  "valid_from": "2026-04-01T00:00:00"
}
```

Alternative inline request:

```json
{
  "worker_profile": {
    "city": "Bengaluru",
    "zone": "Koramangala",
    "shift_type": "evening_rush",
    "coverage_tier": "standard",
    "weekly_earnings": 6000,
    "weekly_active_hours": 40
  },
  "feature_context": {
    "reference_date": "2026-04-03"
  }
}
```

Inline note:

- the `worker_profile` path is a shortcut for demo flows
- it creates a policy snapshot with an autogenerated `worker_id`
- it does not backfill the full worker registration record unless `POST /api/workers/register` is called separately

Response shape:

```json
{
  "policy_id": "pol_20260403120100_cd34",
  "worker_id": "wrk_20260403120000_ab12",
  "city": "Bengaluru",
  "zone": "Koramangala",
  "shift_type": "evening_rush",
  "coverage_tier": "standard",
  "weekly_earnings": 6000.0,
  "weekly_active_hours": 40.0,
  "model_version": "weekly-disruption-risk-v1",
  "risk_summary": {},
  "premium_breakdown": {},
  "coverage_summary": {},
  "weekly_premium": 52,
  "max_weekly_payout": 3500,
  "coverage_percent": 70,
  "valid_from": "2026-04-01T00:00:00",
  "valid_to": "2026-04-08T00:00:00",
  "status": "active",
  "created_at": "2026-04-03T12:01:00",
  "updated_at": "2026-04-03T12:01:00"
}
```

### `GET /api/policies/{policy_id}`

Purpose:

- fetches one policy snapshot by readable ID

Response:

- same shape as `POST /api/policies/create`

### `GET /api/policies/worker/{worker_id}`

Purpose:

- lists all policies for a worker

Response:

```json
{
  "policies": [
    {
      "policy_id": "pol_20260403120100_cd34",
      "worker_id": "wrk_20260403120000_ab12",
      "status": "active"
    }
  ]
}
```

### `POST /api/events/simulate`

Purpose:

- creates a verified disruption event and immediately evaluates matching active policies for claim creation

Supported `event_type` values:

- `heavy_rainfall`
- `waterlogging`
- `severe_aqi`
- `platform_outage`
- `dark_store_unavailable`
- `zone_access_restriction`

Request:

```json
{
  "event_type": "heavy_rainfall",
  "city": "Bengaluru",
  "zone": "Koramangala",
  "severity": "high",
  "start_time": "2026-04-03T18:00:00",
  "duration_hours": 3,
  "source": "simulation",
  "verified": true,
  "metadata": {
    "trigger": "demo"
  }
}
```

Response shape:

```json
{
  "event": {
    "event_id": "evt_20260403121000_ef56",
    "event_type": "heavy_rainfall",
    "city": "Bengaluru",
    "zone": "Koramangala",
    "severity": "high",
    "start_time": "2026-04-03T18:00:00",
    "duration_hours": 3.0,
    "end_time": "2026-04-03T21:00:00",
    "source": "simulation",
    "verified": true,
    "metadata": {
      "trigger": "demo"
    },
    "created_at": "2026-04-03T12:10:00"
  },
  "claims_created": 1,
  "claims": [
    {
      "claim_id": "clm_20260403121001_fa78",
      "worker_id": "wrk_20260403120000_ab12",
      "policy_id": "pol_20260403120100_cd34",
      "event_id": "evt_20260403121000_ef56",
      "city": "Bengaluru",
      "zone": "Koramangala",
      "event_type": "heavy_rainfall",
      "severity": "high",
      "affected_hours": 3.0,
      "protected_hourly_income": 150.0,
      "severity_multiplier": 0.85,
      "payout_estimate": 382.5,
      "status": "approved",
      "validation_checks": {
        "policy_active": true,
        "zone_match": true,
        "shift_overlap": true,
        "event_verified": true,
        "duplicate_claim": false
      },
      "created_at": "2026-04-03T12:10:00",
      "updated_at": "2026-04-03T12:10:00"
    }
  ]
}
```

### `GET /api/claims/{claim_id}`

Purpose:

- fetches one claim by readable ID

Response:

- same claim object shape returned under `POST /api/events/simulate`

### `GET /api/claims/worker/{worker_id}`

Purpose:

- lists claims for a worker

Response:

```json
{
  "claims": [
    {
      "claim_id": "clm_20260403121001_fa78",
      "status": "approved",
      "payout_estimate": 382.5
    }
  ]
}
```

### `GET /api/claims`

Purpose:

- lists all claims, optionally filtered by `status`

Query params:

- `status=approved`

Response:

```json
{
  "claims": []
}
```

### `GET /api/admin/summary`

Purpose:

- returns compact dashboard data for admins

Response shape:

```json
{
  "total_workers": 1,
  "total_active_policies": 1,
  "total_events": 1,
  "total_claims": 1,
  "claims_by_status": {
    "approved": 1
  },
  "claims_by_event_type": {
    "heavy_rainfall": 1
  },
  "recent_events": [],
  "recent_claims": [],
  "forecast_cards": [
    {
      "city": "Bengaluru",
      "zone": "Koramangala",
      "shift_type": "evening_rush",
      "coverage_tier": "standard",
      "risk_band": "LOW",
      "risk_score": 0,
      "expected_disrupted_hours": 0.02,
      "suggested_weekly_premium": 52,
      "model_version": "weekly-disruption-risk-v1"
    }
  ]
}
```

### `GET /api/demo/quote-requests`

Purpose:

- returns seeded quote demo payloads for frontend or admin demo tooling

Response:

```json
{
  "quotes": []
}
```

## Error behavior

- `400`: business validation error such as unsupported city, zone, shift, platform, or invalid numeric input
- `404`: missing worker, policy, or claim
- `422`: request-body validation error from FastAPI/Pydantic
- `500`: ML artifact missing or another unexpected server issue

## Sample files

- `samples/quote_demo_requests.json`
- `samples/quote_demo_outputs.json`
- `samples/quote_generate_request.json`
- `samples/worker_registration_request.json`
- `samples/worker_registration_response.json`
- `samples/policy_create_request.json`
- `samples/policy_create_response.json`
- `samples/event_simulation_request.json`
- `samples/event_simulation_response.json`
- `samples/admin_summary_response.json`

## Key code locations

- App bootstrap and routes: `app/main.py`
- Environment and CORS config: `app/config.py`
- Database adapters: `app/db.py`
- Schemas: `app/schemas.py`
- ML integration: `app/services/ml_service.py`
- Quote engine: `app/services/quote_service.py`
- Worker service: `app/services/worker_service.py`
- Policy service: `app/services/policy_service.py`
- Event and auto-claim flow: `app/services/event_service.py`
- Claim read services: `app/services/claim_service.py`
- Admin dashboard summary: `app/services/admin_service.py`
- Shift overlap helper: `app/utils/shifts.py`

## Fly.io deployment

Files:

- `Dockerfile`
- `fly.toml`

Recommended deploy command from repo root:

```bash
fly deploy -c Backend/fly.toml .
```

Set secrets on Fly:

```bash
fly secrets set MONGODB_URI=... FRONTEND_ORIGIN=https://your-frontend.example
```

The container startup command reads `PORT` and binds to `0.0.0.0`.
