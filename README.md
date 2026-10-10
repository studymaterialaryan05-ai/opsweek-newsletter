# OpsWeek: The Business Operations Brief

An AI-assisted weekly newsletter that connects Indian and international business news to Operations Management concepts for first-year MBA students.

## What it will do

- Collect operations-related news from configured sources.
- Summarize stories and explain the relevant management concepts.
- Generate a four-page A4 newsletter in HTML and PDF.
- Archive editions on a website.
- Email the edition to a configured mailing list every Monday at 08:00 IST.
- Run through GitHub Actions without a local coding environment.

## Project status

**Initial setup.** The repository structure and automation are being built. Do not treat the newsletter as live until API credentials are configured and a test edition and test email have succeeded.

## Planned technology

- HTML, CSS, and browser JavaScript for the website and newsletter presentation.
- Node.js for news processing, AI analysis, PDF generation, and email delivery.
- GitHub Actions for weekly scheduling.
- OpenAI API for editorial analysis.
- RSS feeds and optional news API for discovery.
- Resend or another configured email provider for delivery.
- GitHub Pages for the public archive.

## Required configuration

Secrets and settings will be documented as the workflow is implemented. Never commit API keys or other credentials to this repository.

## Weekly reporting window

Each Monday edition covers the previous completed Monday through Sunday. GitHub Actions uses UTC, so 08:00 India Standard Time corresponds to 02:30 UTC.

## Editorial principles

- Link every story to its source and show its publication date.
- Separate reported facts from AI interpretation.
- Never invent articles, statistics, quotations, or source URLs.
- Do not reproduce full copyrighted articles.
- Prefer a shorter, credible edition over filler.
- Verify that the final PDF has exactly four A4 pages before delivery.
