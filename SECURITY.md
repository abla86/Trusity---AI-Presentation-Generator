# Security and responsible use

## Scope
Trusity is an AI-assisted presentation prototype. Generated slides, factual statements, citations, images and exports require human review. A successful generation or export is not evidence of factual accuracy, accessibility, licensing clearance or suitability for professional use.

## Secrets and integrations
- Keep `GEMINI_API_KEY` in server-side environment configuration only.
- Never commit `.env`, credentials, tokens, private source material or customer data.
- Rotate any exposed credential; deleting it from the current revision is not sufficient.
- Treat AI-provider errors and generated output as untrusted input. Do not render untrusted HTML without sanitization.

## Data and privacy
Do not submit confidential presentations, personal data, health information or employer-restricted material unless the deployment, provider terms, retention and lawful basis have been reviewed. Exported PPTX/PDF/JSON/Markdown files may contain all content placed in the presentation; review them before sharing.

## Reporting
Do not publish exploit details or secrets in public issues. Use GitHub private vulnerability reporting if enabled; otherwise contact the maintainer privately. Include the affected commit, reproduction steps and impact without real personal data.

## Limitations
This policy does not certify the application as production-secure. CI and static checks cover only the paths they exercise.