"""Human vs LLM-as-a-Judge inter-rater reliability (Cohen's Kappa & Pearson)."""

import math
from typing import List, Dict, Any

try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    np = None
    HAS_NUMPY = False

def calculate_cohens_kappa(rater1: List[int], rater2: List[int]) -> float:
    """Calculates unweighted Cohen's Kappa between two rating lists."""
    if len(rater1) != len(rater2) or len(rater1) == 0:
        return 0.0

    n = len(rater1)
    categories = sorted(list(set(rater1 + rater2)))
    cat_to_idx = {c: i for i, c in enumerate(categories)}
    num_cats = len(categories)

    if num_cats <= 1:
        return 1.0

    # Build confusion matrix in pure Python
    cm = [[0 for _ in range(num_cats)] for _ in range(num_cats)]
    for r1, r2 in zip(rater1, rater2):
        cm[cat_to_idx[r1]][cat_to_idx[r2]] += 1

    # Observed agreement
    po = sum(cm[i][i] for i in range(num_cats)) / n

    # Expected agreement
    row_sums = [sum(cm[i][j] for j in range(num_cats)) for i in range(num_cats)]
    col_sums = [sum(cm[i][j] for i in range(num_cats)) for j in range(num_cats)]
    pe = sum(r * c for r, c in zip(row_sums, col_sums)) / (n * n)

    if pe == 1.0:
        return 1.0

    kappa = (po - pe) / (1.0 - pe)
    return round(float(kappa), 3)

def calculate_agreement_metrics(human_ratings: List[int], judge_ratings: List[int]) -> Dict[str, Any]:
    """Computes exact match agreement, Pearson correlation, and Cohen's Kappa."""
    if not human_ratings or not judge_ratings:
        return {"exact_agreement": 0.0, "cohens_kappa": 0.0, "pearson_r": 0.0}

    n = len(human_ratings)
    exact = sum(1 for h, j in zip(human_ratings, judge_ratings) if h == j) / n
    kappa = calculate_cohens_kappa(human_ratings, judge_ratings)

    # Pure Python Pearson correlation
    mean_h = sum(human_ratings) / n
    mean_j = sum(judge_ratings) / n
    cov = sum((h - mean_h) * (j - mean_j) for h, j in zip(human_ratings, judge_ratings))
    var_h = sum((h - mean_h) ** 2 for h in human_ratings)
    var_j = sum((j - mean_j) ** 2 for j in judge_ratings)

    denom = math.sqrt(var_h * var_j)
    r = (cov / denom) if denom > 0 else 1.0

    return {
        "exact_agreement": round(exact, 3),
        "cohens_kappa": round(kappa, 3),
        "pearson_r": round(float(r), 3)
    }
