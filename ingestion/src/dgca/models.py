"""Internal data models for DGCA route traffic and the APIx route basket."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


INTERNAL_FIELDS = (
    "reference_period",
    "origin_airport",
    "destination_airport",
    "origin_city",
    "destination_city",
    "passenger_count",
)


@dataclass(frozen=True)
class CleanStats:
    loaded: int
    removed: int
    normalized: int
    retained: int


@dataclass
class BasketRoute:
    rank: int
    route: str
    origin: str
    destination: str
    passengers: int
    weight: float
    weight_percent: float

    def to_dict(self) -> dict[str, Any]:
        return {
            "rank": self.rank,
            "route": self.route,
            "origin": self.origin,
            "destination": self.destination,
            "passengers": self.passengers,
            "weight": self.weight,
            "weight_percent": self.weight_percent,
        }


@dataclass
class RouteBasket:
    basket_id: str
    reference_period: str
    source: str
    selection_method: str
    basket_size: int
    total_basket_passengers: int
    routes: list[BasketRoute] = field(default_factory=list)
    input_mode: str = "downloaded"
    total_universe_passengers: int = 0
    passenger_coverage: float = 0.0
    weight_sum: float = 0.0
    weight_validation: str = "FAIL"

    def to_dict(self) -> dict[str, Any]:
        return {
            "basket_id": self.basket_id,
            "reference_period": self.reference_period,
            "source": self.source,
            "selection_method": self.selection_method,
            "basket_size": self.basket_size,
            "total_basket_passengers": self.total_basket_passengers,
            "input_mode": self.input_mode,
            "total_universe_passengers": self.total_universe_passengers,
            "passenger_coverage": self.passenger_coverage,
            "weight_sum": self.weight_sum,
            "weight_validation": self.weight_validation,
            "routes": [route.to_dict() for route in self.routes],
        }
