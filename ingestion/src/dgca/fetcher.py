"""Download DGCA passenger-traffic files from a configured public URL."""

from __future__ import annotations

import re
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

import requests

from src.config import (
    DGCA_SOURCE_URL,
    HTTP_TIMEOUT_SECONDS,
    HTTP_USER_AGENT,
    RAW_DIRECTORY,
    ensure_data_directories,
)
from src.utils.logger import get_logger

logger = get_logger(__name__)

CONTENT_TYPE_EXTENSIONS = {
    "text/csv": ".csv",
    "application/csv": ".csv",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
}


class FetchError(RuntimeError):
    """Raised when the DGCA source cannot be downloaded."""


def _extension_from_url(url: str) -> str:
    path = urlparse(url).path.lower()
    for ext in (".xlsx", ".xls", ".csv"):
        if path.endswith(ext):
            return ext
    return ""


def _extension_from_content_type(content_type: str) -> str:
    mime = content_type.split(";")[0].strip().lower()
    return CONTENT_TYPE_EXTENSIONS.get(mime, "")


def _extension_from_bytes(payload: bytes) -> str:
    if payload.startswith(b"PK"):
        return ".xlsx"
    if payload[:8] == b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1":
        return ".xls"
    return ".csv"


def _period_token(reference_period: str | None) -> str:
    if reference_period:
        match = re.fullmatch(r"(\d{4})-(\d{2})", reference_period.strip())
        if match:
            return f"{match.group(1)}_{match.group(2)}"
        cleaned = re.sub(r"[^0-9A-Za-z]+", "_", reference_period.strip()).strip("_")
        if cleaned:
            return cleaned.lower()
    now = datetime.now()
    return f"{now:%Y_%m}"


def raw_filename(reference_period: str | None, extension: str) -> str:
    return f"dgca_{_period_token(reference_period)}_raw{extension}"


def fetch_dgca_dataset(
    source_url: str | None = None,
    *,
    reference_period: str | None = None,
    destination_dir: Path | None = None,
    timeout: int | None = None,
) -> Path:
    """Download the configured DGCA file and store it untouched under raw/."""
    url = (source_url or DGCA_SOURCE_URL).strip()
    if not url:
        raise FetchError(
            "DGCA_SOURCE_URL is not set. Place the official CSV/Excel download "
            "URL in .env, or pass --local-file to process an existing raw file."
        )

    ensure_data_directories()
    dest_dir = destination_dir or RAW_DIRECTORY
    dest_dir.mkdir(parents=True, exist_ok=True)

    headers = {"User-Agent": HTTP_USER_AGENT}
    timeout_s = timeout if timeout is not None else HTTP_TIMEOUT_SECONDS

    logger.info("Downloading DGCA dataset")
    try:
        response = requests.get(url, headers=headers, timeout=timeout_s, stream=True)
        response.raise_for_status()
        payload = response.content
    except requests.RequestException as exc:
        logger.error("DGCA dataset download failed: %s", exc)
        raise FetchError(f"Failed to download DGCA dataset from configured URL: {exc}") from exc

    if not payload:
        logger.error("DGCA dataset download failed: empty response body")
        raise FetchError("DGCA dataset download returned an empty file.")

    extension = (
        _extension_from_url(url)
        or _extension_from_content_type(response.headers.get("Content-Type", ""))
        or _extension_from_bytes(payload)
    )
    output_path = dest_dir / raw_filename(reference_period, extension)
    output_path.write_bytes(payload)

    logger.info("DGCA dataset downloaded")
    logger.info("Raw file preserved at %s (%s bytes)", output_path, len(payload))
    return output_path
