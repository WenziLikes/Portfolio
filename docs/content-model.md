# Content Model

## Purpose

This project keeps marketing, hiring, legal, and resume copy in structured TypeScript files so the same information can power multiple UI surfaces without diverging.

## Source of Truth

| File | What it owns |
| --- | --- |
| `src/content/site.ts` | Identity, SEO, route metadata, navigation labels, about copy, experience data, resume data, legal content, footer contact copy |
| `src/content/projects.ts` | Project card order, labels, descriptions, outbound links, stack chips, and responsive image metadata |

## `site.ts` Breakdown

| Export | Purpose |
| --- | --- |
| `SITE_META` | Site-level title, description, URL, social preview image path |
| `PROFILE` | Name, role, summary, location, direct contact details |
| `MAIN_SECTIONS` | One-page navigation model |
| `SOCIAL_LINKS` | Footer and sidebar contact destinations |
| `ABOUT_COPY`, `ABOUT_PRINCIPLES`, `ABOUT_STACK` | Homepage about section copy and capability framing |
| `EXPERIENCE_TIMELINE` | Homepage experience section |
| `RESUME_PROFILE`, `RESUME_SKILLS`, `RESUME_EXPERIENCE`, `RESUME_CERTIFICATIONS` | Resume page and exported resume content |
| Legal exports | Privacy and copyright page copy |
| Route metadata exports | Per-route SEO descriptions and titles |

## `projects.ts` Breakdown

Each project card defines:

- project identity and ordering
- eyebrow and scope labels
- marketing description
- stack chips
- CTA links
- image source, dimensions, and responsive asset metadata
- image behavior such as `fit`, `scale`, and `hoverScale`

## Editing Workflows

### Updating personal information

Edit `PROFILE` in `src/content/site.ts` when changing:

- email
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

1. Update `src/content/site.ts` or `src/content/projects.ts`.
2. If resume wording changed, run `npm run export:resume`.
3. Run `npm test`.
4. Run `npm run build`.
5. Verify the affected route or section manually.

## Why the model matters

Without centralized content, portfolio sites usually drift in three places:

- homepage copy says one thing
- resume says another
- footer or metadata still show older details

This project is structured specifically to avoid that failure mode.
