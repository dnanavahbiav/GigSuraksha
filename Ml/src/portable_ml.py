from __future__ import annotations

import csv
import json
import math
import pickle
import statistics
from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import urlopen

from src.config.metadata import CITY_METADATA, SHIFT_DEFINITIONS, ZONE_METADATA
from src.config.settings import (
    ACCESS_RAIN_THRESHOLD_MM,
    ACCESS_RISK_THRESHOLD,
    DEFAULT_HISTORY_START,
    FLOOD_ROLLING_6H_THRESHOLD_MM,
    HEAT_APPARENT_THRESHOLD_C,
    HEAT_TEMP_THRESHOLD_C,
    HEAVY_RAIN_THRESHOLD_MM,
    MODEL_VERSION,
    RANDOM_SEED,
    SEVERE_PM25_THRESHOLD,
    SEVERE_US_AQI_THRESHOLD,
    SEVERE_WIND_GUST_THRESHOLD_KMH,
    default_history_end,
)
from src.utils.io import write_json
from src.utils.paths import (
    ACTUAL_VS_PREDICTED_PLOT_PATH,
    BACKEND_HANDOFF_PATH,
    FEATURE_IMPORTANCE_PATH,
    METRICS_PATH,
    MODEL_ARTIFACT_PATH,
    MODEL_REPORT_PATH,
    PROCESSED_CITY_HOURLY_PATH,
    PROCESSED_WEEKLY_DATASET_PATH,
    RAW_OPEN_METEO_DIR,
    ROOT_DIR,
    VALIDATION_PREDICTIONS_PATH,
    ZONE_METADATA_EXPORT_PATH,
    ensure_directories,
)
from src.utils.risk import (
    expected_hours_to_risk_score,
    premium_loading_for_band,
    risk_score_to_band,
)

WEATHER_BASE_URL = "https://archive-api.open-meteo.com/v1/archive"
AIR_QUALITY_BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"

SHIFT_HOUR_TO_TYPE = {
    hour: shift_type
    for shift_type, details in SHIFT_DEFINITIONS.items()
    for hour in details["hours"]
}

CATEGORICAL_FEATURES = ["city", "zone", "shift_type"]
IDENTIFIER_COLUMNS = ["week_start", "target_week_start"]
TARGET_COLUMN = "next_week_disrupted_hours"


def slugify(label: str) -> str:
    return label.lower().replace(" ", "_").replace("/", "_")


def safe_float(value: Any) -> float:
    if value in ("", None):
        return 0.0
    return float(value)


def safe_int(value: Any) -> int:
    if value in ("", None):
        return 0
    return int(float(value))


def safe_mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def safe_std(values: list[float]) -> float:
    if len(values) <= 1:
        return 0.0
    return statistics.pstdev(values)


def week_start_from_service_date(service_date: date) -> date:
    return service_date - timedelta(days=service_date.weekday())


def iso_date(value: date) -> str:
    return value.isoformat()


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


def to_repo_relative_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT_DIR.parent.resolve()))
    except ValueError:
        return str(path)


