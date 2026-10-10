# OpsWeek Visual Studio

This is a standalone design layer. It consumes editorial data but does not collect news, rewrite reporting, send email, or control the publication schedule.

## Modules

- `art-direction.js`: visual tokens and publication principles.
- `layout-engine.js`: four-page editorial layout plan and guard.
- `visual-assets.js`: original, self-contained SVG process flow, concept map, and three cartoon scenes.
- `unsplash.js`: optional photo research, URL validation, and required photographer attribution.
- `../newsletter/render.js`: combines editorial data and design components into the HTML edition and A4 PDF.

## Operating model

The engine combines original SVG diagrams and CSS templates with optional real editorial photography from the Unsplash API. Add the `UNSPLASH_ACCESS_KEY` GitHub Actions secret to enable photographs. Without it, the newsletter remains functional and uses its original vector visuals. Unsplash images are hotlinked from the URLs returned by its API and photographer/Unsplash attribution is displayed with referral links. The API is free to start in demo mode, with a documented limit of 50 API requests per hour; production use may require approval.

The photo provider is isolated from news collection, analysis, and email delivery. No generated-image API is used, so no per-image generation charge is introduced.

## Quality gate

The layout engine requires exactly four ordered page slots. The existing PDF generation step additionally checks that the rendered PDF contains exactly four pages. The workflow should remain in dry-run mode until the edition has been reviewed and delivery credentials are verified.
