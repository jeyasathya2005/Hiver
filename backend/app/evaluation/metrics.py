"""Evaluation Metrics Calculator for Classification, Escalation, and LLM-as-a-Judge."""

try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    np = None
    HAS_NUMPY = False
from typing import List, Dict, Any

class MetricsCalculator:
    """Computes transparent, reproducible evaluation metrics."""

    @staticmethod
    def calculate_classification_metrics(y_true: List[str], y_pred: List[str]) -> Dict[str, Any]:
        if not y_true or not y_pred:
            return {"accuracy": 0.0, "macro_f1": 0.0, "weighted_f1": 0.0, "per_intent_f1": {}}

        labels = sorted(list(set(y_true + y_pred)))
        correct = sum(1 for yt, yp in zip(y_true, y_pred) if yt == yp)
        accuracy = correct / len(y_true)

        per_intent = {}
        f1_list = []
        weights = []

        for label in labels:
            tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == label and yp == label)
            fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt != label and yp == label)
            fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == label and yp != label)

            precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
            f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

            support = sum(1 for yt in y_true if yt == label)
            per_intent[label] = {
                "precision": round(precision, 3),
                "recall": round(recall, 3),
                "f1": round(f1, 3),
                "support": support
            }
            f1_list.append(f1)
            weights.append(support)

        if HAS_NUMPY:
            macro_f1 = float(np.mean(f1_list)) if f1_list else 0.0
            weighted_f1 = float(np.average(f1_list, weights=weights)) if weights and sum(weights) > 0 else 0.0
        else:
            macro_f1 = float(sum(f1_list) / len(f1_list)) if f1_list else 0.0
            weighted_f1 = float(sum(f * w for f, w in zip(f1_list, weights)) / sum(weights)) if weights and sum(weights) > 0 else 0.0

        return {
            "accuracy": round(accuracy, 3),
            "macro_f1": round(macro_f1, 3),
            "weighted_f1": round(weighted_f1, 3),
            "per_intent_f1": per_intent
        }

    @staticmethod
    def calculate_escalation_metrics(y_true_actions: List[str], y_pred_actions: List[str]) -> Dict[str, Any]:
        """
        Escalation decision metrics.
        Positive class = HUMAN_ESCALATION
        Negative class = AUTO_HANDLE
        """
        tp = 0 # true escalation
        fp = 0 # unnecessary escalation
        fn = 0 # unsafe auto-handle (critical defect!)
        tn = 0 # safe auto-handle

        for yt, yp in zip(y_true_actions, y_pred_actions):
            if yt == "HUMAN_ESCALATION" and yp == "HUMAN_ESCALATION":
                tp += 1
            elif yt == "AUTO_HANDLE" and yp == "HUMAN_ESCALATION":
                fp += 1
            elif yt == "HUMAN_ESCALATION" and yp == "AUTO_HANDLE":
                fn += 1 # Unsafe automation
            elif yt == "AUTO_HANDLE" and yp == "AUTO_HANDLE":
                tn += 1

        total = len(y_true_actions)
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

        safe_automation_rate = tn / total if total > 0 else 0.0
        unsafe_automation_rate = fn / total if total > 0 else 0.0

        return {
            "precision": round(precision, 3),
            "recall": round(recall, 3),
            "f1": round(f1, 3),
            "safe_automation_rate": round(safe_automation_rate, 3),
            "unsafe_automation_rate": round(unsafe_automation_rate, 3),
            "confusion_matrix": {
                "tp_escalated_correctly": tp,
                "fp_unnecessary_escalations": fp,
                "fn_unsafe_auto_handled": fn,
                "tn_safe_auto_handled": tn
            }
        }
