# ARCA Notifications Agent

## What it does
Sends email newsletters when ARCA detects internal policy changes, national/international regulation updates, or high-risk conflicts.

## How to configure
1. Edit user_preferences.json with your email and password (Gmail app password recommended).
2. Make sure the other agents produce these files:
   - ResearcherAgent/outputs/researcher_output.json
   - AuditorAgent/outputs/auditor_output.json
   - GeneratorAgent/outputs/final_report.json

## How to run (dry-run)
1. Open Command Prompt.
2. Run:
   cd "C:\Users\mahli\ARCA_researcher\ARCA_NotificationsAgent"
   python notifications_agent.py

## Dry-run option
If you do not want to send emails yet, edit notifications_agent.py and temporarily replace the SMTP block with print statements (I can show the exact change if needed).

## Scheduling
Use Windows Task Scheduler to run this script daily/weekly/instant as needed.
