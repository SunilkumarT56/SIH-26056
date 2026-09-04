"""Parse DGCA CSV/Excel files into the internal passenger-traffic schema."""

from __future__ import annotations

import re
from pathlib import Path

import pandas as pd

from src.config import COLUMN_MAP, DGCA_HEADER_SKIPROWS
from src.dgca.models import INTERNAL_FIELDS
from src.utils.logger import get_logger

logger = get_logger(__name__)

CITY_TO_IATA = {
    "DELHI": "DEL",
    "NEW DELHI": "DEL",
    "MUMBAI": "BOM",
    "BOMBAY": "BOM",
    "BENGALURU": "BLR",
    "BANGALORE": "BLR",
    "HYDERABAD": "HYD",
    "KOLKATA": "CCU",
    "CALCUTTA": "CCU",
    "CHENNAI": "MAA",
    "MADRAS": "MAA",
    "PUNE": "PNQ",
    "AHMEDABAD": "AMD",
    "GOA": "GOI",
    "GOA DABOLIM": "GOI",
    "KOCHI": "COK",
    "COCHIN": "COK",
    "THIRUVANANTHAPURAM": "TRV",
    "TRIVANDRUM": "TRV",
    "JAIPUR": "JAI",
    "LUCKNOW": "LKO",
    "CHANDIGARH": "IXC",
    "GUWAHATI": "GAU",
    "PATNA": "PAT",
    "BHUBANESWAR": "BBI",
    "INDORE": "IDR",
    "NAGPUR": "NAG",
    "COIMBATORE": "CJB",
    "VISAKHAPATNAM": "VTZ",
    "VIZAG": "VTZ",
    "VARANASI": "VNS",
    "SRINAGAR": "SXR",
    "AMRITSAR": "ATQ",
    "SURAT": "STV",
    "RAIPUR": "RPR",
    "RANCHI": "IXR",
    "MADURAI": "IXM",
    "MANGALORE": "IXE",
    "MANGALURU": "IXE",
    "TIRUCHIRAPPALLI": "TRZ",
    "TRICHY": "TRZ",
    "BAGDOGRA": "IXB",
    "PORT BLAIR": "IXZ",
    "IMPHAL": "IMF",
    "AGARTALA": "IXA",
    "UDAIPUR": "UDR",
    "JODHPUR": "JDH",
    "VADODARA": "BDQ",
    "BARODA": "BDQ",
    "BHOPAL": "BHO",
    "KANPUR": "KNU",
    "DEHRADUN": "DED",
    "LEH": "IXL",
    "PRAYAGRAJ": "IXD",
    "ALLAHABAD": "IXD",
    "GAYA": "GAY",
    "TIRUPATI": "TIR",
    "VIJAYAWADA": "VGA",
    "RAJKOT": "HSR",
    "JAMMU": "IXJ",
    "AURANGABAD": "IXU",
    "HUBLI": "HBX",
    "HUBBALLI": "HBX",
}

COLUMN_ALIASES = {
    "reference_period": (
        "reference_period",
        "period",
        "month_year",
        "year_month",
        "ref_period",
        "yyyymm",
    ),
    "origin_airport": (
        "origin_airport",
        "origin",
        "from_airport",
        "airport_from",
        "orig",
        "dep_airport",
        "from",
    ),
    "destination_airport": (
        "destination_airport",
        "destination",
        "to_airport",
        "airport_to",
        "dest",
        "arr_airport",
        "to",
    ),
    "origin_city": ("origin_city", "from_city", "city_from", "origin_name"),
    "destination_city": (
        "destination_city",
        "to_city",
        "city_to",
        "destination_name",
    ),
    "passenger_count": (
        "passenger_count",
        "passengers",
        "pax",
        "pax_count",
        "total_passengers",
        "no_of_passengers",
        "number_of_passengers",
        "passengers_carried",
        "passengers_carried_in_number",
        "pax_carried",
        "value",
    ),
    "year": ("year", "yr"),
    "month": ("month", "mon"),
    "city_1": ("city_1", "city1", "city pair 1", "citypair1"),
    "city_2": ("city_2", "city2", "city pair 2", "citypair2"),
    "category": ("category", "item", "parameter", "description"),
}

