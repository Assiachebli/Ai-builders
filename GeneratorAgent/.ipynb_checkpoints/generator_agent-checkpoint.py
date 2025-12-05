"""
Generator Agent (Agent n°3) for ARCA

- Loads auditor_output.json produced by the AuditorAgent
- Validates and normalizes the risks
- Builds the final ARCA JSON report with the required schema
- Saves it to GeneratorAgent/outputs/final_report.json
"""

from __future__ import annotations

import json
import logging
import hashlib
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any, Dict, List


# -------------------------------------------------------------------
# Logging configuration
# -------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] %(message)s",
)
logger = logging.getLogger("GeneratorAgent")


# -------------------------------------------------------------------
# Paths configuration (relative to this file)
# -------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

AUDITOR_OUTPUT_PATH = PROJECT_ROOT / "AuditorAgent" / "outputs" / "auditor_output.json"
FINAL_REPORT_PATH = BASE_DIR / "outputs" / "final_report.json"


# -------------------------------------------------------------------
# Data model for a single risk (one row from AuditorAgent)
# -------------------------------------------------------------------

@dataclass
class Risk:
    policy_id: str
    severity: str
    divergence_summary: str
    conflicting_policy_excerpt: str
    new_rule_excerpt: str

    @classmethod
    def from_raw(cls, raw: Dict[str, Any]) -> "Risk":
        """
        Build a Risk object from a raw dict (one element from auditor_output.json).
        Raises ValueError if required fields are missing.
        """
        required_fields = [
            "policy_id",
            "severity",
            "divergence_summary",
            "conflicting_policy_excerpt",
            "new_rule_excerpt",
        ]

        missing = [f for f in required_fields if f not in raw]
        if missing:
            raise ValueError(f"Missing required fields in risk: {missing}")

        return cls(
            policy_id=str(raw["policy_id"]),
            severity=str(raw["severity"]).upper(),
            divergence_summary=str(raw["divergence_summary"]),
            conflicting_policy_excerpt=str(raw["conflicting_policy_excerpt"]),
            new_rule_excerpt=str(raw["new_rule_excerpt"]),
        )


# -------------------------------------------------------------------
# Step 1 – Load and validate AuditorAgent output
# -------------------------------------------------------------------

def load_auditor_output(path: Path = AUDITOR_OUTPUT_PATH) -> List[Risk]:
    """
    Loads and validates the auditor_output.json file.
    Expected: either a JSON array of objects, or {"results": [...]}
    Returns a list of Risk objects.
    """
    if not path.exists():
        raise FileNotFoundError(
            f"Auditor output not found at: {path}\n"
            "Make sure AuditorAgent has created auditor_output.json."
        )

    logger.info(f"Loading auditor output from: {path}")
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    # Accept both: [ {...}, {...} ]  or { "results": [ ... ] }
    if isinstance(data, dict) and "results" in data:
        data_list = data["results"]
    else:
        data_list = data

    if not isinstance(data_list, list):
        raise ValueError(
            "auditor_output.json must be a JSON array or an object with 'results' key."
        )

    risks: List[Risk] = []
    for idx, raw in enumerate(data_list):
        try:
            risk = Risk.from_raw(raw)
            risks.append(risk)
        except ValueError as e:
            logger.warning(f"Skipping invalid risk at index {idx}: {e}")

    logger.info(f"Loaded {len(risks)} valid risks from auditor output.")
    return risks


# -------------------------------------------------------------------
# Step 2 – Build regulation_id
# -------------------------------------------------------------------

def generate_regulation_id(risks: List[Risk]) -> str:
    """
    Generates a deterministic regulation_id based on the new_rule_excerpt(s).
    If later you have the full text of the regulation, you can switch to hashing that instead.
    """
    h = hashlib.sha256()

    if not risks:
        # fallback: empty seed
        h.update(b"EMPTY_RISKS")
    else:
        for r in risks:
            # combine rule text + policy_id to make the hash more stable
            seed = f"{r.policy_id}::{r.new_rule_excerpt}"
            h.update(seed.encode("utf-8"))

    return h.hexdigest()[:16]  # short ID


# -------------------------------------------------------------------
# Step 3 – Build global recommendation
# -------------------------------------------------------------------

def build_global_recommendation(risks: List[Risk]) -> str:
    """
    Builds a global recommendation string based on the highest severity present.
    """
    if not risks:
        return "No conflicts detected. No immediate action required."

    severities = {r.severity.upper() for r in risks}

    if "HIGH" in severities:
        return (
            "Critical conflicts detected. Review HIGH risks with the legal/compliance "
            "team immediately."
        )
    if "MEDIUM" in severities:
        return (
            "Medium-level conflicts detected. Review MEDIUM risks with the "
            "compliance team."
        )

    # Only LOW (or unknown values normalized)
    return "Only LOW-level risks detected. Monitor and review if necessary."


# -------------------------------------------------------------------
# Step 4 – Build final ARCA JSON report
# -------------------------------------------------------------------

def build_final_report(risks: List[Risk]) -> Dict[str, Any]:
    """
    Builds the final ARCA JSON report from a list of Risk objects.

    Final schema:

    {
      "regulation_id": str,
      "date_processed": "YYYY-MM-DD",
      "total_risks_flagged": int,
      "risks": [
        {
          "policy_id": str,
          "severity": "HIGH" | "MEDIUM" | "LOW",
          "divergence_summary": str,
          "conflicting_policy_excerpt": str,
          "new_rule_excerpt": str
        },
        ...
      ],
      "recommendation": str
    }
    """
    regulation_id = generate_regulation_id(risks)
    today = date.today().isoformat()
    total_risks = len(risks)
    recommendation = build_global_recommendation(risks)

    risks_output: List[Dict[str, Any]] = []
    for r in risks:
        risks_output.append(
            {
                "policy_id": r.policy_id,
                "severity": r.severity,
                "divergence_summary": r.divergence_summary,
                "conflicting_policy_excerpt": r.conflicting_policy_excerpt,
                "new_rule_excerpt": r.new_rule_excerpt,
            }
        )

    report: Dict[str, Any] = {
        "regulation_id": regulation_id,
        "date_processed": today,
        "total_risks_flagged": total_risks,
        "risks": risks_output,
        "recommendation": recommendation,
    }

    return report


# -------------------------------------------------------------------
# Step 5 – Save final report
# -------------------------------------------------------------------

def save_final_report(report: Dict[str, Any], path: Path = FINAL_REPORT_PATH) -> None:
    """
    Saves the final JSON report to disk.
    """
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    logger.info(f"Final report saved to: {path}")


# -------------------------------------------------------------------
# Main entrypoint (when running `python generator_agent.py`)
# -------------------------------------------------------------------

def main() -> None:
    """
    Complete pipeline for Agent 3:
    - Load auditor_output.json
    - Validate and normalize risks
    - Build final report
    - Save final_report.json
    """
    logger.info("=== ARCA Generator Agent starting ===")

    risks = load_auditor_output(AUDITOR_OUTPUT_PATH)

    if not risks:
        logger.warning("No valid risks found in auditor output. Report will contain 0 risks.")

    report = build_final_report(risks)
    save_final_report(report, FINAL_REPORT_PATH)

    logger.info("=== ARCA Generator Agent completed successfully ===")


if __name__ == "__main__":
    main()
