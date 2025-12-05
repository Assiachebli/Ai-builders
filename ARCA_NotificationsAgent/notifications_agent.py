"""
ARCA Notifications Agent (safe final)

Default: dry-run (no email sent).
To send real email: add an app password into user_preferences.json and run with --send.
"""

import json
import smtplib
import argparse
from pathlib import Path
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

# Using your real filenames
RESEARCHER_UPDATES = PROJECT_ROOT / "outputs" / "researcher_output_chroma.json"
AUDITOR_UPDATES = PROJECT_ROOT / "AuditorAgent" / "outputs" / "auditor_output.json"
GENERATOR_REPORT = PROJECT_ROOT / "GeneratorAgent" / "outputs" / "final_report.json"

USER_PREFS = BASE_DIR / "user_preferences.json"
HTML_TEMPLATE = BASE_DIR / "templates" / "email_template.html"
TXT_TEMPLATE = BASE_DIR / "templates" / "email_template.txt"
NEWSLETTERS_DIR = BASE_DIR / "outputs" / "newsletters"
LOGS_DIR = BASE_DIR / "outputs" / "logs"
STATE_FILE = BASE_DIR / "outputs" / "last_state.json"

# --- helpers ---------------------------------------------------------
def load_json_safe(path: Path):
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None

def _file_digest(path: Path) -> str:
    if not path.exists():
        return ""
    s = path.stat()
    return f"{int(s.st_mtime)}::{s.st_size}"

def _load_state():
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}

def _save_state(state):
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")

def build_email_content(updates, recommendation):
    html_template = HTML_TEMPLATE.read_text(encoding="utf-8") if HTML_TEMPLATE.exists() else None
    txt_template = TXT_TEMPLATE.read_text(encoding="utf-8") if TXT_TEMPLATE.exists() else None

    if updates:
        html_updates = "".join(f"<li>{u}</li>" for u in updates)
        txt_updates = "\n - " + "\n - ".join(updates)
    else:
        html_updates = "<li>No updates</li>"
        txt_updates = "No updates"

    if html_template:
        html = html_template.replace("{{updates}}", html_updates).replace("{{recommendation}}", recommendation)
    else:
        html = f"<html><body><ul>{html_updates}</ul><p>{recommendation}</p></body></html>"

    if txt_template:
        text = txt_template.replace("{{updates}}", txt_updates).replace("{{recommendation}}", recommendation)
    else:
        text = f"Updates:\n{txt_updates}\n\nRecommendation: {recommendation}"

    return html, text

def detect_updates(prefs, state):
    updates = []
    recommendation = "No new recommendations."

    # Researcher: new internal policies
    if prefs.get("subscribe_internal", True):
        digest = _file_digest(RESEARCHER_UPDATES)
        if digest and state.get("researcher_digest") != digest:
            # load top_5_passages summary for a nicer line (if possible)
            r = load_json_safe(RESEARCHER_UPDATES)
            if r and isinstance(r, dict) and r.get("query"):
                updates.append(f"📘 Internal policy update detected (query: {r.get('query')}).")
            else:
                updates.append("📘 Internal policy updates detected (Researcher).")
            state["researcher_digest"] = digest

    # Generator changes (national/international)
    if prefs.get("subscribe_national", True) or prefs.get("subscribe_international", True):
        digest = _file_digest(GENERATOR_REPORT)
        if digest and state.get("generator_digest") != digest:
            if prefs.get("subscribe_national", True):
                updates.append("🇲🇦 New national regulation or report detected (Generator).")
            if prefs.get("subscribe_international", True):
                updates.append("🌍 International regulation updates detected (Generator).")
            state["generator_digest"] = digest

    # Auditor high-risk conflicts and summary counts
    if prefs.get("subscribe_high_risk", True):
        aud = load_json_safe(AUDITOR_UPDATES)
        if aud:
            items = aud.get("results", aud) if isinstance(aud, dict) else aud
            # count severities
            counts = {"HIGH":0, "MEDIUM":0, "LOW":0}
            try:
                for i in items:
                    sev = str(i.get("severity","")).upper() if isinstance(i, dict) else ""
                    if sev in counts:
                        counts[sev]+=1
            except Exception:
                pass
            if counts["HIGH"]>0:
                updates.append(f"⚠️ Auditor detected HIGH risks: {counts['HIGH']}.")
            if counts["MEDIUM"]>0:
                updates.append(f"‼️ Auditor detected MEDIUM risks: {counts['MEDIUM']}.")
            if counts["LOW"]>0 and counts["HIGH"]==0 and counts["MEDIUM"]==0:
                updates.append(f"ℹ️ Auditor detected LOW risks: {counts['LOW']}.")
    # Recommendation logic
    if any("HIGH" in u or "High-risk" in u or "⚠️" in u for u in updates):
        recommendation = "Immediate attention required for HIGH risk items."
    elif any("MEDIUM" in u or "‼️" in u for u in updates):
        recommendation = "Medium-level conflicts detected. Review MEDIUM risks with the compliance team."
    elif updates:
        recommendation = "Review the changes and follow recommended actions."

    return updates, recommendation, state

