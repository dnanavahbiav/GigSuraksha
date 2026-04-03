from __future__ import annotations

import json
import os
import re
import sys
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPO_ROOT / "Backend"
ML_ROOT = REPO_ROOT / "Ml"
FRONTEND_ROOT = REPO_ROOT / "frontend"

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
SEVERITY_MULTIPLIER_BY_LEVEL = {
    "low": 0.4,
    "moderate": 0.65,
    "high": 0.85,
    "severe": 1.0,
}
SUPPORTED_EVENT_TYPES = {
    "heavy_rainfall",
    "waterlogging",
    "severe_aqi",
    "platform_outage",
    "dark_store_unavailable",
    "zone_access_restriction",
}

DEMO_REQUESTS_PATH = BACKEND_ROOT / "samples" / "quote_demo_requests.json"
DEMO_OUTPUTS_PATH = BACKEND_ROOT / "samples" / "quote_demo_outputs.json"
BACKEND_ENV_PATH = BACKEND_ROOT / ".env"
REPO_ENV_PATH = REPO_ROOT / ".env"


def load_local_env() -> None:
    for env_path in (BACKEND_ENV_PATH, REPO_ENV_PATH):
        if not env_path.exists():
            continue
        for line in env_path.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#") or "=" not in stripped:
                continue
            key, value = stripped.split("=", 1)
            key = key.strip()
            value = value.strip().strip("'").strip('"')
            os.environ.setdefault(key, value)


def _detect_next_dev_port(script_value: str) -> int | None:
    match = re.search(r"(?:--port|-p)\s+(\d+)", script_value)
    if not match:
        return None
    return int(match.group(1))


def detect_frontend_dev_port() -> int:
    package_json_path = FRONTEND_ROOT / "package.json"
    default_port = 3000
    if not package_json_path.exists():
        return default_port
    try:
        package_data = json.loads(package_json_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return default_port
    scripts = package_data.get("scripts") or {}
    dev_script = scripts.get("dev") or ""
    custom_port = _detect_next_dev_port(str(dev_script))
    return custom_port or default_port


def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    port: int
    database_name: str
    mongodb_uri: str | None
    frontend_origin: str | None
    frontend_origins: tuple[str, ...]
    frontend_dev_port: int
    use_in_memory_db: bool
    allow_all_origins: bool

    @property
    def cors_origins(self) -> list[str]:
        if self.allow_all_origins:
            return ["*"]
        origins = [
            f"http://localhost:{self.frontend_dev_port}",
            f"http://127.0.0.1:{self.frontend_dev_port}",
        ]
        if self.frontend_origin:
            origins.append(self.frontend_origin)
        origins.extend(self.frontend_origins)
        deduped: list[str] = []
        for origin in origins:
            if origin and origin not in deduped:
                deduped.append(origin)
        return deduped


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    load_local_env()
    frontend_dev_port = detect_frontend_dev_port()
    mongodb_uri = os.getenv("MONGODB_URI") or None
    return Settings(
        port=int(os.getenv("PORT", "8001")),
        database_name=os.getenv("DATABASE_NAME", "gigsuraksha"),
        mongodb_uri=mongodb_uri,
        frontend_origin=os.getenv("FRONTEND_ORIGIN") or None,
        frontend_origins=tuple(_split_csv(os.getenv("FRONTEND_ORIGINS"))),
        frontend_dev_port=frontend_dev_port,
        use_in_memory_db=(os.getenv("USE_IN_MEMORY_DB", "").lower() == "true") or not mongodb_uri,
        allow_all_origins=os.getenv("ALLOW_ALL_ORIGINS", "true").lower() == "true",
    )
