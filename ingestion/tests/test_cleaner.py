"""Unit tests for DGCA passenger-count cleaning, route codes, and duplicates.

Fixtures in this module are synthetic development inputs. They are not DGCA data.
"""

from __future__ import annotations

import pandas as pd

from src.dgca.cleaner import clean_passenger_traffic, normalize_route
from src.dgca.parser import normalize_airport_code, normalize_reference_period


def test_passenger_count_cleaning_drops_missing_and_negative() -> None:
    frame = pd.DataFrame(
        {
            "reference_period": ["2026-08"] * 5,
            "origin_airport": ["DEL", "BOM", "BLR", "HYD", "CCU"],
            "destination_airport": ["BOM", "DEL", "DEL", "DEL", "DEL"],
            "origin_city": ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Kolkata"],
            "destination_city": ["Mumbai", "Delhi", "Delhi", "Delhi", "Delhi"],
            "passenger_count": ["1,200", "", -4, "not-a-number", 15],
        }
    )

    cleaned, stats = clean_passenger_traffic(frame)

    assert stats.loaded == 5
    assert stats.removed == 3
    assert stats.retained == 2
    assert set(cleaned["passenger_count"]) == {1200, 15}
    assert cleaned["passenger_count"].dtype == int


def test_route_normalization_uses_iata_codes() -> None:
    assert normalize_route("del", "bom") == "DEL-BOM"
    assert normalize_route("Delhi", "Mumbai") == "DEL-BOM"
    assert normalize_airport_code("blr") == "BLR"
    assert normalize_reference_period("August 2026") == "2026-08"
    assert normalize_reference_period(year=2026, month="8") == "2026-08"


def test_duplicate_route_records_are_aggregated() -> None:
    frame = pd.DataFrame(
        {
            "reference_period": ["2026-08", "2026-08", "2026-08"],
            "origin_airport": ["DEL", "DEL", "BOM"],
            "destination_airport": ["BOM", "BOM", "BLR"],
            "origin_city": ["Delhi", "Delhi", "Mumbai"],
            "destination_city": ["Mumbai", "Mumbai", "Bengaluru"],
            "passenger_count": [10, 7, 3],
        }
    )

    cleaned, stats = clean_passenger_traffic(frame)

    assert stats.loaded == 3
    assert stats.retained == 2
    del_bom = cleaned.loc[cleaned["route"] == "DEL-BOM"].iloc[0]
    assert int(del_bom["passenger_count"]) == 17
    assert list(cleaned["route"]) == ["DEL-BOM", "BOM-BLR"]
