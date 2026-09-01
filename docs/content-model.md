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
| [`src/content/projects.ts`](../src/content/projects.ts) | Project order, descriptions, stack labels, CTA links, proof points, and responsive image metadata |
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
| `RESUME_PROFILE`, `RESUME_SKILLS`, `RESUME_EXPERIENCE`, `RESUME_CERTIFICATIONS`, `RESUME_ADDITIONAL_INFO` | Resume route and exported PDF content |
| `PRIVACY_CONTENT`, `COPYRIGHT_CONTENT` | Portfolio website `/privacy` and `/copyright` copy; these exports do not own the FlipClock Display legal routes |
| `ROUTE_META` | Per-route titles, descriptions, robots overrides, and canonical path mapping |

## `projects.ts` Breakdown

Each project entry can define:

- project identity and ordering
- eyebrow and scope labels
- summary and featured summary text
- stack chips
- CTA links
- proof points
- image sources and responsive asset metadata
- image presentation behavior such as fit, scale, frame inset, and hover scale

The resolved project order is also used by the projects section when desktop drag-and-drop persistence is restored from local storage.

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
| Resume route | `src/content/site.ts` |
| Downloadable resume PDF | `/resume` route rendered through `scripts/export-resume.mjs` |
| Portfolio `/privacy` and `/copyright` pages | `src/content/site.ts` |
| FlipClock `/support`, `/privacy`, and `/terms` pages | `src/pages/flipclock/FlipClockPages.tsx`; canonical product metadata remains in `src/content/flipClock.ts` |
| Regional landing pages | `src/content/marketPages.ts` and `src/content/site.ts` |
| Route metadata and schema | `src/content/site.ts`, `src/content/marketPages.ts`, and `src/seo.ts` |

## Resume Delivery Surfaces

The current app exposes resume content in three aligned ways:

- the home hero `Resume` button opens the routed `/resume` page
- the footer CTA delivers `public/documents/viacheslav-murakhin-resume.pdf`
- the `/resume` toolbar delivers the same PDF asset

Delivery depends on the browsing context:

- In a standard desktop browser, the PDF CTA uses the normal browser download flow.
- In an installed iOS web app, the CTA prepares the PDF and uses the system Share/Save sheet when file sharing is supported.
- If the installed-app share preparation or capability check fails, the fallback opens the PDF in a separate browser view so it can still be saved manually.

When resume wording changes:

1. Update `src/content/site.ts`.
2. Run `npm run export:resume` to regenerate `public/documents/viacheslav-murakhin-resume.pdf`.
3. Run the final `npm run build` after the export to recreate the complete artifact from the updated public PDF. The export command also synchronizes and verifies the current `build/documents/` copy immediately.
4. Verify the routed `/resume` page, the public PDF, and the built PDF still match.
5. Check both a standard browser download and the installed iOS Share/Save path when resume delivery code changes.

## Editing Workflows

### Updating personal information

Edit `src/utils/contact.ts` when changing:

- email

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

- order
- titles
- descriptions
- proof points
- stack labels
- action links
- preview asset references

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
2. If resume wording changed, run `npm run export:resume`.
3. Run `npm test`.
4. Run the final `npm run build` after `npm run export:resume` to recreate the complete artifact from the updated public PDF; the export command itself also synchronizes and byte-verifies both PDF copies.
5. On a clean environment, run `npm run test:e2e:install` once, then run `npm run test:e2e`.
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
