# OpsWeek: The Business Operations Brief

An AI-assisted weekly newsletter connecting Indian and international business news to Operations Management concepts for first-year MBA students.

## Project status

The initial website, Node.js pipeline, RSS collection, AI analysis, four-page newsletter renderer, email delivery module, tests, and GitHub Actions workflows have been added. **It is not live yet.** External credentials must be configured, and the first test run must pass before mailing-list delivery is enabled.

## What it does

- Collects operations-related stories from configured RSS sources.
- Summarizes stories and explains the relevant management concepts.
- Generates a four-page A4 newsletter in HTML and PDF.
- Archives editions in the repository.
- Is scheduled to email the edition every Monday at 08:00 India Standard Time.
- Runs through GitHub Actions without requiring a local coding environment.

## Step 1: Add GitHub Actions secrets

Open the repository, then go to **Settings → Secrets and variables → Actions → New repository secret**.

Create these secrets:

| Secret | Purpose |
|---|---|
| `OPENAI_API_KEY` | API key from your OpenAI API account. API billing is separate from a ChatGPT subscription. |
| `RESEND_API_KEY` | API key from Resend for email delivery. |
| `EMAIL_FROM` | Verified sender, such as `OpsWeek <newsletter@yourdomain.com>`. Follow the email provider's sender verification rules. |
| `EMAIL_TO` | Central mailing-list address or comma-separated approved recipients. |
| `TEST_EMAIL_TO` | Your own address for controlled test deliveries. |
| `NEWS_API_KEY` | Optional, only if a compatible authenticated news API is added. |

Never commit real API keys into source files, public issues, or documentation.

## Step 2: Add GitHub Actions variables

Go to **Settings → Secrets and variables → Actions → Variables → New repository variable**.

Recommended variables:

- `OPENAI_MODEL`: `gpt-4.1-mini`, or another model enabled for your API account.
- `PUBLIC_SITE_URL`: your GitHub Pages URL after enabling Pages.
- `RSS_FEEDS`: optional comma-separated RSS feed URLs. If blank, the built-in feed list is used.
- `TEST_EMAIL_MODE`: set to `true` only while testing delivery to your test address. Remove or set to `false` before normal distribution.

## Step 3: Configure GitHub Pages

Open **Settings → Pages** and select **GitHub Actions** as the build-and-deployment source if the option is shown. Then run the **Deploy OpsWeek website** workflow from the Actions tab.

The website is static. API keys and private mailing-list settings must never be placed in browser JavaScript.

## Step 4: Run a dry test

1. Open the **Actions** tab.
2. Select **OpsWeek Weekly Newsletter**.
3. Click **Run workflow**.
4. Keep the dry-run option enabled.
5. Start the workflow and inspect its logs and artifacts.

The dry run should collect news, analyze stories, render HTML and PDF, and validate the PDF. It must not send email.

## Step 5: Send a test email

Only after the dry run succeeds:

1. Verify the sender in Resend.
2. Set `TEST_EMAIL_TO` to your own email address.
3. Set the repository variable `TEST_EMAIL_MODE` to `true`.
4. Run **OpsWeek Weekly Newsletter** with dry-run disabled.
5. Confirm that the email and PDF arrive and the PDF has four pages.
6. Set `TEST_EMAIL_MODE` to `false` or remove it before enabling normal mailing-list delivery.

Do not enable scheduled distribution until the first test is successful and the normal recipient list is confirmed.

## Weekly schedule

The workflow uses `30 2 * * 1`, which is Monday at 02:30 UTC, equivalent to 08:00 India Standard Time. GitHub Actions may delay scheduled jobs during periods of high load, so delivery at the exact minute is not guaranteed.

Each edition covers the previous completed Monday through Sunday.

## Four-page editorial format

1. **The Operations Brief:** concise Indian and international news.
2. **Inside the Operation:** case analysis and management trade-offs.
3. **The Operations Mind Map:** one concept linked to causes, consequences, and interventions.
4. **The Lighter Side:** original illustrative cartoons, a takeaway, and a quiz.

The PDF renderer checks that the PDF has exactly four pages. If validation fails, the workflow stops before sending.

## Editorial and reliability principles

- Link each story to its source and show its publication date.
- Separate reported facts from AI interpretation.
- Never invent articles, statistics, quotations, or source URLs.
- Do not reproduce full copyrighted articles.
- Prefer a shorter credible edition over filler.
- RSS access does not guarantee full-text access to every publisher or complete coverage of all relevant news.
- Cartoon panels are original illustrative scenarios, not claims about specific companies.
- Inspect the first edition before regular distribution.

## Costs and limits

GitHub Actions and GitHub Pages have plan-dependent limits. OpenAI API usage is billed separately from ChatGPT. News APIs and email providers may impose free-tier limits, usage charges, sender verification, or recipient restrictions. Check current provider pricing before relying on a free tier.

## Troubleshooting

- **Missing API key:** check the secret name and repository scope under Settings.
- **No stories collected:** check RSS feed URLs and whether the feeds contain relevant stories in the reporting window.
- **AI/API error:** check API account access, usage limits, and model availability.
- **PDF validation failed:** inspect the workflow artifact, shorten content or adjust layout, then rerun.
- **Email rejected:** verify sender, API key, recipient settings, and provider logs.
- **Pages not published:** open Settings → Pages, choose GitHub Actions, and rerun the Pages workflow.

## Developer commands

For developers who later want to run the project locally:

```bash
npm install
npx playwright install chromium
npm test
npm start
```

The email module defaults to dry-run mode unless delivery is explicitly enabled. Do not enable live distribution until the sender and test recipient are verified.

## Repository structure

- `index.html`, `styles.css`, `app.js`: website and archive interface.
- `src/news/`: RSS collection and filtering.
- `src/ai/`: AI analysis.
- `src/newsletter/`: four-page HTML/PDF generation.
- `src/email/`: email delivery.
- `src/site/`: archive builder.
- `.github/workflows/`: weekly generation and website deployment.
- `newsletters/`: generated editions.