def fetch_json(url: str, params: dict[str, Any]) -> dict[str, Any]:
    request_url = f"{url}?{urlencode(params)}"
    with urlopen(request_url, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def write_csv(path: Path, rows: list[dict[str, Any]], fieldnames: list[str] | None = None) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if fieldnames is None:
        fieldnames = list(rows[0].keys()) if rows else []
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def export_zone_metadata() -> list[dict[str, Any]]:
    rows = []
    for zone, metadata in sorted(ZONE_METADATA.items(), key=lambda item: (item[1]["city"], item[0])):
        baseline_score = zone_baseline_risk_score(metadata)
        risk_band = zone_risk_band_from_score(baseline_score)
        rows.append(
            {
                "zone": zone,
                "city": metadata["city"],
                "zone_flood_prone_score": metadata["flood_prone_score"],
                "zone_aqi_sensitivity_score": metadata["aqi_sensitivity_score"],
                "zone_access_risk_score": metadata["zone_access_risk_score"],
                "zone_baseline_risk_score": baseline_score,
                "zone_risk_band": risk_band,
                "zone_risk_loading": {"LOW": 3, "MEDIUM": 8, "HIGH": 14}[risk_band],
                "safe_zone_discount_hint": metadata["safe_zone_discount_hint"],
            }
        )
    write_csv(ZONE_METADATA_EXPORT_PATH, rows)
    return rows


def fetch_city_history(city: str, start_date: str, end_date: str) -> list[dict[str, Any]]:
    metadata = CITY_METADATA[city]
    common_params = {
        "latitude": metadata["latitude"],
        "longitude": metadata["longitude"],
        "start_date": start_date,
        "end_date": end_date,
        "timezone": "Asia/Kolkata",
    }
    weather_payload = fetch_json(
        WEATHER_BASE_URL,
        {
            **common_params,
            "hourly": "temperature_2m,apparent_temperature,precipitation,wind_gusts_10m",
        },
    )
    air_payload = fetch_json(
        AIR_QUALITY_BASE_URL,
        {
            **common_params,
            "hourly": "pm2_5,us_aqi,european_aqi",
        },
    )

    weather_hourly = weather_payload["hourly"]
    air_hourly = air_payload["hourly"]
    merged_rows: list[dict[str, Any]] = []
    for index, timestamp in enumerate(weather_hourly["time"]):
        merged_rows.append(
            {
                "city": city,
                "timestamp": timestamp,
                "temperature_2m": weather_hourly["temperature_2m"][index],
                "apparent_temperature": weather_hourly["apparent_temperature"][index],
                "precipitation": weather_hourly["precipitation"][index],
                "wind_gusts_10m": weather_hourly["wind_gusts_10m"][index],
                "pm2_5": air_hourly["pm2_5"][index],
                "us_aqi": air_hourly["us_aqi"][index],
                "european_aqi": air_hourly["european_aqi"][index],
            }
        )

    city_slug = slugify(city)
    write_csv(
        RAW_OPEN_METEO_DIR / f"{city_slug}_weather.csv",
        [
            {
                "time": weather_hourly["time"][index],
                "temperature_2m": weather_hourly["temperature_2m"][index],
                "apparent_temperature": weather_hourly["apparent_temperature"][index],
                "precipitation": weather_hourly["precipitation"][index],
                "wind_gusts_10m": weather_hourly["wind_gusts_10m"][index],
            }
            for index in range(len(weather_hourly["time"]))
        ],
    )
    write_csv(
        RAW_OPEN_METEO_DIR / f"{city_slug}_air_quality.csv",
        [
            {
                "time": air_hourly["time"][index],
                "pm2_5": air_hourly["pm2_5"][index],
                "us_aqi": air_hourly["us_aqi"][index],
                "european_aqi": air_hourly["european_aqi"][index],
            }
            for index in range(len(air_hourly["time"]))
        ],
    )
    write_csv(RAW_OPEN_METEO_DIR / f"{city_slug}_merged.csv", merged_rows)
    return merged_rows


def fetch_all_history(start_date: str = DEFAULT_HISTORY_START, end_date: str | None = None) -> list[dict[str, Any]]:
    ensure_directories()
    RAW_OPEN_METEO_DIR.mkdir(parents=True, exist_ok=True)
    export_zone_metadata()
    end_date = end_date or default_history_end()
    combined_rows: list[dict[str, Any]] = []
    for city in CITY_METADATA:
        print(f"Fetching Open-Meteo history for {city} from {start_date} to {end_date}...")
        combined_rows.extend(fetch_city_history(city, start_date, end_date))
    combined_rows.sort(key=lambda row: (row["city"], row["timestamp"]))
    write_csv(PROCESSED_CITY_HOURLY_PATH, combined_rows)
    return combined_rows


def parse_hourly_rows(rows: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    by_city: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for raw_row in rows:
        timestamp = datetime.fromisoformat(raw_row["timestamp"])
        row = {
            "city": raw_row["city"],
            "timestamp": timestamp,
            "temperature_2m": safe_float(raw_row["temperature_2m"]),
            "apparent_temperature": safe_float(raw_row["apparent_temperature"]),
            "precipitation": safe_float(raw_row["precipitation"]),
            "wind_gusts_10m": safe_float(raw_row["wind_gusts_10m"]),
            "pm2_5": safe_float(raw_row["pm2_5"]),
            "us_aqi": safe_float(raw_row["us_aqi"]),
            "european_aqi": safe_float(raw_row["european_aqi"]),
        }
        by_city[row["city"]].append(row)
    for city_rows in by_city.values():
        city_rows.sort(key=lambda row: row["timestamp"])
    return by_city


def build_base_hourly_rows(by_city: dict[str, list[dict[str, Any]]]) -> list[dict[str, Any]]:
    base_rows: list[dict[str, Any]] = []
    for city, city_rows in by_city.items():
        rolling_precip_window: list[float] = []
        for row in city_rows:
            rolling_precip_window.append(row["precipitation"])
            if len(rolling_precip_window) > 6:
                rolling_precip_window.pop(0)

            hour = row["timestamp"].hour
            shift_type = SHIFT_HOUR_TO_TYPE.get(hour)
            service_date = row["timestamp"].date()
            if shift_type == "late_night" and hour == 0:
                service_date = service_date - timedelta(days=1)
            week_start = week_start_from_service_date(service_date)
            month = row["timestamp"].month

            heavy_rain_flag = int(row["precipitation"] >= HEAVY_RAIN_THRESHOLD_MM)
            heat_stress_flag = int(
                row["temperature_2m"] >= HEAT_TEMP_THRESHOLD_C
                or row["apparent_temperature"] >= HEAT_APPARENT_THRESHOLD_C
            )
            city_severe_pollution_flag = int(
                row["pm2_5"] >= SEVERE_PM25_THRESHOLD or row["us_aqi"] >= SEVERE_US_AQI_THRESHOLD
            )
            severe_wind_flag = int(row["wind_gusts_10m"] >= SEVERE_WIND_GUST_THRESHOLD_KMH)
            city_disruption_flag = int(
                heavy_rain_flag or heat_stress_flag or city_severe_pollution_flag or severe_wind_flag
            )

            base_rows.append(
                {
                    **row,
                    "hour": hour,
                    "shift_type": shift_type,
                    "service_date": service_date,
                    "week_start": week_start,
                    "month": month,
                    "week_of_year": week_start.isocalendar()[1],
                    "rolling_precip_6h": sum(rolling_precip_window),
                    "heavy_rain_flag": heavy_rain_flag,
                    "heat_stress_flag": heat_stress_flag,
                    "city_severe_pollution_flag": city_severe_pollution_flag,
                    "severe_wind_flag": severe_wind_flag,
                    "city_disruption_flag": city_disruption_flag,
                }
            )
    return base_rows


def aggregate_city_weekly(base_rows: list[dict[str, Any]]) -> dict[tuple[str, date], dict[str, Any]]:
    aggregates: dict[tuple[str, date], dict[str, Any]] = {}
    for row in base_rows:
        key = (row["city"], row["week_start"])
        aggregate = aggregates.setdefault(
            key,
            {
                "city": row["city"],
                "week_start": row["week_start"],
                "month": row["month"],
                "week_of_year": row["week_of_year"],
                "total_precip_last_7d": 0.0,
                "max_hourly_rain_last_7d": 0.0,
                "heavy_rain_hours_last_7d": 0,
                "temperature_values": [],
                "max_temperature_last_7d": float("-inf"),
                "heat_stress_hours_last_7d": 0,
                "pm25_values": [],
                "severe_pollution_hours_last_7d": 0,
                "precipitation_values": [],
                "max_wind_gust_last_7d": 0.0,
                "city_disruption_hours_last_7d": 0,
            },
        )
        aggregate["total_precip_last_7d"] += row["precipitation"]
        aggregate["max_hourly_rain_last_7d"] = max(aggregate["max_hourly_rain_last_7d"], row["precipitation"])
        aggregate["heavy_rain_hours_last_7d"] += row["heavy_rain_flag"]
        aggregate["temperature_values"].append(row["temperature_2m"])
        aggregate["max_temperature_last_7d"] = max(aggregate["max_temperature_last_7d"], row["temperature_2m"])
        aggregate["heat_stress_hours_last_7d"] += row["heat_stress_flag"]
        aggregate["pm25_values"].append(row["pm2_5"])
        aggregate["severe_pollution_hours_last_7d"] += row["city_severe_pollution_flag"]
        aggregate["precipitation_values"].append(row["precipitation"])
        aggregate["max_wind_gust_last_7d"] = max(aggregate["max_wind_gust_last_7d"], row["wind_gusts_10m"])
        aggregate["city_disruption_hours_last_7d"] += row["city_disruption_flag"]

    city_weekly: dict[tuple[str, date], dict[str, Any]] = {}
    weeks_by_city: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for aggregate in aggregates.values():
        finalized = {
            "city": aggregate["city"],
            "week_start": aggregate["week_start"],
            "month": aggregate["month"],
            "week_of_year": aggregate["week_of_year"],
            "total_precip_last_7d": round(aggregate["total_precip_last_7d"], 4),
            "max_hourly_rain_last_7d": round(aggregate["max_hourly_rain_last_7d"], 4),
            "heavy_rain_hours_last_7d": aggregate["heavy_rain_hours_last_7d"],
            "average_temperature_last_7d": round(safe_mean(aggregate["temperature_values"]), 4),
            "max_temperature_last_7d": round(aggregate["max_temperature_last_7d"], 4),
            "heat_stress_hours_last_7d": aggregate["heat_stress_hours_last_7d"],
            "average_pm2_5_last_7d": round(safe_mean(aggregate["pm25_values"]), 4),
            "severe_pollution_hours_last_7d": aggregate["severe_pollution_hours_last_7d"],
            "precipitation_volatility_last_7d": round(safe_std(aggregate["precipitation_values"]), 4),
            "temperature_volatility_last_7d": round(safe_std(aggregate["temperature_values"]), 4),
            "pm25_volatility_last_7d": round(safe_std(aggregate["pm25_values"]), 4),
            "max_wind_gust_last_7d": round(aggregate["max_wind_gust_last_7d"], 4),
            "city_disruption_hours_last_7d": aggregate["city_disruption_hours_last_7d"],
        }
        weeks_by_city[finalized["city"]].append(finalized)

    for city, weeks in weeks_by_city.items():
        weeks.sort(key=lambda row: row["week_start"])
        previous = None
        for row in weeks:
            row["cumulative_rain_last_14d"] = round(
                row["total_precip_last_7d"] + (previous["total_precip_last_7d"] if previous else 0.0), 4
            )
            row["city_disruption_hours_last_14d"] = row["city_disruption_hours_last_7d"] + (
                previous["city_disruption_hours_last_7d"] if previous else 0
            )
            row["recent_precip_trend"] = round(
                row["total_precip_last_7d"] - (previous["total_precip_last_7d"] if previous else 0.0), 4
            )
            row["recent_pm25_trend"] = round(
                row["average_pm2_5_last_7d"] - (previous["average_pm2_5_last_7d"] if previous else 0.0), 4
            )
            row["recent_heat_trend"] = round(
                row["heat_stress_hours_last_7d"] - (previous["heat_stress_hours_last_7d"] if previous else 0.0), 4
            )
            row["monsoon_flag"] = int(row["month"] in CITY_METADATA[city]["monsoon_months"])
            city_weekly[(city, row["week_start"])] = row
            previous = row
    return city_weekly


def aggregate_zone_shift_weekly(base_rows: list[dict[str, Any]]) -> dict[tuple[str, str, str, date], dict[str, Any]]:
    zones_by_city: dict[str, list[tuple[str, dict[str, Any]]]] = defaultdict(list)
    for zone, metadata in ZONE_METADATA.items():
        zones_by_city[metadata["city"]].append((zone, metadata))

    aggregates: dict[tuple[str, str, str, date], dict[str, Any]] = {}
    for row in base_rows:
        if row["shift_type"] is None:
            continue
        for zone, metadata in zones_by_city[row["city"]]:
            flood_proxy_flag = int(
                row["rolling_precip_6h"] >= FLOOD_ROLLING_6H_THRESHOLD_MM and metadata["flood_prone_score"] >= 0.5
            )
            aqi_threshold = SEVERE_US_AQI_THRESHOLD - (metadata["aqi_sensitivity_score"] * 40.0)
            pm25_threshold = SEVERE_PM25_THRESHOLD - (metadata["aqi_sensitivity_score"] * 15.0)
            severe_pollution_flag = int(row["us_aqi"] >= aqi_threshold or row["pm2_5"] >= pm25_threshold)
            access_disruption_flag = int(
                row["precipitation"] >= ACCESS_RAIN_THRESHOLD_MM
                and metadata["zone_access_risk_score"] >= ACCESS_RISK_THRESHOLD
            )
            is_disrupted = int(
                row["heavy_rain_flag"]
                or flood_proxy_flag
                or row["heat_stress_flag"]
                or severe_pollution_flag
                or access_disruption_flag
                or row["severe_wind_flag"]
            )

            key = (row["city"], zone, row["shift_type"], row["week_start"])
            aggregate = aggregates.setdefault(
                key,
                {
                    "city": row["city"],
                    "zone": zone,
                    "shift_type": row["shift_type"],
                    "week_start": row["week_start"],
                    "shift_hours_in_week": 0,
                    "disrupted_hours_current_week": 0,
                    "heavy_rain_shift_hours_current_week": 0,
                    "flood_proxy_shift_hours_current_week": 0,
                    "heat_stress_shift_hours_current_week": 0,
                    "severe_pollution_shift_hours_current_week": 0,
                    "access_proxy_shift_hours_current_week": 0,
                    "severe_wind_shift_hours_current_week": 0,
                    "shift_precipitation_values": [],
                    "shift_pm25_values": [],
                },
            )
            aggregate["shift_hours_in_week"] += 1
            aggregate["disrupted_hours_current_week"] += is_disrupted
            aggregate["heavy_rain_shift_hours_current_week"] += row["heavy_rain_flag"]
            aggregate["flood_proxy_shift_hours_current_week"] += flood_proxy_flag
            aggregate["heat_stress_shift_hours_current_week"] += row["heat_stress_flag"]
            aggregate["severe_pollution_shift_hours_current_week"] += severe_pollution_flag
            aggregate["access_proxy_shift_hours_current_week"] += access_disruption_flag
            aggregate["severe_wind_shift_hours_current_week"] += row["severe_wind_flag"]
            aggregate["shift_precipitation_values"].append(row["precipitation"])
            aggregate["shift_pm25_values"].append(row["pm2_5"])

    finalized: dict[tuple[str, str, str, date], dict[str, Any]] = {}
    for key, aggregate in aggregates.items():
        finalized[key] = {
            "city": aggregate["city"],
            "zone": aggregate["zone"],
            "shift_type": aggregate["shift_type"],
            "week_start": aggregate["week_start"],
            "shift_hours_in_week": aggregate["shift_hours_in_week"],
            "disrupted_hours_current_week": aggregate["disrupted_hours_current_week"],
            "heavy_rain_shift_hours_current_week": aggregate["heavy_rain_shift_hours_current_week"],
            "flood_proxy_shift_hours_current_week": aggregate["flood_proxy_shift_hours_current_week"],
            "heat_stress_shift_hours_current_week": aggregate["heat_stress_shift_hours_current_week"],
            "severe_pollution_shift_hours_current_week": aggregate["severe_pollution_shift_hours_current_week"],
            "access_proxy_shift_hours_current_week": aggregate["access_proxy_shift_hours_current_week"],
            "severe_wind_shift_hours_current_week": aggregate["severe_wind_shift_hours_current_week"],
            "average_shift_precipitation_current_week": round(
                safe_mean(aggregate["shift_precipitation_values"]), 4
            ),
            "average_shift_pm25_current_week": round(safe_mean(aggregate["shift_pm25_values"]), 4),
            "max_shift_pm25_current_week": round(max(aggregate["shift_pm25_values"] or [0.0]), 4),
        }
    return finalized


def build_training_dataset_from_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_city = parse_hourly_rows(rows)
    base_rows = build_base_hourly_rows(by_city)
    city_weekly = aggregate_city_weekly(base_rows)
    zone_shift_weekly = aggregate_zone_shift_weekly(base_rows)

    groups: dict[tuple[str, str, str], list[dict[str, Any]]] = defaultdict(list)
    for aggregate in zone_shift_weekly.values():
        groups[(aggregate["city"], aggregate["zone"], aggregate["shift_type"])].append(aggregate)

    dataset_rows: list[dict[str, Any]] = []
    for (city, zone, shift_type), group_rows in groups.items():
        group_rows.sort(key=lambda row: row["week_start"])
        for index, current in enumerate(group_rows[:-1]):
            previous_1 = group_rows[index - 1] if index >= 1 else None
            previous_2 = group_rows[index - 2] if index >= 2 else None
            next_row = group_rows[index + 1]
            city_features = city_weekly[(city, current["week_start"])]
            zone_metadata = ZONE_METADATA[zone]

            row = {
                **{key: value for key, value in current.items() if key != "week_start"},
                **{key: value for key, value in city_features.items() if key not in {"city", "week_start"}},
                "city": city,
                "zone": zone,
                "shift_type": shift_type,
                "week_start": iso_date(current["week_start"]),
                "target_week_start": iso_date(next_row["week_start"]),
                "lagged_disruption_hours_1w": previous_1["disrupted_hours_current_week"] if previous_1 else 0,
                "lagged_disruption_hours_2w": (
                    (previous_1["disrupted_hours_current_week"] if previous_1 else 0)
                    + (previous_2["disrupted_hours_current_week"] if previous_2 else 0)
                ),
                "recent_disruption_hours_1w": current["disrupted_hours_current_week"],
                "recent_disruption_hours_2w": current["disrupted_hours_current_week"]
                + (previous_1["disrupted_hours_current_week"] if previous_1 else 0),
                "zone_flood_prone_score": zone_metadata["flood_prone_score"],
                "zone_aqi_sensitivity_score": zone_metadata["aqi_sensitivity_score"],
                "zone_access_risk_score": zone_metadata["zone_access_risk_score"],
                "safe_zone_discount_hint": zone_metadata["safe_zone_discount_hint"],
                "shift_exposure_loading": SHIFT_DEFINITIONS[shift_type]["exposure_loading"],
                "zone_baseline_risk_score": round(
                    zone_metadata["flood_prone_score"] * 0.45
                    + zone_metadata["aqi_sensitivity_score"] * 0.30
                    + zone_metadata["zone_access_risk_score"] * 0.25,
                    4,
                ),
                "next_week_disrupted_hours": next_row["disrupted_hours_current_week"],
            }
            dataset_rows.append(row)

    dataset_rows.sort(key=lambda row: (row["week_start"], row["city"], row["zone"], row["shift_type"]))
    return dataset_rows


def build_training_dataset_from_file(
    source: Path = PROCESSED_CITY_HOURLY_PATH,
    output: Path = PROCESSED_WEEKLY_DATASET_PATH,
) -> list[dict[str, Any]]:
    ensure_directories()
    rows = read_csv_rows(source)
    dataset_rows = build_training_dataset_from_rows(rows)
    write_csv(output, dataset_rows)
    return dataset_rows


def split_rows_timewise(rows: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[str]]:
    unique_weeks = sorted({row["week_start"] for row in rows})
    validation_weeks = max(12, int(len(unique_weeks) * 0.2))
    validation_weeks = min(validation_weeks, max(1, len(unique_weeks) - 1))
    validation_cutoff = unique_weeks[-validation_weeks]
    train_rows = [row for row in rows if row["week_start"] < validation_cutoff]
    validation_rows = [row for row in rows if row["week_start"] >= validation_cutoff]
    feature_columns = [column for column in rows[0].keys() if column not in IDENTIFIER_COLUMNS + [TARGET_COLUMN]]
    return train_rows, validation_rows, feature_columns


def median(values: list[float]) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    middle = len(ordered) // 2
    if len(ordered) % 2:
        return ordered[middle]
    return (ordered[middle - 1] + ordered[middle]) / 2.0


def mode(values: list[str]) -> str:
    counts: dict[str, int] = defaultdict(int)
    for value in values:
        counts[value] += 1
    return sorted(counts.items(), key=lambda item: (-item[1], item[0]))[0][0]


def build_model_spec(train_rows: list[dict[str, Any]], feature_columns: list[str]) -> dict[str, Any]:
    numeric_features = [feature for feature in feature_columns if feature not in CATEGORICAL_FEATURES]
    categorical_levels = {
        feature: sorted({row[feature] for row in train_rows})
        for feature in CATEGORICAL_FEATURES
    }
    numeric_stats = {}
    for feature in numeric_features:
        values = [safe_float(row[feature]) for row in train_rows]
        mean_value = safe_mean(values)
        std_value = safe_std(values) or 1.0
        numeric_stats[feature] = {"mean": mean_value, "std": std_value}

    feature_names = ["bias"]
    categorical_index: dict[str, dict[str, int]] = {}
    for feature in CATEGORICAL_FEATURES:
        categorical_index[feature] = {}
        for value in categorical_levels[feature]:
            categorical_index[feature][value] = len(feature_names)
            feature_names.append(f"{feature}__{value}")

    numeric_index = {}
    for feature in numeric_features:
        numeric_index[feature] = len(feature_names)
        feature_names.append(feature)

    feature_defaults = {}
    for feature in feature_columns:
        if feature in CATEGORICAL_FEATURES:
            feature_defaults[feature] = mode([row[feature] for row in train_rows])
        else:
            feature_defaults[feature] = median([safe_float(row[feature]) for row in train_rows])

    return {
        "feature_columns": feature_columns,
        "feature_names": feature_names,
        "categorical_features": CATEGORICAL_FEATURES,
        "numeric_features": numeric_features,
        "categorical_levels": categorical_levels,
        "categorical_index": categorical_index,
        "numeric_index": numeric_index,
        "numeric_stats": numeric_stats,
        "feature_defaults": feature_defaults,
    }


def encode_row(row: dict[str, Any], spec: dict[str, Any]) -> list[float]:
    vector = [0.0] * len(spec["feature_names"])
    vector[0] = 1.0
    for feature in spec["categorical_features"]:
        value = str(row.get(feature, spec["feature_defaults"][feature]))
        index = spec["categorical_index"][feature].get(value)
        if index is not None:
            vector[index] = 1.0
    for feature in spec["numeric_features"]:
        stats = spec["numeric_stats"][feature]
        raw_value = safe_float(row.get(feature, spec["feature_defaults"][feature]))
        vector[spec["numeric_index"][feature]] = (raw_value - stats["mean"]) / stats["std"]
    return vector


def solve_linear_system(matrix: list[list[float]], vector: list[float]) -> list[float]:
    size = len(vector)
    augmented = [row[:] + [vector[index]] for index, row in enumerate(matrix)]
    for pivot in range(size):
        max_row = max(range(pivot, size), key=lambda row_index: abs(augmented[row_index][pivot]))
        augmented[pivot], augmented[max_row] = augmented[max_row], augmented[pivot]
        pivot_value = augmented[pivot][pivot]
        if abs(pivot_value) < 1e-10:
            pivot_value = 1e-10
            augmented[pivot][pivot] = pivot_value
        for column in range(pivot, size + 1):
            augmented[pivot][column] /= pivot_value
        for row_index in range(size):
            if row_index == pivot:
                continue
            factor = augmented[row_index][pivot]
            if factor == 0.0:
                continue
            for column in range(pivot, size + 1):
                augmented[row_index][column] -= factor * augmented[pivot][column]
    return [augmented[row_index][size] for row_index in range(size)]


def fit_ridge_regression(train_rows: list[dict[str, Any]], spec: dict[str, Any], alpha: float = 3.0) -> list[float]:
    feature_count = len(spec["feature_names"])
    xtx = [[0.0] * feature_count for _ in range(feature_count)]
    xty = [0.0] * feature_count
    for row in train_rows:
        encoded = encode_row(row, spec)
        target = safe_float(row[TARGET_COLUMN])
        non_zero_indices = [index for index, value in enumerate(encoded) if value != 0.0]
        for i in non_zero_indices:
            xty[i] += encoded[i] * target
            for j in non_zero_indices:
                if j < i:
                    continue
                xtx[i][j] += encoded[i] * encoded[j]
    for i in range(feature_count):
        for j in range(i):
            xtx[i][j] = xtx[j][i]
        if i != 0:
            xtx[i][i] += alpha
    return solve_linear_system(xtx, xty)


def predict_row(row: dict[str, Any], model_bundle: dict[str, Any]) -> float:
    encoded = encode_row(row, model_bundle["model_spec"])
    prediction = sum(weight * value for weight, value in zip(model_bundle["weights"], encoded))
    prediction = max(0.0, prediction)
    shift_hours_cap = safe_float(row.get("shift_hours_in_week", 0.0))
    if shift_hours_cap > 0.0:
        prediction = min(prediction, shift_hours_cap)
    return prediction


def evaluate_predictions(actual: list[float], predicted: list[float]) -> dict[str, float]:
    absolute_errors = [abs(a - p) for a, p in zip(actual, predicted)]
    squared_errors = [(a - p) ** 2 for a, p in zip(actual, predicted)]
    mean_actual = safe_mean(actual)
    total_variance = sum((value - mean_actual) ** 2 for value in actual)
    explained_variance = sum((a - p) ** 2 for a, p in zip(actual, predicted))
    band_matches = [
        risk_score_to_band(expected_hours_to_risk_score(a)) == risk_score_to_band(expected_hours_to_risk_score(p))
        for a, p in zip(actual, predicted)
    ]
    return {
        "mae": round(safe_mean(absolute_errors), 4),
        "rmse": round(math.sqrt(safe_mean(squared_errors)), 4),
        "r2": round(1.0 - (explained_variance / total_variance), 4) if total_variance else 0.0,
        "risk_band_accuracy": round(safe_mean([1.0 if match else 0.0 for match in band_matches]), 4),
    }


def create_feature_importance_rows(weights: list[float], spec: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for feature_name, weight in zip(spec["feature_names"][1:], weights[1:]):
        rows.append(
            {
                "feature": feature_name,
                "importance_mean": round(abs(weight), 6),
                "importance_std": 0.0,
            }
        )
    rows.sort(key=lambda row: row["importance_mean"], reverse=True)
    return rows


def train_model_from_file(
    dataset_path: Path = PROCESSED_WEEKLY_DATASET_PATH,
    artifact_path: Path = MODEL_ARTIFACT_PATH,
    metrics_path: Path = METRICS_PATH,
    feature_importance_path: Path = FEATURE_IMPORTANCE_PATH,
) -> dict[str, Any]:
    ensure_directories()
    rows = read_csv_rows(dataset_path)
    train_rows, validation_rows, feature_columns = split_rows_timewise(rows)
    spec = build_model_spec(train_rows, feature_columns)
    weights = fit_ridge_regression(train_rows, spec)

    validation_actual = [safe_float(row[TARGET_COLUMN]) for row in validation_rows]
    validation_predicted = [predict_row(row, {"weights": weights, "model_spec": spec}) for row in validation_rows]
    metrics = evaluate_predictions(validation_actual, validation_predicted)
    feature_importance_rows = create_feature_importance_rows(weights, spec)

    summary = {
        "model_version": MODEL_VERSION,
        "selected_model": "portable_ridge_regression",
        "candidate_metrics": {
            "portable_ridge_regression": metrics,
        },
        "feature_columns": feature_columns,
        "categorical_features": CATEGORICAL_FEATURES,
        "numeric_features": spec["numeric_features"],
        "training_window": {
            "train_start": train_rows[0]["week_start"],
            "train_end": train_rows[-1]["week_start"],
            "validation_start": validation_rows[0]["week_start"],
            "validation_end": validation_rows[-1]["week_start"],
        },
        "row_counts": {
            "train_rows": len(train_rows),
            "validation_rows": len(validation_rows),
            "total_rows": len(rows),
        },
        "feature_defaults": spec["feature_defaults"],
        "top_global_features": feature_importance_rows[:10],
        "training_runtime_note": "Portable stdlib fallback used because compiled scientific Python packages were blocked by local macOS code-signing policy in this environment.",
    }

    artifact = {
        "summary": summary,
        "model_spec": spec,
        "weights": weights,
    }
    artifact_path.parent.mkdir(parents=True, exist_ok=True)
    with artifact_path.open("wb") as handle:
        pickle.dump(artifact, handle)

    write_json(metrics_path, summary)
    write_csv(feature_importance_path, feature_importance_rows)
    return artifact


def create_scatter_svg(
    actual: list[float],
    predicted: list[float],
    path: Path,
    width: int = 640,
    height: int = 480,
) -> None:
    max_value = max(max(actual or [0.0]), max(predicted or [0.0]), 1.0)
    margin = 40
    plot_width = width - 2 * margin
    plot_height = height - 2 * margin

    def x_scale(value: float) -> float:
        return margin + (value / max_value) * plot_width

    def y_scale(value: float) -> float:
        return height - margin - (value / max_value) * plot_height

    circles = []
    for actual_value, predicted_value in zip(actual, predicted):
        risk_band = risk_score_to_band(expected_hours_to_risk_score(predicted_value))
        color = {"LOW": "#2E8B57", "MEDIUM": "#E49B0F", "HIGH": "#C0392B"}[risk_band]
        circles.append(
            f'<circle cx="{x_scale(actual_value):.2f}" cy="{y_scale(predicted_value):.2f}" r="4" fill="{color}" opacity="0.7" />'
        )

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
<rect width="{width}" height="{height}" fill="#ffffff"/>
<line x1="{margin}" y1="{height - margin}" x2="{width - margin}" y2="{height - margin}" stroke="#111827" stroke-width="1.5"/>
<line x1="{margin}" y1="{margin}" x2="{margin}" y2="{height - margin}" stroke="#111827" stroke-width="1.5"/>
<line x1="{margin}" y1="{height - margin}" x2="{width - margin}" y2="{margin}" stroke="#9CA3AF" stroke-dasharray="5,5" stroke-width="1.5"/>
<text x="{width / 2}" y="24" text-anchor="middle" font-family="Arial" font-size="18" fill="#111827">GigSuraksha Actual vs Predicted Weekly Risk</text>
<text x="{width / 2}" y="{height - 8}" text-anchor="middle" font-family="Arial" font-size="14" fill="#111827">Actual disrupted hours next week</text>
<text x="14" y="{height / 2}" transform="rotate(-90 14 {height / 2})" text-anchor="middle" font-family="Arial" font-size="14" fill="#111827">Predicted disrupted hours next week</text>
{''.join(circles)}
</svg>"""
    path.write_text(svg, encoding="utf-8")


def evaluate_saved_model(
    dataset_path: Path = PROCESSED_WEEKLY_DATASET_PATH,
    artifact_path: Path = MODEL_ARTIFACT_PATH,
    predictions_path: Path = VALIDATION_PREDICTIONS_PATH,
    plot_path: Path = ACTUAL_VS_PREDICTED_PLOT_PATH,
    metrics_path: Path = METRICS_PATH,
) -> dict[str, Any]:
    rows = read_csv_rows(dataset_path)
    _, validation_rows, _ = split_rows_timewise(rows)
    with artifact_path.open("rb") as handle:
        artifact = pickle.load(handle)

    prediction_rows = []
    actual = []
    predicted = []
    for row in validation_rows:
        prediction = predict_row(row, artifact)
        actual_hours = safe_float(row[TARGET_COLUMN])
        actual.append(actual_hours)
        predicted.append(prediction)
        prediction_rows.append(
            {
                **row,
                "predicted_disrupted_hours": round(prediction, 4),
                "actual_risk_score": expected_hours_to_risk_score(actual_hours),
                "predicted_risk_score": expected_hours_to_risk_score(prediction),
                "actual_risk_band": risk_score_to_band(expected_hours_to_risk_score(actual_hours)),
                "predicted_risk_band": risk_score_to_band(expected_hours_to_risk_score(prediction)),
            }
        )

    write_csv(predictions_path, prediction_rows)
    create_scatter_svg(actual, predicted, plot_path)

    metrics_payload = json.loads(metrics_path.read_text(encoding="utf-8"))
    metrics_payload["evaluation_artifacts"] = {
        "validation_predictions": to_repo_relative_path(predictions_path),
        "actual_vs_predicted_plot": to_repo_relative_path(plot_path),
    }
    write_json(metrics_path, metrics_payload)
    return metrics_payload


def build_recent_feature_row(city: str, zone: str, shift_type: str, reference_date: date) -> dict[str, Any]:
    history_end = date.fromisoformat(default_history_end(reference_date))
    history_start = history_end - timedelta(days=34)
    recent_rows = fetch_city_history(city, history_start.isoformat(), history_end.isoformat())
    by_city = parse_hourly_rows(recent_rows)
    base_rows = build_base_hourly_rows(by_city)
    city_weekly = aggregate_city_weekly(base_rows)
    zone_shift_weekly = aggregate_zone_shift_weekly(base_rows)
    week_start = week_start_from_service_date(history_end)

    current_key = (city, zone, shift_type, week_start)
    current_zone = zone_shift_weekly.get(current_key)
    current_city = city_weekly.get((city, week_start))
    if current_zone is None or current_city is None:
        raise ValueError(
            f"Could not build current-week features for city={city}, zone={zone}, shift_type={shift_type}."
        )

    zone_metadata = ZONE_METADATA[zone]
    row = {
        **{key: value for key, value in current_zone.items() if key != "week_start"},
        **{key: value for key, value in current_city.items() if key not in {"city", "week_start"}},
        "city": city,
        "zone": zone,
        "shift_type": shift_type,
        "week_start": iso_date(week_start),
        "target_week_start": iso_date(week_start + timedelta(days=7)),
        "zone_flood_prone_score": zone_metadata["flood_prone_score"],
        "zone_aqi_sensitivity_score": zone_metadata["aqi_sensitivity_score"],
        "zone_access_risk_score": zone_metadata["zone_access_risk_score"],
        "safe_zone_discount_hint": zone_metadata["safe_zone_discount_hint"],
        "shift_exposure_loading": SHIFT_DEFINITIONS[shift_type]["exposure_loading"],
        "zone_baseline_risk_score": round(
            zone_metadata["flood_prone_score"] * 0.45
            + zone_metadata["aqi_sensitivity_score"] * 0.30
            + zone_metadata["zone_access_risk_score"] * 0.25,
            4,
        ),
    }

    previous_week = zone_shift_weekly.get((city, zone, shift_type, week_start - timedelta(days=7)))
    previous_2_week = zone_shift_weekly.get((city, zone, shift_type, week_start - timedelta(days=14)))
    row["lagged_disruption_hours_1w"] = previous_week["disrupted_hours_current_week"] if previous_week else 0
    row["lagged_disruption_hours_2w"] = (
        (previous_week["disrupted_hours_current_week"] if previous_week else 0)
        + (previous_2_week["disrupted_hours_current_week"] if previous_2_week else 0)
    )
    row["recent_disruption_hours_1w"] = current_zone["disrupted_hours_current_week"]
    row["recent_disruption_hours_2w"] = current_zone["disrupted_hours_current_week"] + (
        previous_week["disrupted_hours_current_week"] if previous_week else 0
    )
    return row


def rank_top_risk_drivers(feature_row: dict[str, Any], shift_type: str) -> list[str]:
    driver_scores = {
        "heavy rain frequency": safe_float(feature_row.get("heavy_rain_hours_last_7d", 0)) / 4.0
        + safe_float(feature_row.get("max_hourly_rain_last_7d", 0)) / 25.0,
        "flood-prone zone": safe_float(feature_row.get("zone_flood_prone_score", 0)) * 1.2,
        "severe pollution pressure": safe_float(feature_row.get("severe_pollution_hours_last_7d", 0)) / 6.0
        + safe_float(feature_row.get("zone_aqi_sensitivity_score", 0)),
        "heat stress exposure": safe_float(feature_row.get("heat_stress_hours_last_7d", 0)) / 4.0,
        "recent disruption persistence": safe_float(feature_row.get("recent_disruption_hours_2w", 0)) / 4.0,
        "access friction during rain": safe_float(feature_row.get("zone_access_risk_score", 0))
        + safe_float(feature_row.get("total_precip_last_7d", 0)) / 120.0,
        f"{SHIFT_DEFINITIONS[shift_type]['label'].lower()} exposure": SHIFT_DEFINITIONS[shift_type][
            "exposure_loading"
        ]
        / 5.0,
    }
    ranked = sorted(driver_scores.items(), key=lambda item: item[1], reverse=True)
    return [label for label, score in ranked if score > 0.25][:3]


def normalize_city(city: str) -> str:
    normalized = city.strip()
    if normalized == "Delhi NCR":
        return "Delhi"
    if normalized == "Gurgaon":
        return "Gurugram"
    if normalized not in CITY_METADATA:
        raise ValueError(f"Unsupported city '{city}'.")
    return normalized


def normalize_zone(zone: str) -> str:
    normalized = zone.strip()
    alias_map = {
        "Sector 49": "Gurgaon Sec 49",
        "Sec 49": "Gurgaon Sec 49",
        "Gurgaon Sector 49": "Gurgaon Sec 49",
        "Gurugram Sector 49": "Gurgaon Sec 49",
        "Gurgaon Sec 49": "Gurgaon Sec 49",
        "Gurugram Sec 49": "Gurgaon Sec 49",
    }
    canonical = alias_map.get(normalized, normalized)
    if canonical not in ZONE_METADATA:
        raise ValueError(f"Unsupported zone '{zone}'.")
    return canonical


def normalize_shift_type(shift_type: str) -> str:
    normalized = shift_type.strip().lower().replace("-", "_").replace(" ", "_")
    alias_map = {
        "morning": "morning_rush",
        "morning_rush": "morning_rush",
        "afternoon": "afternoon",
        "evening": "evening_rush",
        "evening_rush": "evening_rush",
        "night": "late_night",
        "late_night": "late_night",
    }
    if normalized not in alias_map:
        raise ValueError(f"Unsupported shift_type '{shift_type}'.")
    return alias_map[normalized]


def predict_weekly_risk(
    city: str,
    zone: str,
    shift_type: str,
    coverage_tier: str | None = None,
    feature_context: dict[str, Any] | None = None,
    artifact_path: Path = MODEL_ARTIFACT_PATH,
) -> dict[str, Any]:
    normalized_zone = normalize_zone(zone)
    normalized_city = normalize_city(city)
    zone_city = ZONE_METADATA[normalized_zone]["city"]
    if normalized_city != zone_city:
        normalized_city = zone_city
    normalized_shift = normalize_shift_type(shift_type)

    with artifact_path.open("rb") as handle:
        artifact = pickle.load(handle)

    reference_date = date.today()
    if feature_context and feature_context.get("reference_date"):
        reference_date = date.fromisoformat(str(feature_context["reference_date"]))

    feature_row = build_recent_feature_row(normalized_city, normalized_zone, normalized_shift, reference_date)
    if feature_context:
        for key, value in feature_context.items():
            if key in artifact["summary"]["feature_columns"]:
                feature_row[key] = value
    prediction = round(predict_row(feature_row, artifact), 2)
    risk_score = expected_hours_to_risk_score(prediction)
    risk_band = risk_score_to_band(risk_score)
    premium_loading = premium_loading_for_band(risk_band)

    return {
        "model_version": artifact["summary"]["model_version"],
        "city": normalized_city,
        "zone": normalized_zone,
        "shift_type": normalized_shift,
        "coverage_tier": coverage_tier,
        "risk_score": risk_score,
        "risk_band": risk_band,
        "expected_disrupted_hours": prediction,
        "premium_loading": premium_loading,
        "premium_breakdown_hint": {"ml_risk_loading": premium_loading},
        "top_risk_drivers": rank_top_risk_drivers(feature_row, normalized_shift),
    }


def write_backend_handoff() -> None:
    content = """# Backend Integration Contract

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
"""
    BACKEND_HANDOFF_PATH.write_text(content, encoding="utf-8")


def write_model_report(metrics_payload: dict[str, Any]) -> None:
    top_features = metrics_payload["top_global_features"][:5]
    feature_lines = "\n".join(
        f"- `{feature['feature']}` ({feature['importance_mean']})" for feature in top_features
    )
    report = f"""# GigSuraksha Weekly Disruption Risk Model Report

## Summary

- Target: `next_week_disrupted_hours`
- Modeling approach: portable ridge regression on engineered weekly city-zone-shift features
- Training label source: proxy disruption rules derived from public Open-Meteo hourly weather and air-quality history
- Model version: `{metrics_payload['model_version']}`

## Proxy Label Rules

An hour is marked disrupted when one or more of the following hold:

- precipitation >= {HEAVY_RAIN_THRESHOLD_MM} mm/hour
- rolling 6-hour precipitation >= {FLOOD_ROLLING_6H_THRESHOLD_MM} mm and the zone is flood-prone
- temperature >= {HEAT_TEMP_THRESHOLD_C} C or apparent temperature >= {HEAT_APPARENT_THRESHOLD_C} C
- severe air quality based on PM2.5 / AQI threshold adjusted by zone AQI sensitivity
- severe wind gusts >= {SEVERE_WIND_GUST_THRESHOLD_KMH} km/h

## Validation Metrics

- MAE: {metrics_payload['candidate_metrics']['portable_ridge_regression']['mae']}
- RMSE: {metrics_payload['candidate_metrics']['portable_ridge_regression']['rmse']}
- R2: {metrics_payload['candidate_metrics']['portable_ridge_regression']['r2']}
- Risk-band accuracy: {metrics_payload['candidate_metrics']['portable_ridge_regression']['risk_band_accuracy']}

## Highest-Weight Features

{feature_lines}

## Limitations

- Targets are rule-derived proxies, not insurer claim outcomes.
- Zone priors are manually assigned demo metadata for hackathon realism, not actuarial ground truth.
- A portable pure-Python regression fallback was used for the training run because compiled scientific Python packages were blocked by local macOS code-signing policy in this environment.
"""
    MODEL_REPORT_PATH.write_text(report, encoding="utf-8")


def run_pipeline(start_date: str = DEFAULT_HISTORY_START, end_date: str | None = None) -> dict[str, Any]:
    fetch_all_history(start_date=start_date, end_date=end_date)
    build_training_dataset_from_file()
    artifact = train_model_from_file()
    metrics_payload = evaluate_saved_model()
    write_backend_handoff()
    write_model_report(metrics_payload)
    return artifact
