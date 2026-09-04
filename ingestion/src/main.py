"""CLI for the DGCA → route basket → passenger-weight pipeline."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from src.config import (
    DGCA_REFERENCE_PERIOD,
    DGCA_SOURCE_URL,
    SELECTION_METHOD,
    TOP_N,
    ensure_data_directories,
)
from src.dgca.cleaner import clean_passenger_traffic, save_processed_csv
from src.dgca.fetcher import fetch_dgca_dataset
from src.dgca.parser import parse_dgca_file
from src.dgca.route_basket import build_route_basket, save_route_basket
from src.utils.logger import get_logger

logger = get_logger("ingestion")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Ingest DGCA domestic passenger traffic, build a top-N route basket, "
            "and compute passenger weights."
        )
    )
    parser.add_argument(
        "--local-file",
        type=Path,
        help="Process an existing raw CSV/Excel file instead of downloading.",
    )
    parser.add_argument(
        "--source-url",
        default=DGCA_SOURCE_URL,
        help="Direct CSV/Excel URL for the DGCA dataset (overrides DGCA_SOURCE_URL).",
    )
    parser.add_argument(
        "--reference-period",
        default=DGCA_REFERENCE_PERIOD or None,
        help="Reference period in YYYY-MM. Inferred from the file when omitted.",
    )
    parser.add_argument(
        "--top-n",
        type=int,
        default=TOP_N,
        help="Basket size for TOP_N_BY_PASSENGERS (default from TOP_N).",
    )
    parser.add_argument(
        "--selection-method",
        default=SELECTION_METHOD,
        help="Basket selection method. Milestone 1 supports TOP_N_BY_PASSENGERS.",
    )
    return parser.parse_args(argv)


def run_pipeline(args: argparse.Namespace) -> dict:
    ensure_data_directories()

    if args.local_file:
        raw_path = args.local_file.expanduser().resolve()
        if not raw_path.exists():
            raise FileNotFoundError(
                f"Local DGCA file not found: {raw_path}. "
                "This path is for a real downloaded file or a clearly labelled "
                "development input — the pipeline will not invent passenger counts."
            )
        input_mode = "local_file"
        logger.info("Using local raw file (development/offline input): %s", raw_path)
    else:
        raw_path = fetch_dgca_dataset(
            args.source_url,
            reference_period=args.reference_period,
        )
        input_mode = "downloaded"

    parsed = parse_dgca_file(raw_path)
    cleaned, stats = clean_passenger_traffic(parsed)
    processed_csv = save_processed_csv(cleaned)

    basket = build_route_basket(
        cleaned,
        top_n=args.top_n,
        reference_period=args.reference_period,
        selection_method=args.selection_method,
        input_mode=input_mode,
    )
    basket_json = save_route_basket(basket)

    summary = {
        "records_loaded": stats.loaded,
        "records_removed": stats.removed,
        "records_retained": stats.retained,
        "routes_identified": int(
            cleaned.loc[cleaned["reference_period"] == basket.reference_period, "route"].nunique()
        ),
        "basket_size": basket.basket_size,
        "total_basket_passengers": basket.total_basket_passengers,
        "weight_sum": basket.weight_sum,
        "weight_validation": basket.weight_validation,
        "processed_csv": str(processed_csv),
        "basket_json": str(basket_json),
        "raw_file": str(raw_path),
        "input_mode": input_mode,
        "reference_period": basket.reference_period,
    }

    logger.info("Pipeline complete")
    logger.info("Records processed: %s loaded, %s retained", stats.loaded, stats.retained)
    logger.info("Routes identified: %s", summary["routes_identified"])
    logger.info("Basket size: %s", basket.basket_size)
    logger.info("Total basket passengers: %s", basket.total_basket_passengers)
    logger.info("Weight sum: %s (%s)", basket.weight_sum, basket.weight_validation)
    logger.info("Output files: %s | %s", processed_csv, basket_json)
    print(json.dumps(summary, indent=2))
    return summary


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        run_pipeline(args)
    except Exception as exc:  # noqa: BLE001 - CLI boundary
        logger.error("%s", exc)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
