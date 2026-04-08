# Content Model

## Purpose

This project keeps hiring, marketing, legal, SEO, resume, and regional targeting copy in structured TypeScript files so the same information can drive multiple UI surfaces without drifting.

That is one of the core engineering decisions in the repository: the portfolio is maintained like a product, not like a static page with scattered hardcoded copy.

## Source of Truth

| File | What it owns |
| --- | --- |
| `src/content/site.ts` | Identity, SEO metadata, target markets, language coverage, navigation labels, about copy, expertise copy, experience data, resume data, legal content, and base route metadata |
| `src/content/projects.ts` | Project order, descriptions, stack labels, CTA links, proof points, and responsive image metadata |
| `src/content/marketPages.ts` | Canada, USA, and Europe landing-page copy plus regional route metadata and alternate links |
| `src/utils/contact.ts` | Public email constants used to render protected `mailto:` links |

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
| `PRIVACY_CONTENT`, `COPYRIGHT_CONTENT` | Legal page copy |
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
| Footer and contact CTAs | `src/content/site.ts`, `src/content/marketPages.ts`, and `src/utils/contact.ts` |
| Resume route | `src/content/site.ts` |
| Downloadable resume PDF | `/resume` route rendered through `scripts/export-resume.mjs` |
| Legal pages | `src/content/site.ts` |
| Regional landing pages | `src/content/marketPages.ts` and `src/content/site.ts` |
| Route metadata and schema | `src/content/site.ts`, `src/content/marketPages.ts`, and `src/seo.ts` |

## Resume Delivery Surfaces

The current app exposes resume content in three aligned ways:

- the home hero `Resume` button opens the routed `/resume` page
- the footer CTA downloads `public/documents/viacheslav-murakhin-resume.pdf`
- the `/resume` toolbar also downloads the same PDF asset

When resume wording changes:

1. update `src/content/site.ts`
2. run `npm run export:resume`
3. verify the routed `/resume` page and the generated PDF still match

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
- `docs/hr-overview.md`
- `docs/visual-gallery.md`

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

Edit legal content in `src/content/site.ts` and then review:

- `/privacy`
- `/copyright`
- `docs/legal-and-brand.md`

## Content Change Checklist

Use this flow after editing content:

1. Update `src/content/site.ts`, `src/content/projects.ts`, `src/content/marketPages.ts`, or `src/utils/contact.ts`.
2. If resume wording changed, run `npm run export:resume`.
3. Run `npm test`.
4. Run `npm run build`.
5. Run `npm run test:e2e`.
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