MONTH_NAMES = {
    "jan": "01",
    "january": "01",
    "feb": "02",
    "february": "02",
    "mar": "03",
    "march": "03",
    "apr": "04",
    "april": "04",
    "may": "05",
    "jun": "06",
    "june": "06",
    "jul": "07",
    "july": "07",
    "aug": "08",
    "august": "08",
    "sep": "09",
    "sept": "09",
    "september": "09",
    "oct": "10",
    "october": "10",
    "nov": "11",
    "november": "11",
    "dec": "12",
    "december": "12",
}

PASSENGER_CATEGORY_FORWARD = "passengers from city 1 to city 2"
PASSENGER_CATEGORY_REVERSE = "passengers from city 2 to city 1"

CITY_PAIR_REQUIRED_MESSAGE = (
    "Airline monthly operating statistics (passengers carried by month) cannot "
    "be turned into a route basket. Use a DGCA domestic city-pair passenger-"
    "traffic file with origin/destination or city_1/city_2 columns."
)


class ParseError(ValueError):
    """Raised when a DGCA file cannot be mapped into the internal schema."""


def _normalize_header(value: object) -> str:
    text = str(value or "").strip().lower()
    text = text.replace("\n", " ")
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")


def _read_table(path: Path, skiprows: int | None = None) -> pd.DataFrame:
    suffix = path.suffix.lower()
    kwargs: dict = {}
    if skiprows is not None:
        kwargs["skiprows"] = skiprows

    if suffix in {".xlsx", ".xls"}:
        frame = pd.read_excel(path, **kwargs)
    elif suffix == ".csv":
        frame = pd.read_csv(path, **kwargs)
    else:
        raise ParseError(f"Unsupported DGCA file type: {path.suffix}")

    frame.columns = [_normalize_header(col) for col in frame.columns]
    return frame


def _is_passenger_count_header(column: str) -> bool:
    """True for passenger-volume headers, not passenger-km or load-factor columns."""
    if column in COLUMN_ALIASES["passenger_count"]:
        return True
    if "passengers_carried" in column or column in {"pax_carried", "pax_carried_in_number"}:
        return True
    return False


def _looks_like_header_row(values: list[object]) -> bool:
    tokens = {_normalize_header(value) for value in values if str(value).strip()}
    aliases = {alias for names in COLUMN_ALIASES.values() for alias in names}
    matches = len(tokens & aliases)
    if any(_is_passenger_count_header(token) for token in tokens):
        matches += 1
    return matches >= 2


def _has_city_pair_or_od_columns(frame: pd.DataFrame) -> bool:
    return any(
        _resolve_column(frame, field)
        for field in (
            "origin_airport",
            "destination_airport",
            "origin_city",
            "destination_city",
            "city_1",
            "city_2",
        )
    )


def detect_header_skiprows(path: Path, max_rows: int = 20) -> int:
    """Find a header row when DGCA workbooks include title rows above the table."""
    suffix = path.suffix.lower()
    if suffix in {".xlsx", ".xls"}:
        preview = pd.read_excel(path, header=None, nrows=max_rows)
    else:
        preview = pd.read_csv(path, header=None, nrows=max_rows)

    for index, row in preview.iterrows():
        if _looks_like_header_row(row.tolist()):
            return int(index)
    return 0


def _resolve_column(frame: pd.DataFrame, field: str) -> str | None:
    configured = COLUMN_MAP.get(field, "")
    if configured:
        key = _normalize_header(configured)
        if key in frame.columns:
            return key
        raise ParseError(f"Configured column '{configured}' for {field} was not found.")

    for alias in COLUMN_ALIASES[field]:
        if alias in frame.columns:
            return alias

    if field == "passenger_count":
        for column in frame.columns:
            if _is_passenger_count_header(str(column)):
                return str(column)
    return None


