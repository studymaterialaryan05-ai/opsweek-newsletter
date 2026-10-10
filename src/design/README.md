# OpsWeek Visual Studio

This is a standalone design layer. It consumes editorial data but does not collect news, rewrite reporting, send email, or control the publication schedule.

## Modules

- `art-direction.js`: visual tokens and publication principles.
- `layout-engine.js`: four-page editorial layout plan and guard.
- `visual-assets.js`: original, self-contained SVG hero artwork, process flow, concept map, and three cartoon scenes.
- `../newsletter/render.js`: combines editorial data and design components into the HTML edition and A4 PDF.

## Operating model

The current engine uses deterministic, original SVG assets and CSS templates. It does not require an image API key or incur per-image model charges. This makes the design layer independent from editorial analysis and email delivery, and keeps the current pipeline runnable even when the OpenAI account has no credits.

A future image-generation provider can be added behind this module without changing the news collector or email sender. Any remote provider should be optional, cached, and configured separately from editorial and email secrets.

## Quality gate

The layout engine requires exactly four ordered page slots. The existing PDF generation step additionally checks that the rendered PDF contains exactly four pages. The workflow should remain in dry-run mode until the edition has been reviewed and delivery credentials are verified.
