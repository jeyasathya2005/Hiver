#!/usr/bin/env python3
"""
Step 2: Brand Scoring and Selection Script.
Evaluates candidate brands and produces brand statistics and ranking.
"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from app.data.brand_selection import BrandSelector

def main():
    print("=" * 60)
    print("Hiver AI Support Agent: Evaluating Candidate Support Brands")
    print("=" * 60)

    selected = BrandSelector.get_selected_brand()
    print(f"[+] Selected Brand: {selected.get('brand_name')} ({selected.get('twitter_handle')})")
    print(f"[*] Response Rate: {selected.get('response_rate'):.1%}")
    print(f"[*] Intent Diversity: {selected.get('intent_diversity_score')}")
    print(f"[*] Resolution Evidence Density: {selected.get('resolution_evidence_density'):.1%}")
    print(f"[*] Selection Rationale: {selected.get('selection_rationale')}")

if __name__ == "__main__":
    main()
