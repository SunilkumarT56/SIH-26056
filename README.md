# APIx — Real-Time Airfare Price Index for India

Smart India Hackathon problem **26056**: an automated, high-frequency airfare index that can augment the Consumer Price Index (CPI).

This repository’s **ingestion** module is Milestone 1 of that platform: DGCA passenger-traffic → representative **route basket** → **passenger weights**. It does not scrape airline or OTA fares.

```
DGCA  →  Route Traffic  →  Route Basket  →  Passenger Weights  →  Airfare Collection  →  APIx
```

---

## Problem statement

| | |
| --- | --- |
| **ID** | 26056 |
| **Title** | Development of a Real-time Airfare Price Index for India through Automated Web Scraping of Airline and Online Travel Aggregator Portals for Augmentation of the Consumer Price Index (CPI) |
| **Organization** | Ministry of Statistics and Programme Implementation (MoSPI) |
| **Department** | Data Informatics & Innovation Division (DIID) |
| **Category** | Software |
| **Theme** | Smart Automation |
| **Dataset** | [eSankhyiki (MoSPI)](https://esankhyiki.mospi.gov.in) |
| **YouTube** | Not published with the problem statement |
| **Contact** | Not published with the problem statement |

### Background

The Consumer Price Index (CPI) released by the National Statistical Office (NSO), MoSPI, is India’s primary measure of retail inflation. The Reserve Bank of India uses it under the flexible inflation-targeting framework.

The current CPI framework collects *Transport and Communication* prices, including air fares, mainly through **manual** collection from a limited set of outlets and ticketing offices. Over **90%** of domestic tickets are now sold online (airline sites and OTAs such as MakeMyTrip, Yatra, EaseMyTrip, Cleartrip, Ixigo, and Goibibo). Manual collection does not capture the route-specific, time-sensitive prices travellers actually pay.

Domestic fares are dynamic: the same sector can move **200–400%** within a day with advance-purchase window, day of week, demand, festivals, and fuel-linked surcharges. The problem asks for an automated, scalable, high-frequency system that mirrors what a real Indian traveller pays.

### What the platform must do

Build an end-to-end system that:

1. Collects fares from major Indian airlines (IndiGo, Air India, Air India Express, Akasa Air, SpiceJet) and leading OTAs.
2. Cleans and normalises quotes (outliers, missing values, sold-out/cancelled flights; split base fare, taxes, UDF, convenience charges).
3. Computes a Real-time Airfare Price Index (**APIx**) at **daily, weekly, and monthly** frequencies.
4. Uses a **basket of representative city-pairs** (for example DEL-BOM, DEL-BLR, BOM-BLR, DEL-CCU, BLR-HYD, MAA-DEL) chosen from **DGCA passenger-traffic** data.
5. Captures multiple advance-purchase windows: **T+1, T+7, T+15, T+30, T+45**.
6. Handles JS-rendered pages, CAPTCHAs, anti-bot measures, IP rotation, and session management **while remaining compliant** with robots.txt and terms of service, with rate limits and ethical-scraping safeguards.
7. Exposes a dashboard (trends, sector heatmaps, lead-time elasticity) and an **API for NSO and RBI**.

Collection engines may use Python (Scrapy / Selenium / Playwright) for scheduled daily extraction. The fare store should keep origin, destination, carrier, advance-purchase window, fare class, base fare, taxes, and total fare. Index construction follows PSD-given routes and weights. The prototype should include documentation, automated tests, and at least **30 days of back-tests** against publicly available DGCA monthly average-fare data.

### How this module maps to the statement

| Problem requirement | This module |
| --- | --- |
| Basket of city-pairs from DGCA traffic | Parses official city-pair passenger files, ranks routes, writes `route_basket_*.json` |
| PSD routes and weights | `weight = route_passengers / total_passengers_in_selected_basket` |
| Airline / OTA scraping, APIx formula, dashboard, NSO API | **Out of scope here** — later milestones consume the basket JSON |

Airline monthly operating statistics (passengers carried by month, no origin/destination) **cannot** build a route basket. Use DGCA **domestic city-pair** passenger-traffic workbooks.

---

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
- [eSankhyiki (MoSPI)](https://esankhyiki.mospi.gov.in) — problem-statement dataset portal

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
w