def _is_missing(value: object) -> bool:
    if value is None:
        return True
    try:
        if pd.isna(value):
            return True
    except (TypeError, ValueError):
        pass
    text = str(value).strip().lower()
    return text in {"", "nan", "none", "nat", "<na>"}


def normalize_city_name(value: object) -> str:
    if _is_missing(value):
        return ""
    text = re.sub(r"\s+", " ", str(value).strip())
    return text.title() if text else ""


def normalize_airport_code(value: object, city: object | None = None) -> str:
    token = ""
    if not _is_missing(value):
        token = re.sub(r"[^A-Z0-9]", "", str(value).strip().upper())
        if re.fullmatch(r"[A-Z]{3}", token):
            return token

    city_source = city if not _is_missing(city) else value
    if _is_missing(city_source):
        return ""
    city_key = re.sub(r"\s+", " ", str(city_source).strip()).upper()
    if city_key in CITY_TO_IATA:
        return CITY_TO_IATA[city_key]
    return token


def _month_number(month: object) -> str | None:
    text = str(month or "").strip().lower()
    if not text or text == "nan":
        return None
    if text in MONTH_NAMES:
        return MONTH_NAMES[text]
    try:
        return f"{int(float(text)):02d}"
    except ValueError:
        return None


def normalize_reference_period(
    value: object | None = None,
    year: object | None = None,
    month: object | None = None,
) -> str:
    year_text = str(year or "").strip()
    month_num = _month_number(month)
    if year_text and year_text.lower() != "nan" and month_num:
        try:
            year_text = str(int(float(year_text)))
        except ValueError:
            pass
        return f"{year_text}-{month_num}"

    text = str(value or "").strip()
    if not text or text.lower() == "nan":
        return ""

    iso = re.fullmatch(r"(20\d{2})[-/](\d{1,2})", text)
    if iso:
        return f"{iso.group(1)}-{int(iso.group(2)):02d}"

    compact = re.fullmatch(r"(20\d{2})(\d{2})", text)
    if compact:
        return f"{compact.group(1)}-{compact.group(2)}"

    month_match = re.search(
        r"(january|february|march|april|may|june|july|august|september|"
        r"october|november|december|sept|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)",
        text,
        flags=re.IGNORECASE,
    )
    year_match = re.search(r"(20\d{2})", text)
    if month_match and year_match:
        return f"{year_match.group(1)}-{MONTH_NAMES[month_match.group(1).lower()]}"
    return text


def _normalize_period_from_parts(year: object, month: object, fallback: object) -> str:
    return normalize_reference_period(value=fallback, year=year, month=month)


def _passenger_direction(category: object) -> str | None:
    text = str(category or "").strip().lower()
    if "freight" in text or "mail" in text or "cargo" in text:
        return None
    if PASSENGER_CATEGORY_REVERSE in text or "city 2 to city 1" in text:
        return "reverse"
    if PASSENGER_CATEGORY_FORWARD in text or "city 1 to city 2" in text:
        return "forward"
    if "passenger" in text:
        return "forward"
    return None


