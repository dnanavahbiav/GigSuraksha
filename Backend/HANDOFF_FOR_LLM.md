# GigSuraksha Backend Handoff For Another LLM

## Current status

The backend now supports the full Phase 2 MVP flow:

1. worker registration
2. ML-backed quote generation
3. policy creation and retrieval
4. disruption event simulation
5. automatic claim creation
6. claim retrieval
7. admin summary

## Deployed API

Live base URL:

- `https://gigsuraksha-backend.fly.dev`

Another LLM can use the deployed product API directly from this base URL without reading the source code, as long as it has this handoff or the backend README.

## Runtime and persistence

- FastAPI app entrypoint: `Backend/app/main.py`
- Working backend runtime: `python3.10`
- Primary persistence target: MongoDB Atlas via `MONGODB_URI`
- Local/test fallback: in-memory adapter when Mongo is unavailable or disabled
- ML module path: `Ml/`

Important:

- claim logic is separate from ML
- ML is only used for weekly risk scoring and quote loading
- final quote calculation remains deterministic

## Frontend origin detection and CORS

Frontend inspection showed:

- `frontend/package.json` uses `next dev`
- `frontend/next.config.ts` has no custom port override

The backend is currently demo-configured with `ALLOW_ALL_ORIGINS=true`, so CORS allows all origins.

If that is turned off later, the detected local defaults are:

- `http://localhost:3000`
- `http://127.0.0.1:3000`

Additional deployed origins can still come from:

- `FRONTEND_ORIGIN`
- `FRONTEND_ORIGINS`

## Implemented endpoints

- `GET /health`
- `POST /api/ml/risk/predict`
- `POST /api/quote/generate`
- `POST /api/workers/register`
- `GET /api/workers/{worker_id}`
- `POST /api/policies/create`
- `GET /api/policies/{policy_id}`
- `GET /api/policies/worker/{worker_id}`
- `POST /api/events/simulate`
- `GET /api/claims/{claim_id}`
- `GET /api/claims/worker/{worker_id}`
- `GET /api/claims`
- `GET /api/admin/summary`
- `GET /api/demo/quote-requests`

Policy creation note:

- `POST /api/policies/create` accepts either `worker_id` or inline `worker_profile`
- the inline path creates a policy snapshot for demo usage and does not create a full worker registration record

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
- ML loading = `LOW: 3`, `MEDIUM: 8`, `HIGH: 12`
- Coverage factor = `basic: 4`, `standard: 7`, `comprehensive: 10`
- Shift loading = `morning_rush: 3`, `afternoon: 2`, `evening_rush: 5`, `late_night: 4`
- Zone loading = derived from zone metadata risk band
- Safe zone discount = `3` for low-risk zones, else `0`

## Claim and payout rules

Shift windows:

- `morning_rush`: `07:00-11:00`
- `afternoon`: `12:00-16:00`
- `evening_rush`: `18:00-22:00`
- `late_night`: `22:00-01:00`

Severity multipliers:

- `low = 0.4`
- `moderate = 0.65`
- `high = 0.85`
- `severe = 1.0`

Payout formula:

```text
min(ProtectedHourlyIncome * AffectedHours * SeverityMultiplier, MaxWeeklyPayout)
```

## Key files

Core backend:

- `Backend/app/main.py`
- `Backend/app/config.py`
- `Backend/app/db.py`
- `Backend/app/schemas.py`

Repositories:

- `Backend/app/repositories/workers.py`
- `Backend/app/repositories/policies.py`
- `Backend/app/repositories/events.py`
- `Backend/app/repositories/claims.py`

Services:

- `Backend/app/services/ml_service.py`
- `Backend/app/services/quote_service.py`
- `Backend/app/services/catalog.py`
- `Backend/app/services/worker_service.py`
- `Backend/app/services/policy_service.py`
- `Backend/app/services/event_service.py`
- `Backend/app/services/claim_service.py`
- `Backend/app/services/admin_service.py`

Utilities:

- `Backend/app/utils/ids.py`
- `Backend/app/utils/time.py`
- `Backend/app/utils/shifts.py`

Deployment and env:

- `Backend/Dockerfile`
- `Backend/fly.toml`
- `Backend/.env.example`

Tests:

- `Backend/tests/test_api.py`

Samples:

- `Backend/samples/quote_demo_requests.json`
- `Backend/samples/quote_demo_outputs.json`
- `Backend/samples/quote_generate_request.json`
- `Backend/samples/worker_registration_request.json`
- `Backend/samples/worker_registration_response.json`
- `Backend/samples/policy_create_request.json`
- `Backend/samples/policy_create_response.json`
- `Backend/samples/event_simulation_request.json`
- `Backend/samples/event_simulation_response.json`
- `Backend/samples/admin_summary_response.json`

Docs:

- `Backend/README.md`

## Validation performed

Static validation:

- `python3.10 -m compileall Backend/app`

Automated tests:

- `PYTHONPATH=Backend python3.10 -m unittest discover -s Backend/tests -p 'test_*.py'`
- result: `Ran 4 tests ... OK`

Verified coverage in tests:

- health endpoint
- CORS behavior for local frontend origin
- quote generation
- worker registration
- policy creation and retrieval
- event simulation
- claim auto-creation and retrieval
- admin summary

Manual end-to-end smoke flow also succeeded with an in-memory database:

- register worker -> `200`
- generate quote -> `200`
- create policy -> `200`
- simulate event -> `200`
- fetch worker claims -> `200`
- fetch admin summary -> `200`

## Deployment note

Deploy from repo root with:

```bash
fly deploy -c Backend/fly.toml .
```

Set secrets via Fly instead of source files, especially:

- `MONGODB_URI`
- `FRONTEND_ORIGIN`

## Honest caveat

This machine validated the Phase 2 backend with the in-memory adapter. The MongoDB path is implemented for `motor`, but a live Atlas round-trip was not exercised in this handoff pass.
