from __future__ import annotations

import unittest

from fastapi.testclient import TestClient

from app.db import InMemoryDatabase
from app.main import create_app


class GigSurakshaApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.app = create_app(database=InMemoryDatabase())
        self.client = TestClient(self.app)
        self.client.__enter__()

    def tearDown(self) -> None:
        self.client.__exit__(None, None, None)

    def test_health_endpoint(self) -> None:
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_cors_allows_detected_frontend_origin(self) -> None:
        response = self.client.options(
            "/api/quote/generate",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get("access-control-allow-origin"), "http://localhost:3000")

    def test_quote_generation(self) -> None:
        payload = {
            "worker_profile": {
                "city": "Bengaluru",
                "zone": "Koramangala",
                "shift_type": "evening_rush",
                "coverage_tier": "standard",
                "weekly_earnings": 6000,
                "weekly_active_hours": 40,
            },
            "feature_context": {"reference_date": "2026-04-03"},
        }
        response = self.client.post("/api/quote/generate", json=payload)
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["premium_breakdown"]["final_weekly_premium"], 52)
        self.assertEqual(body["risk_summary"]["risk_band"], "LOW")
        self.assertIn("model_version", body)

    def test_worker_policy_event_claim_and_admin_flow(self) -> None:
        worker_response = self.client.post(
            "/api/workers/register",
            json={
                "name": "Ravi Kumar",
                "phone": "9876543210",
                "city": "Bengaluru",
                "platform": "Blinkit",
                "zone": "Koramangala",
                "shift_type": "evening_rush",
                "weekly_earnings": 6000,
                "weekly_active_hours": 40,
                "upi_id": "ravi@oksbi",
            },
        )
        self.assertEqual(worker_response.status_code, 200)
        worker_id = worker_response.json()["worker_id"]

        get_worker_response = self.client.get(f"/api/workers/{worker_id}")
        self.assertEqual(get_worker_response.status_code, 200)
        self.assertEqual(get_worker_response.json()["zone"], "Koramangala")

        policy_response = self.client.post(
            "/api/policies/create",
            json={
                "worker_id": worker_id,
                "coverage_tier": "standard",
                "feature_context": {"reference_date": "2026-04-03"},
                "valid_from": "2026-04-01T00:00:00",
            },
        )
        self.assertEqual(policy_response.status_code, 200)
        policy_body = policy_response.json()
        self.assertEqual(policy_body["status"], "active")
        self.assertEqual(policy_body["weekly_premium"], 52)
        policy_id = policy_body["policy_id"]

        worker_policies_response = self.client.get(f"/api/policies/worker/{worker_id}")
        self.assertEqual(worker_policies_response.status_code, 200)
        self.assertEqual(len(worker_policies_response.json()["policies"]), 1)

        single_policy_response = self.client.get(f"/api/policies/{policy_id}")
        self.assertEqual(single_policy_response.status_code, 200)
        self.assertEqual(single_policy_response.json()["policy_id"], policy_id)

        event_response = self.client.post(
            "/api/events/simulate",
            json={
                "event_type": "heavy_rainfall",
                "city": "Bengaluru",
                "zone": "Koramangala",
                "severity": "high",
                "start_time": "2026-04-03T18:00:00",
                "duration_hours": 3,
                "source": "simulation",
                "verified": True,
                "metadata": {"trigger": "demo"},
            },
        )
        self.assertEqual(event_response.status_code, 200)
        event_body = event_response.json()
        self.assertEqual(event_body["claims_created"], 1)
        claim_id = event_body["claims"][0]["claim_id"]

        single_claim_response = self.client.get(f"/api/claims/{claim_id}")
        self.assertEqual(single_claim_response.status_code, 200)
        self.assertEqual(single_claim_response.json()["status"], "approved")

        worker_claims_response = self.client.get(f"/api/claims/worker/{worker_id}")
        self.assertEqual(worker_claims_response.status_code, 200)
        self.assertEqual(len(worker_claims_response.json()["claims"]), 1)

        all_claims_response = self.client.get("/api/claims", params={"status": "approved"})
        self.assertEqual(all_claims_response.status_code, 200)
        self.assertEqual(len(all_claims_response.json()["claims"]), 1)

        admin_response = self.client.get("/api/admin/summary")
        self.assertEqual(admin_response.status_code, 200)
        admin_body = admin_response.json()
        self.assertEqual(admin_body["total_workers"], 1)
        self.assertEqual(admin_body["total_active_policies"], 1)
        self.assertEqual(admin_body["total_events"], 1)
        self.assertEqual(admin_body["total_claims"], 1)
        self.assertEqual(admin_body["claims_by_status"]["approved"], 1)


if __name__ == "__main__":
    unittest.main()
