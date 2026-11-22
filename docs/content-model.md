# Content Model

[← Back to documentation hub](./README.md)

## Purpose

This project keeps most hiring, marketing, portfolio legal, SEO, resume, and regional targeting copy in structured TypeScript files so the same information can drive multiple UI surfaces without drifting. FlipClock Display's support, privacy, and terms copy is intentionally colocated with its routed product pages.

That is one of the core engineering decisions in the repository: the portfolio is maintained like a product, not like a static page with scattered hardcoded copy.

## Source of Truth

| File | What it owns |
| --- | --- |
| [`src/content/site.ts`](../src/content/site.ts) | Identity, SEO metadata, target markets, language coverage, navigation labels, about copy, expertise copy, experience data, resume data, portfolio `/privacy` and `/copyright` copy, and base route metadata |
| [`src/content/flipClock.ts`](../src/content/flipClock.ts) | Canonical FlipClock Display product name, App Store URL, release metadata, and product route |
| [`src/content/projects.ts`](../src/content/projects.ts) | Project identities, descriptions, stack labels, CTA links, proof points, and responsive image metadata |
| [`src/sections/projects/Projects.tsx`](../src/sections/projects/Projects.tsx) | Default display order and browser-local custom ordering |
| [`src/content/marketPages.ts`](../src/content/marketPages.ts) | Canada, USA, and Europe landing-page copy plus regional route metadata and alternate links |
| [`src/utils/contact.ts`](../src/utils/contact.ts) | Public email constants used to render protected `mailto:` links |
| [`src/pages/flipclock/FlipClockPages.tsx`](../src/pages/flipclock/FlipClockPages.tsx) | FlipClock Display overview, support, privacy, and terms page copy; product-specific support/privacy/legal addresses; and the policy last-updated date |

## `site.ts` Breakdown

| Export group | Purpose |
| --- | --- |
| `SITE_META` | Site-level title, canonical URL, social preview image, and language |
| `TARGET_MARKETS*`, `PROFESSIONAL_LANGUAGE*`, `DEFAULT_SITE_KEYWORDS` | SEO and professional-positioning inputs shared with `src/seo.ts` |
| `PROFILE` | Name, role, summary, location, phone, availability, and identity copy |
| `MAIN_SECTIONS` | Main one-page navigation model |
| `EXTERNAL_NAV_LINKS` | External brand or studio links used from the homepage shell |
| `SOCIAL_LINKS` | Shared GitHub, LinkedIn, phone, and email-facing link metadata |
| `ABOUT_COPY`, `ABOUT_PRINCIPLES`, `ABOUT_STACK` | About section narrative and capability framing |
| `EXPERTISE_COPY`, `EXPERTISE_ITEMS`, `EXPERTISE_SIGNALS` | Expertise section messaging and SEO-aligned proof areas |
| `EXPERIENCE_TIMELINE` | Homepage experience section |
| `RESUME_PROFILE`, `RESUME_SKILLS`, `RESUME_EXPERIENCE`, `RESUME_CERTIFICATIONS`, `RESUME_ADDITIONAL_INFO` | Resume copy and the source for the PDF export. Education is defined in [the resume component](../src/pages/resume/Resume.tsx). |
| `PRIVACY_CONTENT`, `COPYRIGHT_CONTENT` | Portfolio website `/privacy` and `/copyright` copy; these exports do not own the FlipClock Display legal routes |
| `ROUTE_META` | Per-route titles, descriptions, robots overrides, and canonical path mapping |

## `projects.ts` Breakdown

Each project entry can define:

- project identity and stable ID
- eyebrow and scope labels
- summary and featured summary text
- stack chips
- CTA links
- proof points
- image sources and responsive asset metadata
- image presentation behavior such as fit, scale, frame inset, and hover scale

The projects section uses `DEFAULT_PROJECT_IDS` for the initial display order. It restores a custom browser-local order by project ID and appends any new projects that are missing from the saved order.

## `marketPages.ts` Breakdown

Each regional entry owns:

- market identity (`canada`, `usa`, `europe`)
- route path
- hero title, lead, and pill signals
- page-summary copy
- section paragraphs and bullet lists
- homepage and projects teasers used by other UI surfaces
- alternate links for `hreflang`
- market-specific SEO metadata

This keeps regional positioning in one place instead of scattering it across homepage sections, footer CTAs, and SEO helpers.

## How Content Flows Through the App

| Surface | Main source |
| --- | --- |
| Homepage sections | `src/content/site.ts` and `src/content/projects.ts` |
| FlipClock Display project, product page, resume link, and software schema | `src/content/flipClock.ts`, `src/content/projects.ts`, `src/content/site.ts`, `src/pages/flipclock/FlipClockPages.tsx`, and `src/seo.ts` |
| Footer and contact CTAs | `src/content/site.ts`, `src/content/marketPages.ts`, and `src/utils/contact.ts` |
| Resume route | `src/content/site.ts`, `src/pages/resume/Resume.tsx`, and `src/utils/contact.ts` |
| Downloadable resume PDF | `/resume` route rendered through `scripts/export-resume.mjs` |
| Portfolio `/privacy` and `/copyright` pages | `src/content/site.ts` |
| `/flipclock/support`, `/flipclock/privacy`, and `/flipclock/terms` | `src/pages/flipclock/FlipClockPages.tsx`; canonical product metadata remains in `src/content/flipClock.ts` |
| Regional landing pages | `src/content/marketPages.ts` and `src/content/site.ts` |
| Route metadata and schema | `src/content/site.ts`, `src/content/marketPages.ts`, and `src/seo.ts` |

