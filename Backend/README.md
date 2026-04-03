# GigSuraksha Backend

FastAPI quote-generation backend for GigSuraksha.

## Endpoints

- `POST /api/ml/risk/predict`
- `POST /api/quote/generate`
- `GET /api/demo/quote-requests`
- `GET /health`

## Run

```bash
cd /Users/loopassembly/Desktop/GigSuraksha/Backend
uvicorn app.main:app --reload
```

## Sample Requests

Seeded request payloads live in [`/Users/loopassembly/Desktop/GigSuraksha/Backend/samples/quote_demo_requests.json`](/Users/loopassembly/Desktop/GigSuraksha/Backend/samples/quote_demo_requests.json).

## Notes

- ML integration calls the existing model artifact from `Ml/models/weekly_disruption_risk_model.joblib`.
- Quote generation keeps premium calculation deterministic and separate from claim approval logic.
