#!/usr/bin/env python3
"""
Step 15 & 17: Comprehensive Evaluation Runner.
Executes baseline models, full pipeline, ablation studies, and LLM-as-a-judge across the golden set.
"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from app.evaluation.runner import run_golden_evaluation

def main():
    print("=" * 75)
    print("Hiver AI Support Agent: Benchmark Evaluation on Golden Set")
    print("=" * 75)

    metrics = run_golden_evaluation()
    hl = metrics["headline_metrics"]

    print("\n[ HEADLINE BENCHMARKS ]")
    print(f"  * Intent Accuracy:             {hl['intent_accuracy']:.1%}")
    print(f"  * Macro F1 (10 intents):        {hl['macro_f1']:.3f}")
    print(f"  * Weighted F1:                  {hl['weighted_f1']:.3f}")
    print(f"  * Escalation Precision:         {hl['escalation_precision']:.1%}")
    print(f"  * Escalation Recall:            {hl['escalation_recall']:.1%}")
    print(f"  * Escalation F1:                {hl['escalation_f1']:.3f}")
    print(f"  * Safe Automation Rate:         {hl['safe_automation_rate']:.1%}")
    print(f"  * Unsafe Automation Rate:       {hl['unsafe_automation_rate']:.1%} (False Negative Auto-Handle)")

    print("\n[ LLM-AS-A-JUDGE (0 to 2 Scale) ]")
    judge = metrics["llm_judge_scores_scale_0_to_2"]
    for rubric, score in judge.items():
        print(f"  * {rubric.capitalize():<22}: {score:.2f} / 2.00")

    print("\n[ HUMAN-JUDGE CALIBRATION ]")
    calib = metrics["judge_human_calibration"]
    print(f"  * Exact Agreement:              {calib['exact_agreement']:.1%}")
    print(f"  * Cohen's Kappa:                {calib['cohens_kappa']:.3f}")
    print(f"  * Pearson r:                    {calib['pearson_r']:.3f}")

    print("\n[ BASELINES COMPARISON ]")
    print(f"{'Model Architecture':<36} | {'Accuracy':<8} | {'Escalation F1':<13} | {'Safe Auto':<10} | {'Unsafe Auto':<11}")
    print("-" * 88)
    for b in metrics["baselines_comparison"]:
        print(f"{b['model']:<36} | {b['intent_accuracy']:<8.1%} | {b['escalation_f1']:<13.3f} | {b['safe_auto_rate']:<10.1%} | {b['unsafe_auto_rate']:<11.1%}")

    print("\n[ ABLATION EXPERIMENTS ]")
    print(f"{'System Configuration':<44} | {'Accuracy':<8} | {'Grounding':<9} | {'Unsafe Auto':<11}")
    print("-" * 80)
    for a in metrics["ablation_experiments"]:
        print(f"{a['configuration']:<44} | {a['intent_accuracy']:<8.1%} | {a['grounding_score']:<9.2f} | {a['unsafe_auto_rate']:<11.1%}")

    print("=" * 75)
    print("Evaluation completed successfully.")

if __name__ == "__main__":
    main()
