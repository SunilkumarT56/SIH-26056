"""Parser tests for DGCA layouts, including airline monthly statistics files."""

from __future__ import annotations

from pathlib import Path

import pytest

from src.dgca.parser import ParseError, parse_dgca_file

FIXTURES = Path(__file__).parent / "fixtures"


def test_parse_development_city_pair_fixture() -> None:
    parsed = parse_dgca_file(FIXTURES / "development_input.csv")
    assert set(parsed["origin_airport"]) == {"DEL", "BOM", "BLR", "HYD", "CCU", "MAA"}
    assert int(parsed["passenger_count"].sum()) == 775


def test_passengers_carried_column_maps_when_routes_are_present(tmp_path: Path) -> None:
    path = tmp_path / "city_pair_carried.csv"
    path.write_text(
        "origin,destination,PASSENGERS CARRIED (IN NUMBER)\nDEL,BOM,100\nBOM,DEL,80\n",
        encoding="utf-8",
    )
    parsed = parse_dgca_file(path)
    assert list(parsed["passenger_count"]) == [100, 80]
    assert list(parsed["origin_airport"]) == ["DEL", "BOM"]


def test_airline_monthly_stats_without_routes_raises(tmp_path: Path) -> None:
    path = tmp_path / "airline_monthly.csv"
    path.write_text(
        "YEAR,TITLE,AIRLINE\n"
        "2026,Monthly Traffic And Operating Statistics,AIR INDIA\n"
        "MONTH,AIRCRAFT FLOWN,PASSENGERS CARRIED (IN NUMBER)\n"
        "JAN,15435,2297474\n",
        encoding="utf-8",
    )
    with pytest.raises(ParseError, match="city-pair"):
        parse_dgca_file(path)


def test_air_india_monthly_template_is_rejected() -> None:
    source = Path(__file__).resolve().parents[1] / "data/dgca/raw/Air India26.xlsx"
    if not source.exists():
        pytest.skip("Air India monthly template is not in the workspace")
    with pytest.raises(ParseError, match="city-pair"):
        parse_dgca_file(source)
