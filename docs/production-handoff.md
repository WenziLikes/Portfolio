# Production Handoff

## Purpose

This document is the practical handoff for the engineer who owns the portfolio after content, design, SEO, or infrastructure changes.

It complements `architecture.md` and `deployment.md` by focusing on how to work in the repo safely and what must be verified before release.

## Current Runtime Model

- React 18 application with React Router 6 and `BrowserRouter`
- Vite-based build output targeting `build/`
- build-time prerendering for public routes through `src/entry-server.tsx` and `scripts/prerender.mjs`
- no backend service and no authenticated user flows
- optional GA4 integration gated by user consent and `VITE_GA_MEASUREMENT_ID`

## What Is Persisted in the Browser

These behaviors are intentionally stored only in the browser:

| State | Storage key | Owner |
| --- | --- | --- |
| Theme | `theme` | `src/App.tsx` |
| Desktop sidebar collapsed state | `portfolio-sidebar-collapsed` | `src/components/sideBar/SideBar.tsx` |
| Custom project order | `vm-projects-order` and `vm-projects-order-customized` | `src/sections/projects/Projects.tsx` |
| Analytics consent | `vm-analytics-consent` | `src/App.tsx` and `src/utils/analytics.ts` |

When debugging layout or navigation reports, remember that local browser state can change the visual result.

## Engineering Workflow

### 1. Install and run locally

```bash
npm install
npm run dev
```

### 2. Validate code changes

```bash
npm test
npm run build
```

### 3. Run browser checks for release-sensitive changes

```bash
npm run test:e2e
```

### 4. Refresh docs screenshots after visual changes

```bash
npm run docs:screenshots
```

### 5. Re-export the resume PDF if resume content changed

```bash
npm run export:resume
```

## Files That Commonly Need to Change Together

| If you change | Also review |
| --- | --- |
| `src/content/site.ts` | `src/seo.ts`, `/resume`, footer, legal pages, route metadata |
| `src/content/projects.ts` | `/projects`, docs screenshots, `docs/hr-overview.md`, SEO/project copy alignment |
| `src/content/marketPages.ts` | `/canada`, `/usa`, `/europe`, `src/seo.ts`, `docs/hr-overview.md`, deployment docs |
| resume-related copy | `public/documents/viacheslav-murakhin-resume.pdf` via `npm run export:resume` |
| route structure | `src/seo.ts`, `scripts/prerender.mjs`, Playwright tests, deployment docs |
| analytics behavior | `docs/legal-and-brand.md`, `/privacy`, `.env.example`, analytics tests |
| visuals/layout | `docs/visual-gallery.md`, `docs/assets/`, mobile QA, Playwright checks |

## Release-Critical Behaviors

Do not ship without checking these:

- deep links to `/about`, `/expertise`, `/experience`, `/projects`, `/resume`, `/privacy`, and `/copyright`
- direct rendering of `/canada`, `/usa`, and `/europe`
- `/home` redirect behavior
- resume download CTA from both footer and `/resume`
- mobile menu visibility and section switching
- desktop sidebar collapse behavior
- viewport containment on homepage, project cards, footer, market pages, and resume sheets
- legal pages and analytics consent UI

## External Dependencies and Requests

The app is mostly self-contained, but production behavior still depends on:

- Google Fonts for typography
- Google Analytics when enabled
- outbound links to GitHub, LinkedIn, `mailto:`, and `tel:`
- Playwright Chromium for end-to-end tests, docs screenshots, and resume PDF export

If any of these change, review both release docs and privacy/legal docs.

## Common Failure Modes

| Symptom | Typical cause |
| --- | --- |
| Direct route fails on the host | Host is not serving generated route HTML from `build/` correctly |
| Regional page metadata is wrong | `src/content/marketPages.ts` and `src/seo.ts` changed out of sync |
| Resume PDF is stale | `npm run export:resume` was not rerun after changing resume copy |
| Docs screenshots no longer match UI | `npm run docs:screenshots` was skipped after visual changes |
| Route metadata is outdated | `src/content/site.ts`, `src/content/marketPages.ts`, or `src/seo.ts` was changed partially |
| Mobile layout regression | Only desktop checks were run before release |
| Analytics copy is wrong | `.env` behavior and `/privacy` text are out of sync |

## Handoff Checklist

Before handing this repository to another developer or releasing to production:

1. Make sure `README.md` still matches the real routes, commands, and build output.
2. Update `docs/content-model.md` if content ownership changed.
3. Update `docs/architecture.md` if runtime behavior changed.
4. Re-run tests and the production build.
5. Re-export the resume PDF if needed.
6. Refresh screenshots if the UI changed materially.
7. Review `docs/release-checklist.md` and `docs/deployment.md` before publish.