def _from_city_pair_layout(frame: pd.DataFrame) -> pd.DataFrame:
    city_1 = _resolve_column(frame, "city_1")
    city_2 = _resolve_column(frame, "city_2")
    category = _resolve_column(frame, "category")
    value = _resolve_column(frame, "passenger_count")
    year = _resolve_column(frame, "year")
    month = _resolve_column(frame, "month")
    period = _resolve_column(frame, "reference_period")

    if not (city_1 and city_2 and value):
        return pd.DataFrame()

    rows: list[dict] = []
    for _, record in frame.iterrows():
        direction = _passenger_direction(record[category]) if category else "forward"
        if direction is None:
            continue

        origin_city = record[city_1] if direction == "forward" else record[city_2]
        dest_city = record[city_2] if direction == "forward" else record[city_1]
        rows.append(
            {
                "reference_period": _normalize_period_from_parts(
                    record[year] if year else None,
                    record[month] if month else None,
                    record[period] if period else None,
                ),
                "origin_airport": normalize_airport_code(origin_city, origin_city),
                "destination_airport": normalize_airport_code(dest_city, dest_city),
                "origin_city": normalize_city_name(origin_city),
                "destination_city": normalize_city_name(dest_city),
                "passenger_count": record[value],
            }
        )
    return pd.DataFrame(rows, columns=list(INTERNAL_FIELDS))


def _from_direct_layout(frame: pd.DataFrame) -> pd.DataFrame:
    origin = _resolve_column(frame, "origin_airport")
    destination = _resolve_column(frame, "destination_airport")
    origin_city = _resolve_column(frame, "origin_city")
    dest_city = _resolve_column(frame, "destination_city")
    passengers = _resolve_column(frame, "passenger_count")
    period = _resolve_column(frame, "reference_period")
    year = _resolve_column(frame, "year")
    month = _resolve_column(frame, "month")

    if passengers is None:
        raise ParseError("Could not detect a passenger-count column in the DGCA file.")
    if origin is None and origin_city is None:
        raise ParseError(
            "Could not detect origin airport/city columns in the DGCA file. "
            + CITY_PAIR_REQUIRED_MESSAGE
        )
    if destination is None and dest_city is None:
        raise ParseError(
            "Could not detect destination airport/city columns in the DGCA file. "
            + CITY_PAIR_REQUIRED_MESSAGE
        )

    mapped = pd.DataFrame()
    origin_values = frame[origin] if origin else frame[origin_city]
    dest_values = frame[destination] if destination else frame[dest_city]
    origin_city_values = frame[origin_city] if origin_city else origin_values
    dest_city_values = frame[dest_city] if dest_city else dest_values

    mapped["origin_city"] = origin_city_values.map(normalize_city_name)
    mapped["destination_city"] = dest_city_values.map(normalize_city_name)
    mapped["origin_airport"] = [
        normalize_airport_code(code, city)
        for code, city in zip(origin_values, origin_city_values, strict=False)
    ]
    mapped["destination_airport"] = [
        normalize_airport_code(code, city)
        for code, city in zip(dest_values, dest_city_values, strict=False)
    ]
    mapped["passenger_count"] = frame[passengers]
    mapped["reference_period"] = [
        _normalize_period_from_parts(
            record[year] if year else None,
            record[month] if month else None,
            record[period] if period else None,
        )
        for _, record in frame.iterrows()
    ]
    return mapped[list(INTERNAL_FIELDS)]


def parse_dgca_file(path: str | Path, skiprows: int | None = None) -> pd.DataFrame:
    source = Path(path)
    if not source.exists():
        raise FileNotFoundError(f"DGCA file not found: {source}")

    if skiprows is None:
        if DGCA_HEADER_SKIPROWS:
            skiprows = int(DGCA_HEADER_SKIPROWS)
        else:
            skiprows = detect_header_skiprows(source)

    raw = _read_table(source, skiprows=skiprows)
    raw = raw.dropna(how="all")
    logger.info("Parsed %s rows from %s", len(raw), source.name)

    city_pair = _from_city_pair_layout(raw)
    if not city_pair.empty:
        logger.info("Mapped DGCA city-pair layout into internal schema")
        return city_pair

    if not _has_city_pair_or_od_columns(raw) and _resolve_column(raw, "passenger_count"):
        raise ParseError(
            "Could not detect origin/destination or city-pair columns in the DGCA file. "
            + CITY_PAIR_REQUIRED_MESSAGE
        )

    mapped = _from_direct_layout(raw)
    logger.info("Mapped DGCA columns into internal schema")
    return mapped
