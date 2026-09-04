"""Unit tests for route aggregation and top-N basket selection.

Fixtures in this module are synthetic development inputs. They are not DGCA data.
"""

from __future__ import annotations

import pandas as pd

from src.dgca.route_basket import (
    aggregate_routes,
    build_route_basket,
    select_top_n_by_passengers,
)


def _synthetic_routes() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "reference_period": ["2026-08"] * 6,
            "origin_airport": ["DEL", "BOM", "DEL", "BLR", "DEL", "HYD"],
            "destination_airport": ["BOM", "DEL", "BLR", "DEL", "HYD", "DEL"],
            "origin_city": ["Delhi"] * 6,
            "destination_city": ["Mumbai"] * 6,
            "route": [
                "DEL-BOM",
                "BOM-DEL",
                "DEL-BLR",
                "BLR-DEL",
                "DEL-HYD",
                "HYD-DEL",
            ],
            "passenger_count": [40, 10, 30, 8, 20, 5],
        }
    )


def test_route_aggregation_sums_by_route() -> None:
    frame = pd.concat(
        [
            _synthetic_routes(),
            pd.DataFrame(
                {
                    "reference_period": ["2026-08"],
                    "origin_airport": ["DEL"],
                    "destination_airport": ["BOM"],
                    "origin_city": ["Delhi"],
                    "destination_city": ["Mumbai"],
                    "route": ["DEL-BOM"],
                    "passenger_count": [5],
                }
            ),
        ],
        ignore_index=True,
    )

    aggregated = aggregate_routes(frame, reference_period="2026-08")
    del_bom = aggregated.loc[aggregated["route"] == "DEL-BOM"].iloc[0]
    assert int(del_bom["passenger_count"]) == 45
    assert list(aggregated["route"])[0] == "DEL-BOM"


def test_top_n_basket_selection_is_configurable() -> None:
    aggregated = aggregate_routes(_synthetic_routes(), reference_period="2026-08")

    top_two = select_top_n_by_passengers(aggregated, 2)
    assert list(top_two["route"]) == ["DEL-BOM", "DEL-BLR"]
    assert len(top_two) == 2

    basket = build_route_basket(_synthetic_routes(), top_n=3, reference_period="2026-08")
    assert basket.basket_size == 3
    assert basket.selection_method == "top_n_by_passengers"
    assert [route.route for route in basket.routes] == ["DEL-BOM", "DEL-BLR", "DEL-HYD"]
    assert basket.total_basket_passengers == 90
