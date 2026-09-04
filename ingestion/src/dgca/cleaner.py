"""Clean parsed DGCA passenger-traffic records and persist a processed CSV."""

from __future__ import annotations

from pathlib import Path

import pandas as pd

from src.config import PROCESSED_DIRECTORY, ensure_data_directories
from src.dgca.models import INTERNAL_FIELDS, CleanStats
from src.dgca.parser import normalize_airport_code, normalize_city_name
from src.utils.logger import get_logger

logger = get_logger(__name__)

PROCESSED_CSV_NAME = "domestic_passenger_traffic.csv"


def normalize_route(origin: object, destination: object) -> str:
    origin_code = normalize_airport_code(origin, origin)
    dest_code = normalize_airport_code(destination, destination)
    if not origin_code or not dest_code:
        return ""
    return f"{origin_code}-{dest_code}"


def _to_numeric_passengers(series: pd.Series) -> pd.Series:
    cleaned = series.astype(str).str.replace(",", "", regex=False).str.strip()
    return pd.to_numeric(cleaned, errors="coerce")


def clean_passenger_traffic(frame: pd.DataFrame) -> tuple[pd.DataFrame, CleanStats]:
    loaded = len(frame)
    work = frame.copy()

    for column in INTERNAL_FIELDS:
        if column not in work.columns:
            work[column] = pd.NA

    work["origin_city"] = work["origin_city"].map(normalize_city_name)
    work["destination_city"] = work["destination_city"].map(normalize_city_name)
    work["origin_airport"] = [
        normalize_airport_code(code, city)
        for code, city in zip(work["origin_airport"], work["origin_city"], strict=False)
    ]
    work["destination_airport"] = [
        normalize_airport_code(code, city)
        for code, city in zip(work["destination_airport"], work["destination_city"], strict=False)
    ]
    work["route"] = [
        normalize_route(origin, destination)
        for origin, destination in zip(
            work["origin_airport"], work["destination_airport"], strict=False
        )
    ]
    work["passenger_count"] = _to_numeric_passengers(work["passenger_count"])
    work["reference_period"] = work["reference_period"].astype(str).str.strip()
    work.loc[work["reference_period"].isin({"", "nan", "None"}), "reference_period"] = pd.NA

    missing_od = work["origin_airport"].eq("") | work["destination_airport"].eq("")
    missing_route = work["route"].eq("")
    missing_pax = work["passenger_count"].isna()
    invalid_pax = work["passenger_count"] < 0

    removed_mask = missing_od | missing_route | missing_pax | invalid_pax
    removed = int(removed_mask.sum())
    valid = work.loc[~removed_mask].copy()
    valid["passenger_count"] = valid["passenger_count"].astype(int)

    before_dedupe = len(valid)
    grouped = (
        valid.groupby(
            [
                "reference_period",
                "origin_airport",
                "destination_airport",
                "origin_city",
                "destination_city",
                "route",
            ],
            dropna=False,
            as_index=False,
        )["passenger_count"]
        .sum()
    )
    grouped = grouped.sort_values(
        ["reference_period", "passenger_count", "route"],
        ascending=[True, False, True],
    ).reset_index(drop=True)

    normalized = before_dedupe
    retained = len(grouped)
    stats = CleanStats(
        loaded=loaded,
        removed=removed,
        normalized=normalized,
        retained=retained,
    )

    logger.info("Raw records: %s", stats.loaded)
    logger.info("Removed records: %s", stats.removed)
    logger.info("Normalized records: %s", stats.normalized)
    logger.info("Valid records: %s", stats.retained)
    return grouped, stats


def save_processed_csv(frame: pd.DataFrame, output_path: Path | None = None) -> Path:
    ensure_data_directories()
    path = output_path or (PROCESSED_DIRECTORY / PROCESSED_CSV_NAME)
    path.parent.mkdir(parents=True, exist_ok=True)
    columns = [
        "reference_period",
        "origin_airport",
        "destination_airport",
        "origin_city",
        "destination_city",
        "route",
        "passenger_count",
    ]
    frame[columns].to_csv(path, index=False)
    logger.info("Processed CSV written to %s", path)
    return path
