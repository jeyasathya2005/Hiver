#!/usr/bin/env python3
"""
Step 1: Dataset Ingestion and Quality Validation Script.
Analyzes the Customer Support on Twitter dataset (twcs.csv).
Outputs data/processed/dataset_report.json and data/analysis/dataset_report.md.
"""

import os
import sys
import json
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from app.data.loader import DatasetLoader
from app.config import settings

def main():
    print("=" * 60)
    print("Hiver AI Support Agent: Analyzing Customer Support Dataset")
    print("=" * 60)

    loader = DatasetLoader()
    if not loader.filepath or not loader.filepath.exists():
        print(f"[!] Dataset not found at: {settings.RAW_DATASET_PATH}")
        print("    Please place the Kaggle 'twcs.csv' file in data/raw/twcs.csv")
        print("    Using starter seed data for pipeline integrity check...")

    stats = loader.analyze_dataset_statistics()
    print(f"[*] Processed {stats.get('total_rows', 0):,} rows.")
    print(f"[*] Unique authors: {stats.get('unique_authors', 0):,}")
    print(f"[*] Inbound: {stats.get('inbound_percentage', 0)}% | Outbound: {stats.get('outbound_percentage', 0)}%")
    print(f"[*] Missing values: {stats.get('missing_values')}")

    out_json = settings.PROCESSED_DATA_DIR / "dataset_report.json"
    out_json.parent.mkdir(parents=True, exist_ok=True)
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2)

    print(f"[+] Successfully wrote dataset report to: {out_json}")

if __name__ == "__main__":
    main()
