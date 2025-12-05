# notifications_agent.py
import os
import json
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

# Paths to other agents (adjust names if your project folders differ)
RESEARCHER_UPDATES = PROJECT_ROOT / "ResearcherAgent" / "outputs" / "researcher_output_chroma.json"
AUDITOR_UPDATES = PROJECT_ROOT / "AuditorAgent" / "outputs" / "auditor_output.json"
GENERATOR_REPORT = PROJECT_ROOT / "GeneratorAgent" / "outputs" / "final_report.json"

USER_PREFS = BASE_DIR / "user_preferences.json"
HTML_TEMPLATE = BASE_DIR / "templates" / "email_template.html"
TXT_TEMPLATE = BASE_DIR / "templates" / "email_template.txt"
NEWSLETTERS_DIR = BASE_DIR / "outputs" / "newsletters"
LOGS_DIR = BASE_DIR / "outputs" / "logs"

# Simple change-detection: we store the last-seen digests
STATE_FILE = BASE_DIR / "outputs" / "last_state.json"


class NotificationsAgent:
    def __init__(self):
        if not USER_PREFS.exists():
            raise FileNotFoundError(f"Create {USER_PREFS} first with your email settings.")
        self.prefs = json.load(open(USER_PREFS, "r", encoding="utf-8"))
        NEWSLETTERS_DIR.mkdir(parents=True, exist_ok=True)
        LOGS_DIR.mkdir(parents=True, exist_ok=True)
        if not STATE_FILE.parent.exists():
            STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        self.state = self._load_state()

    def _load_state(self):
        if STATE_FILE.exists():
            try:
                return json.load(open(STATE_FILE, "r", encoding="utf-8"))
            except Exception:
                return {}
        return {}

    def _save_state(self):
        json.dump(self.state, open(STATE_FILE, "w", encoding="utf-8"), indent=2)

    def _file_digest(self, path: Path) -> str:
        """Return a quick digest (mtime + size) as string for change detection."""
        if not path.exists():
            return ""
        st = path.stat()
        return f"{int(st.st_mtime)}::{st.st_size}"

    def detect_updates(self):
        """Detect what changed since last run and return list of update messages and a recommendation."""
        updates = []
        recommendation = "No new recommendations."

        # Researcher internal policies
        if self.prefs.get("subscribe_internal", False):
            digest = self._file_digest(RESEARCHER_UPDATES)
            if digest and self.state.get("researcher_digest") != digest:
                updates.append("📘 Internal policy updates detected.")
                self.state["researcher_digest"] = digest

        # National regulations (we use generator file change as proxy)
        if self.prefs.get("subscribe_national", False):
            digest = self._file_digest(GENERATOR_REPORT)
            if digest and self.state.get("generator_digest") != digest:
                updates.append("🇲🇦 New national regulation or report detected.")
                self.state["generator_digest"] = digest

        # Auditor high-risk conflicts
        if self.prefs.get("subscribe_high_risk", True):
            if AUDITOR_UPDATES.exists():
                try:
                    aud = json.load(open(AUDITOR_UPDATES, "r", encoding="utf-8"))
                    items = aud.get("results", aud) if isinstance(aud, dict) else aud
                    high_found = any(
                        (isinstance(i, dict) and str(i.get("severity", "")).upper() == "HIGH")
                        for i in items
                    )
                    if high_found:
                        updates.append("⚠️ High-risk compliance issues detected by Auditor.")
                except Exception:
                    updates.append("⚠️ Auditor output changed (unable to parse details).")

        # International/regulatory updates (subscribe_international) — also check generator digest
        if self.prefs.get("subscribe_international", False):
            digest = self._file_digest(GENERATOR_REPORT)
            if digest and self.state.get("generator_digest") != digest:
                updates.append("🌍 International regulation updates detected (see attached report).")

        # Recommendation logic
        if any("High-risk" in u or "HIGH" in u or "⚠️" in u for u in updates):
            recommendation = "Immediate attention required for HIGH risk items."
        elif updates:
            recommendation = "Review the changes and follow recommended actions."

        # Save state for next run
        self._save_state()
        return updates, recommendation

    def build_email_body(self, updates, recommendation):
        html_template = HTML_TEMPLATE.read_text(encoding="utf-8") if HTML_TEMPLATE.exists() else None
        text_template = TXT_TEMPLATE.read_text(encoding="utf-8") if TXT_TEMPLATE.exists() else None

        update_html = "".join(f"<li>{u}</li>" for u in updates) if updates else "<li>No updates</li>"
        update_text = "\n - ".join(updates) if updates else "No updates"

        if html_template:
            html = html_template.replace("{{updates}}", update_html).replace("{{recommendation}}", recommendation)
        else:
            html = f"<html><body><p>{update_html}</p><p>{recommendation}</p></body></html>"

        if text_template:
            text = text_template.replace("{{updates}}", update_text).replace("{{recommendation}}", recommendation)
        else:
            text = f"Updates:\n{update_text}\n\nRecommendation: {recommendation}"

        return html, text

    def send_email(self, updates, recommendation):
        html, text = self.build_email_body(updates, recommendation)

        msg = MIMEMultipart()
        msg["Subject"] = "📢 ARCA – Compliance Updates"
        msg["From"] = self.prefs["email"]
        msg["To"] = self.prefs["email"]

        msg.attach(MIMEText(text, "plain"))
        msg.attach(MIMEText(html, "html"))

        # Attach generator PDF if requested
        if self.prefs.get("attach_pdf", False) and GENERATOR_REPORT.exists():
            with open(GENERATOR_REPORT, "rb") as f:
                part = MIMEApplication(f.read(), _subtype="pdf")
                part.add_header("Content-Disposition", "attachment", filename="ARCA_Report.pdf")
                msg.attach(part)

        # send via SMTP (Gmail example)
        smtp_host = self.prefs.get("smtp_host", "smtp.gmail.com")
        smtp_port = int(self.prefs.get("smtp_port", 587))
        username = self.prefs["email"]
        password = self.prefs["email_password"]

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(username, password)
            server.sendmail(self.prefs["email"], [self.prefs["email"]], msg.as_string())

        # Save newsletter HTML/text for record
        ts = datetime.now().strftime("%Y_%m_%d_%H%M%S")
        newsletter_html = NEWSLETTERS_DIR / f"newsletter_{ts}.html"
        newsletter_txt = NEWSLETTERS_DIR / f"newsletter_{ts}.txt"
        newsletter_html.write_text(html, encoding="utf-8")
        newsletter_txt.write_text(text, encoding="utf-8")

        # save log
        log = {
            "sent_at": datetime.now().isoformat(),
            "updates": updates,
            "recommendation": recommendation
        }
        log_path = LOGS_DIR / f"log_{ts}.json"
        log_path.write_text(json.dumps(log, indent=2), encoding="utf-8")

        print("Email sent and logs saved.")

    def run(self):
        updates, recommendation = self.detect_updates()
        if not updates:
            print("No updates to send based on preferences.")
            return
        self.send_email(updates, recommendation)


if __name__ == "__main__":
    agent = NotificationsAgent()
    agent.run()
