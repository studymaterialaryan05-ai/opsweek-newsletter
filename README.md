# OpsWeek: The Business Operations Brief

A zero-API-cost weekly newsletter connecting Indian and international business news to Operations Management concepts for first-year MBA students using RSS feeds and transparent, template-based analysis.

## Project status

The initial website, Node.js pipeline, RSS collection, AI analysis, four-page newsletter renderer, email delivery module, tests, and GitHub Actions workflows have been added. **It is not live yet.** External credentials must be configured, and the first test run must pass before mailing-list delivery is enabled.

## What it does

- Collects operations-related stories from configured RSS sources.
- Uses RSS headlines and publisher excerpts with template-based Operations Management lenses. No paid AI API is required.
- Generates an editorial A4 newsletter in HTML and PDF, using Unsplash photographs when configured and original diagrams/cartoons as supporting visuals.
- Archives editions in the repository.
- Is scheduled to email the edition every Monday at 08:00 India Standard Time.
- Runs through GitHub Actions without requiring a local coding environment.

## Step 1: Add GitHub Actions secrets

Open the repository, then go to **Settings → Secrets and variables → Actions → New repository secret**.

Create these secrets:

| Secret | Purpose |
|---|---|
| `OPENAI_API_KEY` | Not required by the current template-based analysis engine. You may remove this secret if you want. |
| `RESEND_API_KEY` | API key from Resend for email delivery. |
| `EMAIL_FROM` | Verified sender, such as `OpsWeek <newsletter@yourdomain.com>`. Follow the email provider's sender verification rules. |
| `EMAIL_TO` | Central mailing-list address or comma-separated approved recipients. |
| `TEST_EMAIL_TO` | Your own address for controlled test deliveries. |
| `NEWS_API_KEY` | Optional, only if a compatible authenticated news API is added. |
| `UNSPLASH_ACCESS_KEY` | Optional Unsplash API access key. Enables real editorial photography in the PDF; without it, the newsletter uses original vector visuals. |

Never commit real API keys into source files, public issues, or documentation.

## Step 2: Add GitHub Actions variables

Go to **Settings → Secrets and variables → Actions → Variables → New repository variable**.

Recommended variables:

- `OPENAI_MODEL`: not required by the current template-based analysis engine.
- `PUBLIC_SITE_URL`: your GitHub Pages URL after enabling Pages.
- `RSS_FEEDS`: optional comma-separated RSS feed URLs. If blank, the built-in feed list is used.
- `TEST_EMAIL_MODE`: set to `true` only while testing delivery to your test address. Remove or set to `false` before normal distribution.

## Optional: Enable real editorial photographs with Unsplash\n\n1. Open [Unsplash Developers](https://unsplash.com/developers) and sign in.\n2. Create a new application named `OpsWeek Newsletter` and accept the API terms.\n3. Copy its Access Key. Keep the key private.\n4. In GitHub, open **Settings → Secrets and variables → Actions → New repository secret**.\n5. Name the secret `UNSPLASH_ACCESS_KEY` and paste the Access Key into the value field. Save it. Never paste the key into chat, source code, or a public issue.\n6. Run the newsletter workflow manually with **dry_run enabled**. Check the logs for `Unsplash editorial photos selected` and inspect the PDF artifact.\n\nUnsplash demo applications are limited to 50 API requests per hour. This workflow makes at most two photo-search requests per edition. It uses image URLs returned by Unsplash directly and displays photographer and Unsplash attribution. Public or commercial production use may require applying for production access. The photo integration is optional and falls back to original SVG artwork if the secret is absent or the API is unavailable. This adds no per-image AI-generation charge, though it depends on Unsplash API access and terms. See the [Unsplash API documentation](https://unsplash.com/documentation) and [API guidelines](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines).\n\n## Step 3: Configure GitHub Pages

Open **Settings → Pages** and select **GitHub Actions** as the build-and-deployment source if the option is shown. Then run the **Deploy OpsWeek website** workflow from the Actions tab.

The website is static. API keys and private mailing-list settings must never be placed in browser JavaScript.

## Step 4: Run a dry test

1. Open the **Actions** tab.
2. Select **OpsWeek Weekly Newsletter**.
3. Click **Run workflow**.
4. Keep the dry-run option enabled.
5. Start the workflow and inspect its logs and artifacts.

The dry run should collect news, apply template-based analysis, render HTML and PDF, and validate the PDF. It must not send email. The current analysis mode does not call a paid AI API.

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

The PDF renderer currently checks that the PDF has exactly four pages. The editorial design may be expanded in a future revision if real content needs more space. If validation fails, the workflow stops before sending.

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

GitHub Actions and GitHub Pages have plan-dependent limits. The current analysis pipeline does not require OpenAI API credits. GitHub Actions and GitHub Pages have plan-dependent limits; Resend/email providers may impose free-tier limits, usage charges, sender verification, or recipient restrictions. Check current provider pricing before relying on a free tier. RSS collection and template-based analysis do not guarantee complete coverage or AI-level editorial synthesis.

## Troubleshooting

- **Missing API key:** check the secret name and repository scope under Settings.
- **No stories collected:** check RSS feed URLs and whether the feeds contain relevant stories in the reporting window.
- **Analysis quality:** the zero-cost mode uses RSS metadata and templates, not a generative AI model. Verify claims against the linked publisher articles.
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
