"""Unit tests for passenger-weight calculation.

Fixtures in this module are synthetic development inputs. They are not DGCA data.
"""

from __future__ import annotations

import pandas as pd

from src.dgca.route_basket import build_route_basket, calculate_weights, validate_weights


def test_weight_calculation_uses_basket_passenger_share() -> None:
    selected = pd.DataFrame(
        {
            "route": ["DEL-BOM", "DEL-BLR"],
            "origin_airport": ["DEL", "DEL"],
            "destination_airport": ["BOM", "BLR"],
            "passenger_count": [80, 20],
        }
    )

    weighted = calculate_weights(selected)

    assert weighted.iloc[0]["weight"] == 0.8
    assert weighted.iloc[1]["weight"] == 0.2
    assert weighted.iloc[0]["weight_percent"] == 80.0
    assert weighted.iloc[1]["weight_percent"] == 20.0


def test_weights_sum_to_one() -> None:
    frame = pd.DataFrame(
        {
            "reference_period": ["2026-08"] * 4,
            "origin_airport": ["DEL", "BOM", "BLR", "HYD"],
            "destination_airport": ["BOM", "BLR", "HYD", "DEL"],
            "origin_city": ["Delhi", "Mumbai", "Bengaluru", "Hyderabad"],
            "destination_city": ["Mumbai", "Bengaluru", "Hyderabad", "Delhi"],
            "route": ["DEL-BOM", "BOM-BLR", "BLR-HYD", "HYD-DEL"],
            "passenger_count": [3, 3, 3, 1],
        }
    )

    basket = build_route_basket(frame, top_n=4, reference_period="2026-08")
    weight_sum = sum(route.weight for route in basket.routes)

    assert validate_weights(pd.Series(route.weight for route in basket.routes))
    assert abs(weight_sum - 1.0) < 1e-6
    assert basket.weight_validation == "PASS"
    assert basket.weight_sum == 1.0
