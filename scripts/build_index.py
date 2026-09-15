#!/usr/bin/env python3
"""
Step 8: Vector Index Builder for Historical Resolutions.
Indexes approved customer resolutions while guaranteeing complete Golden Set exclusion.
"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from app.retrieval.index import VectorIndex

def main():
    print("=" * 60)
    print("Hiver AI Support Agent: Building Dense Vector Index")
    print("=" * 60)

    index = VectorIndex()
    print(f"[*] Indexed {len(index.cases)} verified historical resolution precedents.")
    print(f"[*] Excluded {len(index.golden_ids_excluded)} Golden Set benchmark instances.")
    print("[+] Vector index ready for nearest-neighbor similarity retrieval.")

if __name__ == "__main__":
    main()
