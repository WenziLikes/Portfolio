# Content Model

## Purpose

This project keeps marketing, hiring, legal, and resume copy in structured TypeScript files so the same information can power multiple UI surfaces without diverging.

## Source of Truth

| File | What it owns |
| --- | --- |
| `src/content/site.ts` | Identity, SEO, route metadata, navigation labels, about copy, experience data, resume data, legal content, and footer contact copy |
| `src/content/projects.ts` | Project card order, labels, descriptions, outbound links, stack chips, and responsive image metadata |
| `src/utils/contact.ts` | Public email constants used to render `mailto:` links without scattering the address across UI files |

## `site.ts` Breakdown

| Export | Purpose |
| --- | --- |
| `SITE_META` | Site-level title, description, URL, and social preview image path |
| `PROFILE` | Name, role, summary, location, phone details, and availability |
| `MAIN_SECTIONS` | One-page navigation model |
| `SOCIAL_LINKS` | Shared contact and external destinations for hero, footer, and resume surfaces |
| `ABOUT_COPY`, `ABOUT_PRINCIPLES`, `ABOUT_STACK` | Homepage about section copy and capability framing |
| `EXPERTISE_COPY`, `EXPERTISE_ITEMS`, `EXPERTISE_SIGNALS` | Homepage expertise section and content SEO cluster framing |
| `EXPERIENCE_TIMELINE` | Homepage experience section |
| `RESUME_PROFILE`, `RESUME_SKILLS`, `RESUME_EXPERIENCE`, `RESUME_CERTIFICATIONS`, `RESUME_ADDITIONAL_INFO` | Resume page and exported resume content |
| `PRIVACY_CONTENT`, `COPYRIGHT_CONTENT` | Legal page copy |
| `ROUTE_META` | Per-route titles, descriptions, and canonical path mapping |

## `projects.ts` Breakdown

Each project card defines:

- project identity and ordering
- eyebrow and scope labels
- marketing description
- stack chips
- CTA links
- image source, dimensions, and responsive asset metadata
- image behavior such as `fit`, `scale`, and `hoverScale`

The first item in the resolved project array becomes the featured desktop card. The remaining cards render in the supporting rail.

## Resume Delivery Surfaces

The current app exposes resume content in three distinct ways:

- the home hero `Resume` button opens the routed `/resume` page
- the footer primary CTA downloads `public/documents/viacheslav-murakhin-resume.pdf`
- the `/resume` toolbar also downloads the same PDF asset

When resume wording changes, update `src/content/site.ts` first and then regenerate the PDF so the downloadable document stays aligned with the rendered page.

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

### Updating homepage or resume narrative

Edit the relevant exports in `src/content/site.ts`.

Always cross-check:

- homepage sections
- footer
- resume page
- route metadata when wording changes materially

### Updating projects

Edit `src/content/projects.ts` when changing:

- project order
- titles
- descriptions
- action links
- stack labels
- project preview image sources

### Updating legal pages

Edit legal content in `src/content/site.ts` and then review:

- `/privacy`
- `/copyright`
- footer legal references

## Content Change Checklist

Use this flow after editing content:

1. Update `src/content/site.ts`, `src/content/projects.ts`, or `src/utils/contact.ts`.
2. If resume wording changed, run `npm run export:resume`.
3. Run `npm test`.
4. Run `npm run build`.
5. Run `npx playwright test` for route and interaction coverage.
6. Run `npm run docs:screenshots` if the visual presentation changed enough to affect documentation screenshots.
7. Verify the affected route or section manually.

## Why the model matters

Without centralized content, portfolio sites usually drift in three places:

- homepage copy says one thing
- resume says another
- footer, legal, or metadata still show older details

This project is structured specifically to avoid that failure mode.
