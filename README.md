# Viacheslav Murakhin Portfolio

Production portfolio website for Viacheslav Murakhin built with React, TypeScript, Vite, React Router, SCSS Modules, Vitest, and Playwright.

The repository is structured as a real product rather than a one-off landing page. It includes a scroll-synced homepage shell, dedicated resume and legal pages, regional hiring landing pages, centralized content ownership, SEO metadata, automated tests, and a repeatable static-production build.

## Who This Repository Serves

- Recruiters and hiring managers who want a clear technical profile, direct resume access, and credible project evidence.
- Developers who need a maintainable React codebase with documented content ownership, routing, SEO, and release behavior.
- Release owners who need reproducible builds, static-hosting guidance, QA checkpoints, and production handoff notes.

## Product Snapshot

| Area | Details |
| --- | --- |
| Product type | Personal portfolio and hiring website |
| Runtime model | React 18 with `BrowserRouter`, build-time prerendering, and static route HTML output |
| Primary routes | `/`, `/about`, `/expertise`, `/experience`, `/projects`, `/resume`, `/privacy`, `/copyright` |
| Regional routes | `/canada`, `/usa`, `/europe` |
| Legacy redirect | `/home` redirects to `/` |
| Content model | TypeScript source-of-truth content in `src/content/` plus protected contact constants in `src/utils/contact.ts` |
| UX behaviors | Scroll-synced section routing, desktop sidebar collapse, mobile menu, theme switching, draggable desktop project ordering |
| SEO model | Per-route metadata, prerendered HTML, sitemap, robots, structured data, and `hreflang` alternates for regional pages |
| Analytics | Optional GA4, loaded only after consent and only when `VITE_GA_MEASUREMENT_ID` is configured |
| Deployment target | Static hosting with route folders, `404.html`, manifest, sitemap, downloadable resume PDF, and regenerated docs screenshots |

## Candidate Snapshot

| Category | Summary |
| --- | --- |
| Role focus | Full Stack Developer |
| Core stack | React, TypeScript, Java, Spring Boot |
| Supporting tools | Vite, React Router, SCSS Modules, Vitest, Playwright |
| Target work style | Remote product teams, startups, and software companies across Canada, the United States, and Europe |
| Languages | English, Polish, Russian, Ukrainian |
| Resume route | `/resume` |
| PDF resume | `public/documents/viacheslav-murakhin-resume.pdf` |

## What This Repository Demonstrates

- Production-minded frontend architecture instead of a static brochure page.
- Centralized content that keeps homepage copy, resume, legal pages, footer, and SEO metadata aligned.
- Regional hiring landing pages that support Canada, USA, and Europe targeting without fragmenting the codebase.
- Static deployment readiness with prerendered route HTML, `404.html`, manifest, sitemap, and legal/privacy coverage.
- Automated verification across unit tests, route tests, SEO tests, and Playwright browser coverage.

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### Install dependencies

```bash
npm install
```

### Start local development

```bash
npm run dev
```

Default local address:

```text
http://localhost:3000
```

### Optional Google Analytics setup

1. Copy `.env.example` to `.env.local`.
2. Replace `G-XXXXXXXXXX` with the real GA4 Measurement ID.
3. Restart the dev server.

```bash
cp .env.example .env.local
```

### Build for production

```bash
npm run build
```

Output directory:

```text
build/
```

### Preview the production build

```bash
npm run preview
```

Preview address:

```text
http://localhost:4173
```

## Validation and Release Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite server |
| `npm run build` | Type-check, build the client, build the SSR entry, and prerender public routes into `build/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:install` | Install Chromium for Playwright-based flows |
| `npm run export:resume` | Rebuild the site and export the `/resume` route to `public/documents/` as PDF |
| `npm run docs:screenshots` | Refresh documentation screenshots in `docs/assets/` |

## Route Map

| Route | Role |
| --- | --- |
| `/` | Canonical portfolio landing route |
| `/about`, `/expertise`, `/experience`, `/projects` | Deep links into the one-page portfolio shell |
| `/resume` | Dedicated resume page with PDF download |
| `/privacy`, `/copyright` | Legal and production-trust pages |
| `/canada`, `/usa`, `/europe` | Regional hiring landing pages with market-specific copy and `hreflang` support |
| `/home` | Legacy route that redirects to `/` |
| `*` | Not-found route rendered through the shared page shell |

## Repository Map

| Path | Responsibility |
| --- | --- |
| `src/content/site.ts` | Identity, navigation, about copy, expertise copy, resume data, legal copy, and base route metadata |
| `src/content/projects.ts` | Project cards, proof points, stacks, actions, and responsive image metadata |
| `src/content/marketPages.ts` | Canada, USA, and Europe landing-page copy plus regional route metadata |
| `src/components/` | Shared UI such as sidebar, footer, route metadata, consent banner, protected email links, and cards |
| `src/sections/` | Homepage sections mounted inside the main scrolling portfolio shell |
| `src/pages/` | Routed pages for resume, legal content, regional landing pages, and not-found handling |
| `src/hooks/` | Shared media-query and scroll behavior hooks |
| `src/utils/` | Analytics, contact constants, scrolling helpers, and low-level helpers |
| `scripts/` | Prerendering, resume export, and docs-screenshot automation |
| `public/` | Static assets copied into the build, including icons, manifest, robots, sitemap, and PDF resume |
| `docs/` | HR-facing overview, architecture, content model, testing, deployment, release, and handoff documentation |

## Documentation Paths

### For recruiters and HR

- [Hiring overview](./docs/hr-overview.md)
- [Visual gallery](./docs/visual-gallery.md)
- [Documentation hub](./docs/README.md)

### For developers and maintainers

- [Documentation hub](./docs/README.md)
- [Architecture](./docs/architecture.md)
- [Content model](./docs/content-model.md)
- [Testing](./docs/testing.md)
- [Production handoff](./docs/production-handoff.md)

### For release owners

- [Deployment](./docs/deployment.md)
- [Release checklist](./docs/release-checklist.md)
- [Legal and brand](./docs/legal-and-brand.md)

## Recommended Review Paths

### 3-minute recruiter review

1. Open `/`.
2. Review `/projects`.
3. Open `/resume`.
4. Skim `docs/hr-overview.md`.

### Developer onboarding path

1. Read `docs/architecture.md`.
2. Read `docs/content-model.md`.
3. Run `npm test` and `npm run build`.
4. Read `docs/production-handoff.md`.

### Pre-release path

1. Read `docs/deployment.md`.
2. Run `npm test`, `npm run build`, and `npm run test:e2e`.
3. Re-export the resume if copy changed.
4. Refresh docs screenshots if the UI changed materially.
5. Walk through `docs/release-checklist.md`.

## Production Deliverables

The production build is prepared to ship with:

- prerendered HTML for all public portfolio, resume, legal, and regional routes
- `404.html` for unknown routes
- `robots.txt` and `sitemap.xml`
- canonical, Open Graph, Twitter, and JSON-LD metadata
- `hreflang` alternate links for Canada, USA, Europe, and the default landing page
- manifest and icon assets
- downloadable resume PDF
- documentation screenshots that can be regenerated from the current UI state

## Ownership and License

This repository is not published under an open-source license.

Unless a specific third-party dependency states otherwise:

- original source code is all rights reserved
- original written copy is all rights reserved
- original design and portfolio presentation are all rights reserved
- custom portfolio assets remain proprietary

See [COPYRIGHT.md](./COPYRIGHT.md) for the project notice.
