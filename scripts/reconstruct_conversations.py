#!/usr/bin/env python3
"""
Step 3 & 4: Reconstruct Multi-Turn Conversations and Compute Resolution Evidence.
Outputs data/processed/conversations.jsonl and statistics.
"""

import sys
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from app.data.loader import DatasetLoader
from app.data.conversations import ConversationReconstructor
from app.config import settings

def main():
    print("=" * 60)
    print("Hiver AI Support Agent: Reconstructing Dialogues & Resolutions")
    print("=" * 60)

    loader = DatasetLoader()
    all_rows = []
    for chunk in loader.stream_rows(chunk_size=10000):
        all_rows.extend(chunk)
        if len(all_rows) >= 50000:
            break

    print(f"[*] Loaded {len(all_rows):,} rows for conversation reconstruction.")
    convs = ConversationReconstructor.reconstruct_from_rows(all_rows)
    print(f"[+] Reconstructed {len(convs):,} multi-turn support conversations.")

    out_file = settings.PROCESSED_DATA_DIR / "conversations.jsonl"
    out_file.parent.mkdir(parents=True, exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        for c in convs:
            f.write(json.dumps(c) + "\n")

    print(f"[+] Successfully wrote reconstructed conversations to: {out_file}")

if __name__ == "__main__":
    main()
