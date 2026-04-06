# Viacheslav Murakhin Portfolio

Production portfolio website for Viacheslav Murakhin built with React, TypeScript, Vite, SCSS Modules, Vitest, and Playwright.

This repository contains the scrolling portfolio shell, dedicated resume and legal routes, centralized content files, release documentation, and the visual assets used to ship the site as a maintained public product.

## Overview

| Area | Details |
| --- | --- |
| Product type | Personal portfolio and hiring website |
| Primary goal | Present experience, projects, resume access, and contact paths in a polished, production-ready format |
| Runtime model | Single-page React app with `BrowserRouter`, deep-link support, and scroll-synced section routes |
| Main audiences | Recruiters, hiring managers, collaborators, and clients |
| Visual modes | Dark and light themes with persisted preference |
| Release target | Static hosting with pre-rendered routes and a custom domain |

## Highlights

- Centralized content model in `src/content/` to prevent copy drift between the homepage, footer, resume, metadata, and legal pages.
- Dark and light themes with persisted `localStorage` state, a collapsible desktop sidebar, and a mobile top bar that appears after home-page scroll begins.
- Project gallery with a featured-first layout and desktop drag-and-drop reordering persisted in `localStorage`.
- Protected email links, a routed `/resume` page, and downloadable PDF access from the footer and resume toolbar.
- Route-aware metadata, JSON-LD person data, and optional GA4 page, contact, resume, and social click tracking.
- Automated verification with Vitest and Playwright, plus a reproducible documentation screenshot workflow via `npm run docs:screenshots`.

## Visual Preview

### Homepage

![Homepage hero](./docs/assets/home-hero-desktop.png)

### Projects

![Projects section](./docs/assets/projects-section-desktop.png)

### Resume on mobile

![Resume mobile view](./docs/assets/resume-mobile.png)

More screenshots:

- [Visual gallery](./docs/visual-gallery.md)

## Technology Stack

| Layer | Tools |
| --- | --- |
| UI | React 18, React Router 6 |
| Language | TypeScript |
| Build | Vite 7 |
| Styling | SCSS Modules, global SCSS tokens |
| Unit testing | Vitest, Testing Library, happy-dom |
| End-to-end testing | Playwright |
| Static hosting support | Pre-rendered route HTML, `404.html`, sitemap, robots, manifest |

## Quick Start

### Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended

### Install

```bash
npm install
```

### Local development

```bash
npm run dev
```

Default local address:

```text
http://localhost:3000
```

### Optional Google Analytics 4 setup

1. Copy `.env.example` to `.env.local`.
2. Replace `G-XXXXXXXXXX` with your real GA4 Measurement ID.
3. Restart the Vite dev server after changing env values.

```bash
cp .env.example .env.local
```

### Production build

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

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite development server |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Type-check and generate the production bundle in `build/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:install` | Install Chromium for Playwright |
| `npm run export:resume` | Build the app and export the resume PDF to `public/documents/` |
| `npm run docs:screenshots` | Refresh the documentation gallery screenshots in `docs/assets/` |

## Repository Map

| Path | Responsibility |
| --- | --- |
| `src/content/` | Profile data, SEO, navigation labels, resume content, legal copy, and project metadata |
| `src/components/` | Shared interface building blocks such as footer, sidebar, cards, protected email links, and route metadata |
| `src/sections/` | Main one-page portfolio sections |
| `src/pages/` | Routed pages such as resume, privacy, copyright, and not found |
| `src/utils/` | Scroll helpers, analytics helpers, and protected contact constants |
| `src/constants/` | Navigation and resume asset constants |
| `src/assets/` | Local fonts and image assets used by the app |
| `public/` | Static files copied directly into the production build |
| `scripts/` | Operational scripts for PDF export and documentation screenshot refresh |
| `docs/` | Project handbook for architecture, testing, mobile QA, deployment, release operations, and visual references |

## Runtime Behavior

- The app uses `BrowserRouter`, and the production build prerenders the public routes into static HTML so direct links resolve without a catch-all SPA rewrite.
- Theme state and desktop sidebar collapse state are stored in `localStorage`.
- The home hero `Resume` button opens `/resume`; the downloadable PDF is exposed from the footer CTA and the `/resume` toolbar.
- Desktop project cards can be reordered with drag and drop, and a custom order is stored in `localStorage`.
- Email links are rendered through `src/utils/contact.ts`; there is no first-party contact form.
- GA4 page views and contact, resume, and social click events are sent only when `VITE_GA_MEASUREMENT_ID` is present.
- The main one-page sections stay mounted together and keep the URL in sync while the user scrolls.

## Release Readiness

The project includes:

- `public/robots.txt`
- `public/sitemap.xml`
- `public/manifest.json`
- `public/seo-preview.jpg`
- `public/documents/viacheslav-murakhin-resume.pdf`
- documentation screenshots in `docs/assets/`, refreshable with `npm run docs:screenshots`

## Documentation

Start with the handbook index:

- [Documentation hub](./docs/README.md)
- [Architecture](./docs/architecture.md)
- [Content model](./docs/content-model.md)
- [Testing](./docs/testing.md)
- [Mobile matrix](./docs/mobile-matrix.md)
- [Deployment](./docs/deployment.md)
- [Legal and brand](./docs/legal-and-brand.md)
- [Release checklist](./docs/release-checklist.md)
- [Release notes template](./docs/release-notes-template.md)
- [Visual gallery](./docs/visual-gallery.md)
- [Roadmap](./docs/roadmap.md)

## Ownership and License

This repository is not published under an open-source license.

Unless a specific third-party dependency states otherwise:

- original source code is all rights reserved
- original written copy is all rights reserved
- original portfolio design and presentation are all rights reserved
- custom portfolio assets remain proprietary

See [COPYRIGHT.md](./COPYRIGHT.md) for the project notice.