## Resume Delivery Surfaces

The current app uses one public PDF:

- the home hero `Resume` button opens the routed `/resume` page
- the footer CTA delivers `public/documents/viacheslav-murakhin-resume.pdf`
- the `/resume` toolbar delivers the same PDF asset
- regional pages link to `/resume` and also offer a direct PDF download

The footer and resume toolbar use the shared [download component](../src/components/resumeDownloadLink/ResumeDownloadLink.tsx). Its standard download, standalone Share/Save, and fallback behavior are described in the [production handoff](./production-handoff.md#resume-download-and-ios-behavior). Regional-page buttons use a regular download link in all contexts.

Recruiter-specific PDF variants belong outside `public/`. The exporter regenerates only the website's general resume.

When resume wording changes:

1. Update the relevant resume source. Edit `src/pages/resume/Resume.tsx` for education.
2. Run `npm run export:resume` to regenerate `public/documents/viacheslav-murakhin-resume.pdf`.
3. Run the final `npm run build` after the export to recreate the complete artifact from the updated public PDF. The export command also synchronizes and verifies the current `build/documents/` copy immediately.
4. Verify the routed `/resume` page, the public PDF, and the built PDF still match.
5. Check both a standard browser download and the installed iOS Share/Save path when resume delivery code changes.

## Editing Workflows

### Updating personal information

Edit `src/utils/contact.ts` for the shared email address. Review the displayed email text in `src/pages/market/MarketLandingPage.tsx` and the static fallback in `index.html` as well. FlipClock product contacts are maintained in its page component.

Edit `PROFILE` in `src/content/site.ts` when changing:

- phone
- location
- role
- summary
- availability

### Updating SEO positioning

Edit `src/content/site.ts` when changing:

- target markets
- supported professional languages
- default keyword clusters
- route-level descriptions and titles for the core site

Edit `src/content/marketPages.ts` when changing:

- regional hiring positioning
- market-specific headlines or claims
- `hreflang` alternates
- regional titles, descriptions, and keywords

Then review:

- `src/seo.ts`
- the affected route
- `docs/seo-keywords.md`

### Updating homepage or resume narrative

Edit the relevant exports in `src/content/site.ts`.

Always cross-check:

- homepage sections
- footer copy
- routed `/resume`
- the generated PDF if resume content changed
- route metadata when positioning changes materially

### Updating project cards

Edit `src/content/projects.ts` when changing:

- titles
- descriptions
- proof points
- stack labels
- action links
- preview asset references

Edit `DEFAULT_PROJECT_IDS` in `src/sections/projects/Projects.tsx` to change the default display order. Verify with fresh browser storage and with a saved custom order.

Then review:

- `/projects`
- the linked product route and external destination
- `docs/hr-overview.md`
- `docs/visual-gallery.md`

### Updating FlipClock Display release metadata

Edit `src/content/flipClock.ts` when the App Store URL, version, minimum macOS version, or release metadata changes.

Then review:

- the FlipClock Display card on `/projects`
- `/flipclock` and its App Store CTAs
- the FlipClock entry on `/resume` and the regenerated PDF
- `src/seo.ts` software application structured data
- `docs/hr-overview.md`

### Updating regional landing pages

Edit `src/content/marketPages.ts` when changing:

- Canada, USA, or Europe market copy
- regional hero pills
- CTA summary or proof sections
- cross-link wording between regional pages

Then review:

- `/canada`
- `/usa`
- `/europe`
- `src/seo.ts`
- `docs/hr-overview.md`

### Updating legal or privacy copy

For the portfolio website, edit `PRIVACY_CONTENT` or `COPYRIGHT_CONTENT` in `src/content/site.ts`, then review:

- `/privacy`
- `/copyright`
- `docs/legal-and-brand.md`

For FlipClock Display, edit the product-specific support, privacy, terms, email addresses, and `LAST_UPDATED` value in `src/pages/flipclock/FlipClockPages.tsx`, then review:

- `/flipclock/support`
- `/flipclock/privacy`
- `/flipclock/terms`
- `src/content/flipClock.ts` if the product version, release date, App Store link, or other canonical metadata also changed
- `docs/legal-and-brand.md`

## Content Change Checklist

Use this flow after editing content:

1. Update `src/content/site.ts`, `src/content/flipClock.ts`, `src/content/projects.ts`, `src/content/marketPages.ts`, `src/utils/contact.ts`, or `src/pages/flipclock/FlipClockPages.tsx`.
2. Install Chromium on a clean environment with `npm run test:e2e:install`. If resume wording changed, run `npm run export:resume`.
3. Run `npm test`.
4. Run `npm run build` to create the final artifact from the public assets. If the resume was regenerated, the build copies the updated PDF.
5. Run `npm run test:static` and `PLAYWRIGHT_SKIP_BUILD=1 npm run test:e2e`.
6. Run `npm run docs:screenshots` if the visual presentation changed enough to affect documentation screenshots.
7. Verify the affected route or section manually.

## Why This Model Matters

Without centralized content, portfolio sites commonly drift in these places:

- homepage copy says one thing
- resume says another
- regional pages introduce inconsistent claims
- metadata still reflects older positioning
- legal or footer text stays stale

This repository is intentionally structured to avoid that failure mode.