def send_email_smtp(prefs, to_email, subject, text, html, attach_pdf=False, dry_run=True):
    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = prefs.get("email", "")
    msg["To"] = to_email

    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    if attach_pdf and GENERATOR_REPORT.exists():
        part = MIMEApplication(GENERATOR_REPORT.read_bytes(), _subtype="pdf")
        part.add_header("Content-Disposition", "attachment", filename="ARCA_Report.pdf")
        msg.attach(part)

    if dry_run:
        return msg

    password = prefs.get("email_password", "")
    if not password:
        raise RuntimeError("Email password missing in user_preferences.json. Cannot send real email.")

    smtp_host = prefs.get("smtp_host", "smtp.gmail.com")
    smtp_port = int(prefs.get("smtp_port", 587))

    with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as server:
        server.starttls()
        server.login(prefs.get("email"), password)
        server.sendmail(prefs.get("email"), [to_email], msg.as_string())

    return msg

def main(dry_run=True):
    NEWSLETTERS_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)

    if not USER_PREFS.exists():
        print("[ERROR] user_preferences.json not found in NotificationsAgent folder.")
        return

    prefs = json.loads(USER_PREFS.read_text(encoding="utf-8"))
    state = _load_state()

    updates, recommendation, new_state = detect_updates(prefs, state)
    _save_state(new_state)

    if not updates:
        print("[INFO] No updates detected. Nothing to send.")
        return

    html, text = build_email_content(updates, recommendation)
    subject = "📢 ARCA – Compliance Updates"
    to_email = prefs.get("email", "")

    print("[INFO] Updates detected:")
    for u in updates:
        print(" -", u)
    print("[INFO] Recommendation:", recommendation)
    print("[INFO] Preparing message (dry_run={}):".format(dry_run))

    try:
        msg = send_email_smtp(prefs, to_email, subject, text, html, attach_pdf=prefs.get("attach_pdf", False), dry_run=dry_run)
        ts = datetime.now().strftime("%Y_%m_%d_%H%M%S")
        (NEWSLETTERS_DIR / f"newsletter_{ts}.html").write_text(html, encoding="utf-8")
        (NEWSLETTERS_DIR / f"newsletter_{ts}.txt").write_text(text, encoding="utf-8")
        log = {"sent_at": datetime.now().isoformat(), "updates": updates, "recommendation": recommendation, "dry_run": dry_run}
        (LOGS_DIR / f"log_{ts}.json").write_text(json.dumps(log, indent=2), encoding="utf-8")

        if dry_run:
            print("[DRY RUN] Email prepared but NOT sent (dry-run).")
            print("---- Plain text preview ----")
            print(text)
        else:
            print("[OK] Email sent successfully.")
    except Exception as e:
        print("[ERROR] Failed to send email or prepare it:", str(e))

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--send", action="store_true", help="Send real email (requires password in user_preferences.json)")
    parser.add_argument("--dry-run", action="store_true", help="Dry run (no email sent)")
    args = parser.parse_args()
    dry = True if (args.dry_run or not args.send) else False
    main(dry_run=dry)
