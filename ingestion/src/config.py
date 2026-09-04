"""Runtime configuration loaded from environment variables and `.env`."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

PACKAGE_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PACKAGE_ROOT / ".env")

# Official DGCA publications are listed on the DGCA portal and data.gov.in.
# Set the direct CSV/Excel download URL here when it is known. Do not invent one.
DGCA_SOURCE_URL = os.getenv("DGCA_SOURCE_URL", "").strip()

TOP_N = int(os.getenv("TOP_N", "10"))
SELECTION_METHOD = os.getenv("SELECTION_METHOD", "TOP_N_BY_PASSENGERS").strip()

DATA_DIRECTORY = Path(
    os.getenv("DATA_DIRECTORY", str(PACKAGE_ROOT / "data"))
).expanduser().resolve()

RAW_DIRECTORY = DATA_DIRECTORY / "dgca" / "raw"
PROCESSED_DIRECTORY = DATA_DIRECTORY / "dgca" / "processed"

HTTP_TIMEOUT_SECONDS = int(os.getenv("HTTP_TIMEOUT_SECONDS", "60"))
HTTP_USER_AGENT = os.getenv(
    "HTTP_USER_AGENT",
    "APIx-ingestion/0.1 (DGCA passenger-traffic fetcher)",
)

DGCA_REFERENCE_PERIOD = os.getenv("DGCA_REFERENCE_PERIOD", "").strip()
DGCA_HEADER_SKIPROWS = os.getenv("DGCA_HEADER_SKIPROWS", "").strip()

# Optional explicit column names (override auto-detection).
COLUMN_MAP = {
    "reference_period": os.getenv("DGCA_COL_REFERENCE_PERIOD", "").strip(),
    "origin_airport": os.getenv("DGCA_COL_ORIGIN_AIRPORT", "").strip(),
    "destination_airport": os.getenv("DGCA_COL_DESTINATION_AIRPORT", "").strip(),
    "origin_city": os.getenv("DGCA_COL_ORIGIN_CITY", "").strip(),
    "destination_city": os.getenv("DGCA_COL_DESTINATION_CITY", "").strip(),
    "passenger_count": os.getenv("DGCA_COL_PASSENGER_COUNT", "").strip(),
    "year": os.getenv("DGCA_COL_YEAR", "").strip(),
    "month": os.getenv("DGCA_COL_MONTH", "").strip(),
    "city_1": os.getenv("DGCA_COL_CITY_1", "").strip(),
    "city_2": os.getenv("DGCA_COL_CITY_2", "").strip(),
    "category": os.getenv("DGCA_COL_CATEGORY", "").strip(),
}

WEIGHT_SUM_TOLERANCE = float(os.getenv("WEIGHT_SUM_TOLERANCE", "1e-6"))


def ensure_data_directories() -> None:
    RAW_DIRECTORY.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIRECTORY.mkdir(parents=True, exist_ok=True)
