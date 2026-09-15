"""Dataset loader with schema validation and chunked processing."""

import csv
import json
from pathlib import Path
from typing import Dict, Any, Generator, List, Optional
from app.config import settings
from app.logging_config import logger

REQUIRED_COLUMNS = [
    "tweet_id",
    "author_id",
    "inbound",
    "created_at",
    "text",
    "response_tweet_id",
    "in_response_to_tweet_id"
]

class DatasetLoader:
    def __init__(self, filepath: Optional[Path] = None):
        if filepath and filepath.exists():
            self.filepath = filepath
        elif settings.RAW_DATASET_PATH.exists():
            self.filepath = settings.RAW_DATASET_PATH
        elif settings.SAMPLE_DATASET_PATH.exists():
            self.filepath = settings.SAMPLE_DATASET_PATH
            logger.info(f"Using starter seed dataset at: {self.filepath}")
        else:
            self.filepath = None
            logger.warning("No raw dataset file found.")

    def validate_schema(self, header: List[str]) -> bool:
        """Verify all required columns are present in CSV header."""
        missing = [col for col in REQUIRED_COLUMNS if col not in header]
        if missing:
            raise ValueError(f"CSV schema missing required columns: {missing}")
        return True

    def stream_rows(self, chunk_size: int = 50000) -> Generator[List[Dict[str, Any]], None, None]:
        """Stream dataset in memory-efficient chunks."""
        if not self.filepath or not self.filepath.exists():
            raise FileNotFoundError("Dataset file does not exist.")

        with open(self.filepath, mode="r", encoding="utf-8", errors="replace") as f:
            reader = csv.DictReader(f)
            self.validate_schema(reader.fieldnames or [])
            
            chunk = []
            for row in reader:
                # Normalize inbound boolean
                row["inbound"] = str(row.get("inbound", "")).strip().lower() in ("true", "1", "t")
                chunk.append(row)
                if len(chunk) >= chunk_size:
                    yield chunk
                    chunk = []
            if chunk:
                yield chunk

    def analyze_dataset_statistics(self) -> Dict[str, Any]:
        """Calculate complete statistics on actual dataset without fabricating."""
        if not self.filepath or not self.filepath.exists():
            return {"error": "Dataset file not found"}

        total_rows = 0
        authors = set()
        inbound_count = 0
        outbound_count = 0
        tweet_ids = set()
        duplicate_ids = 0
        missing_counts = {col: 0 for col in REQUIRED_COLUMNS}
        dates = []

        with open(self.filepath, mode="r", encoding="utf-8", errors="replace") as f:
            reader = csv.DictReader(f)
            self.validate_schema(reader.fieldnames or [])

            for row in reader:
                total_rows += 1
                t_id = row.get("tweet_id")
                if t_id in tweet_ids:
                    duplicate_ids += 1
                elif t_id:
                    tweet_ids.add(t_id)

                for col in REQUIRED_COLUMNS:
                    if not row.get(col):
                        missing_counts[col] += 1

                author = row.get("author_id")
                if author:
                    authors.add(author)

                inbound = str(row.get("inbound", "")).strip().lower() in ("true", "1", "t")
                if inbound:
                    inbound_count += 1
                else:
                    outbound_count += 1

                date_val = row.get("created_at")
                if date_val and len(dates) < 2:
                    dates.append(date_val)

        return {
            "dataset_filepath": str(self.filepath),
            "total_rows": total_rows,
            "total_columns": len(REQUIRED_COLUMNS),
            "columns": REQUIRED_COLUMNS,
            "missing_values": missing_counts,
            "duplicate_tweet_ids": duplicate_ids,
            "unique_authors": len(authors),
            "inbound_tweets": inbound_count,
            "outbound_tweets": outbound_count,
            "inbound_percentage": round((inbound_count / max(1, total_rows)) * 100, 2),
            "outbound_percentage": round((outbound_count / max(1, total_rows)) * 100, 2)
        }
