from __future__ import annotations

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPO_ROOT / "Backend"
ML_ROOT = REPO_ROOT / "Ml"

if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))

BASE_PREMIUM = 29
ML_RISK_LOADING_BY_BAND = {
    "LOW": 3,
    "MEDIUM": 8,
    "HIGH": 12,
}
COVERAGE_TIER_CONFIG = {
    "basic": {
        "coverage_factor": 4,
        "coverage_percent": 50,
        "max_weekly_payout": 2000,
    },
    "standard": {
        "coverage_factor": 7,
        "coverage_percent": 70,
        "max_weekly_payout": 3500,
    },
    "comprehensive": {
        "coverage_factor": 10,
        "coverage_percent": 90,
        "max_weekly_payout": 5000,
    },
}
SHIFT_LOADING_BY_TYPE = {
    "morning_rush": 3,
    "afternoon": 2,
    "evening_rush": 5,
    "late_night": 4,
}
ZONE_LOADING_BY_RISK_BAND = {
    "LOW": 3,
    "MEDIUM": 8,
    "HIGH": 14,
}
SAFE_ZONE_DISCOUNT_AMOUNT = 3

DEMO_REQUESTS_PATH = BACKEND_ROOT / "samples" / "quote_demo_requests.json"
