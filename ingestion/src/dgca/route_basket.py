"""Select a representative route basket and compute passenger weights."""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

from src.config import PROCESSED_DIRECTORY, TOP_N, WEIGHT_SUM_TOLERANCE, ensure_data_directories
from src.dgca.models import BasketRoute, RouteBasket
from src.utils.logger import get_logger

logger = get_logger(__name__)

TOP_N_BY_PASSENGERS = "TOP_N_BY_PASSENGERS"


def aggregate_routes(frame: pd.DataFrame, reference_period: str | None = None) -> pd.DataFrame:
    work = frame.copy()
    if reference_period:
        work = work.loc[work["reference_period"] == reference_period]
    if work.empty:
        return work

    grouped = (
        work.groupby(
            ["reference_period", "origin_airport", "destination_airport", "route"],
            as_index=False,
        )["passenger_count"]
        .sum()
        .sort_values("passenger_count", ascending=False)
        .reset_index(drop=True)
    )
    return grouped


def latest_reference_period(frame: pd.DataFrame) -> str:
    periods = sorted(frame["reference_period"].dropna().astype(str).unique())
    if not periods:
        raise ValueError("No reference period found in cleaned DGCA records.")
    return periods[-1]


def _period_token(reference_period: str) -> str:
    return reference_period.replace("-", "_")


def select_top_n_by_passengers(aggregated: pd.DataFrame, top_n: int) -> pd.DataFrame:
    if top_n < 1:
        raise ValueError("TOP_N must be a positive integer.")
    return aggregated.head(top_n).copy()


def calculate_weights(selected: pd.DataFrame) -> pd.DataFrame:
    weighted = selected.copy().reset_index(drop=True)
    total = int(weighted["passenger_count"].sum())
    if total <= 0:
        raise ValueError("Cannot compute weights: selected basket has no passengers.")

    weights = (weighted["passenger_count"] / total).round(6).tolist()
    weights[-1] = round(1.0 - sum(weights[:-1]), 6)
    weighted["weight"] = weights
    weighted["weight_percent"] = [round(weight * 100, 1) for weight in weights]
    return weighted


def validate_weights(weights: pd.Series, tolerance: float = WEIGHT_SUM_TOLERANCE) -> bool:
    return abs(float(weights.sum()) - 1.0) <= tolerance


def build_route_basket(
    frame: pd.DataFrame,
    *,
    top_n: int | None = None,
    reference_period: str | None = None,
    selection_method: str = TOP_N_BY_PASSENGERS,
    source: str = "DGCA",
    input_mode: str = "downloaded",
) -> RouteBasket:
    method = selection_method.upper().replace("-", "_")
    if method != TOP_N_BY_PASSENGERS:
        raise ValueError(
            f"Unsupported selection method '{selection_method}'. "
            "Milestone 1 supports TOP_N_BY_PASSENGERS only."
        )

    size = top_n if top_n is not None else TOP_N
    period = reference_period or latest_reference_period(frame)
    aggregated = aggregate_routes(frame, reference_period=period)
    logger.info("Routes identified: %s", len(aggregated))

    universe_passengers = int(aggregated["passenger_count"].sum()) if not aggregated.empty else 0
    selected = select_top_n_by_passengers(aggregated, size)
    if selected.empty:
        raise ValueError("No routes available to build a passenger-weighted basket.")

    selected = calculate_weights(selected)
    weight_ok = validate_weights(selected["weight"])
    basket_passengers = int(selected["passenger_count"].sum())
    coverage = (basket_passengers / universe_passengers) if universe_passengers else 0.0
    weight_sum = float(selected["weight"].sum())

    logger.info("Basket size: %s", len(selected))
    logger.info("Basket passenger coverage: %.4f", coverage)
    logger.info("Weight validation: %s", "PASS" if weight_ok else "FAIL")

    routes = [
        BasketRoute(
            rank=index,
            route=str(row.route),
            origin=str(row.origin_airport),
            destination=str(row.destination_airport),
            passengers=int(row.passenger_count),
            weight=float(row.weight),
            weight_percent=float(row.weight_percent),
        )
        for index, row in enumerate(selected.itertuples(index=False), start=1)
    ]

    return RouteBasket(
        basket_id=f"APIx-{period}",
        reference_period=period,
        source=source,
        selection_method="top_n_by_passengers",
        basket_size=len(routes),
        total_basket_passengers=basket_passengers,
        routes=routes,
        input_mode=input_mode,
        total_universe_passengers=universe_passengers,
        passenger_coverage=round(coverage, 6),
        weight_sum=round(weight_sum, 6),
        weight_validation="PASS" if weight_ok else "FAIL",
    )


def save_route_basket(basket: RouteBasket, output_path: Path | None = None) -> Path:
    ensure_data_directories()
    path = output_path or (
        PROCESSED_DIRECTORY / f"route_basket_{_period_token(basket.reference_period)}.json"
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(basket.to_dict(), indent=2) + "\n", encoding="utf-8")
    logger.info("Route basket written to %s", path)
    return path
