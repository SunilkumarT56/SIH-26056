# APIx ingestion — Milestone 1

DGCA passenger-traffic ingestion, representative **route basket** construction, and **passenger weights** for the Real-Time Airfare Price Index (APIx).

This module does **not** scrape airline or OTA fares. It only turns official DGCA route traffic into the basket and weights that later airfare collection will use.

```
DGCA
 ↓
Route Traffic
 ↓
Route Basket
 ↓
Passenger Weights
 ↓
Airfare Collection
 ↓
APIx
```

## Why DGCA passenger traffic?

DGCA publishes scheduled domestic city-pair passenger volumes. Those volumes are the public, official measure of how many people fly each route.

APIx needs a **representative basket** of domestic routes, not every city pair in India. Passenger traffic is used so that:

- high-demand routes (for example DEL-BOM) have more influence than thin routes
- the basket can be rebuilt when DGCA publishes a new reference period
- weights are evidence-based rather than chosen by hand

## How weights are calculated

1. Aggregate passenger counts by directional route (`DEL-BOM` is not the same as `BOM-DEL`).
2. Sort routes by passengers, descending.
3. Select the top **N** routes (`TOP_N`, configurable; not hard-coded to 5).
4. For each selected route:

```
weight = route_passengers / total_passengers_in_selected_basket
```

Weights in the selected basket sum to approximately **1.0**. `weight_percent` is `weight * 100`.

## Expected input schema

The parser maps DGCA CSV/Excel columns into this internal schema:

| Field | Meaning |
| --- | --- |
| `reference_period` | Month in `YYYY-MM` |
| `origin_airport` | IATA code (uppercase) |
| `destination_airport` | IATA code (uppercase) |
| `origin_city` | Origin city name |
| `destination_city` | Destination city name |
| `passenger_count` | Numeric passenger total |

DGCA files often use city-pair layouts (`city_1`, `city_2`, `category`, `value`, `year`, `month`) instead of IATA columns. The parser detects those layouts and maps “Passengers from City 1 to City 2” / “City 2 to City 1” into directional routes. Column names can also be set in `.env` (`DGCA_COL_*`).

## Expected output schema

**Processed CSV** — `data/dgca/processed/domestic_passenger_traffic.csv`

Cleaned, aggregated rows with a `route` column (`DEL-BOM`). The raw download is never overwritten.

**Route basket JSON** — `data/dgca/processed/route_basket_YYYY_MM.json`

```json
{
  "basket_id": "APIx-2026-08",
  "reference_period": "2026-08",
  "source": "DGCA",
  "selection_method": "top_n_by_passengers",
  "basket_size": 10,
  "total_basket_passengers": 2500000,
  "routes": [
    {
      "rank": 1,
      "route": "DEL-BOM",
      "origin": "DEL",
      "destination": "BOM",
      "passengers": 520000,
      "weight": 0.208,
      "weight_percent": 20.8
    }
  ]
}
```

The JSON also records `input_mode`, coverage, and weight validation. `input_mode=local_file` means a developer-supplied file was used, not a live download.

## Configure the DGCA source

1. Copy `.env.example` to `.env`.
2. Set `DGCA_SOURCE_URL` to the **direct** CSV or Excel download URL for the official DGCA city-pair / passenger-traffic file.

Do not invent a URL. Official publications are listed on:

- [DGCA](https://www.dgca.gov.in/) — Aviation Data and Statistics → Domestic Air Transport (city-pair passenger traffic workbooks)
- [data.gov.in monthly air traffic statistics](https://www.data.gov.in/catalog/monthly-air-traffic-statistics)

If the portal only offers a HTML listing (no stable file URL), download the workbook once, place it under `data/dgca/raw/`, and run with `--local-file`. Playwright is not used unless a future source truly requires a browser.

Other settings:

| Variable | Role |
| --- | --- |
| `TOP_N` | Basket size |
| `DATA_DIRECTORY` | Root data directory (default: `ingestion/data`) |
| `DGCA_REFERENCE_PERIOD` | Optional `YYYY-MM` filter / filename stamp |
| `HTTP_TIMEOUT_SECONDS` | Download timeout |

Never commit `.env` or secrets.

## Data integrity

This pipeline **does not fabricate DGCA passenger statistics**. If the live source is unavailable, supply a real downloaded file or a **labelled development fixture**. Test fixtures under `tests/fixtures/` are synthetic and must not be presented as official DGCA data.

## Run the pipeline

From `ingestion/`:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then set DGCA_SOURCE_URL when you have it

python -m src.main
```

Offline / development (existing raw file, no download):

```bash
python -m src.main --local-file tests/fixtures/development_input.csv --top-n 5
```

Optional flags: `--source-url`, `--reference-period YYYY-MM`, `--top-n`.

Flow:

```
DGCA source → fetch → data/dgca/raw/ → parse → clean
  → data/dgca/processed/domestic_passenger_traffic.csv
  → aggregate → top-N basket → weights
  → data/dgca/processed/route_basket_YYYY_MM.json
```

Raw files are stored as `dgca_YYYY_MM_raw.csv` (or `.xlsx`) and kept for audit.

## Run tests

```bash
cd ingestion
python -m pytest
```

Tests cover passenger cleaning, route normalization, duplicate aggregation, top-N selection, and weight sums.

## Later connection to airfare collection

Milestone 1 stops at weights. A later airline/OTA ingestion module should:

1. Read `route_basket_*.json`
2. Collect fares only for basket routes
3. Combine fares with these passenger weights to compute APIx

Out of scope here: airline/OTA scrapers, ETL database, APIx formula service, validation service, REST API, and dashboard.
