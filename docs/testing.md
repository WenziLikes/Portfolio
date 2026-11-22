# Testing

[Back to documentation hub](./README.md)

## Verification Layers

| Layer | Tooling | Purpose |
| --- | --- | --- |
| Unit and integration | Vitest, Testing Library, happy-dom | Routing, stateful UI logic, contact helpers, project ordering, resume sharing, and regional rendering |
| SEO and metadata | Vitest | Sitemap output, route metadata, structured data, robots directives, and `hreflang` alternates |
| Production artifact smoke | Node.js + production-like static server | Direct prerendered routes, HTTP 404 behavior, metadata, `_headers`, `_redirects`, manifest/SEO files, and resume consistency |
| End-to-end | Playwright Chromium | Navigation, legal/product routes, responsive behavior, deep links, resume download/share behavior, and browser hydration against `build/` |
| Release build | TypeScript + Vite + prerender script | Type safety, client bundling, SSR generation, and static route output |
| Visual documentation | Dedicated Playwright screenshot config | Refresh `docs/assets/` after intentional visual changes |

## Prerequisites

Use a supported runtime and the repository lockfile:

- Node.js `^20.19.0 || >=22.12.0`
- npm `>=10`
- repository default: Node.js `22.12.0` from `.nvmrc`

```bash
nvm use
npm ci
npm run test:e2e:install
```

Install Chromium before the first E2E, screenshot, or resume-export run. The GitHub Actions browser job runs on `ubuntu-24.04` and installs Chromium plus Linux system dependencies with `npx playwright install --with-deps chromium`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run build` | Type-check, bundle, and prerender the production artifact |
| `npm run test:static` | Verify an existing `build/` artifact and its hosting semantics |
| `npm run test:static:serve` | Serve an existing `build/` on port `4181` with production-like route and 404 behavior |
| `npm run test:e2e` | Build the app, start the production-like static server, and run Playwright |
| `npm run test:e2e:install` | Install Playwright Chromium locally |
| `npm run export:resume` | Build, render the resume PDF, and synchronize it into both `public/` and `build/` |
| `npm run docs:screenshots` | Refresh documentation screenshots in `docs/assets/` |

`npm run test:static` expects `build/` to exist. Run `npm run build` first unless `npm run export:resume` just produced and synchronized the artifact.

## Unit and Metadata Coverage

Current Vitest coverage includes:

- portfolio, resume, privacy, not-found, FlipClock, and regional route rendering
- protected email constants and `mailto:` generation
- desktop sidebar collapse-state persistence
- project ordering, restoration, drag-and-drop, and keyboard controls
- compact mobile project cards
- standard resume download plus installed-web-app Share/Save behavior
- route metadata, sitemap entries, JSON-LD, robots directives, and regional alternate links
- analytics consent safeguards

Tests run in `happy-dom` with Testing Library matchers from `src/setupTests.ts`.

## Static Production Smoke

`scripts/static-build-smoke.mjs` starts `scripts/serve-build.mjs` on an ephemeral local port and verifies the artifact exactly as a static host should expose it.

The smoke test requires:

- every known route to return HTTP `200` and its own prerendered `index.html`, not a root SPA fallback
- indexable and non-indexable routes to expose the intended robots directive
- title, description, canonical URL, Open Graph URL, valid route JSON-LD, and server-rendered root content
- `/home` to expose the generated noindex redirect document
- an unknown route to return HTTP `404` with the exact generated `build/404.html`
- the FlipClock `200` rewrite rules to match `build/_redirects`
- the resume `Content-Disposition` rule from `build/_headers` to be applied
- `manifest.json`, `robots.txt`, `sitemap.xml`, and `seo-preview.jpg` to be present and usable
- `public/documents/viacheslav-murakhin-resume.pdf` and the deployable copy in `build/documents/` to be byte-identical

This is the release check that catches host-visible mistakes that a Vite development server cannot represent.

## Playwright Production Environment

The default Playwright configuration no longer boots `vite dev`. It:

1. runs `npm run build`
2. starts `node scripts/serve-build.mjs --port 4181`
3. runs tests against `http://127.0.0.1:4181`

The server resolves route folders, applies the committed `_headers` and `_redirects` rules used by the tests, and returns `build/404.html` with status `404` for unknown paths.

Keep port 4181 free before running E2E or gallery capture. Playwright starts its own server and refuses to reuse an existing one.

Projects cover desktop Chromium, phone widths `320`, `360`, `375`, `390`, and `430`, plus tablet width `768`. CI uses one worker, retries failures twice, and saves a trace on the first retry.

If the `phone-320` project-card position check fails intermittently during a parallel run, retry with one worker to match CI concurrency. Investigate persistent failures as layout regressions.

```bash
PLAYWRIGHT_SKIP_BUILD=1 npm run test:e2e -- --project phone-320 --workers=1
```

After building and verifying the current artifact, run `PLAYWRIGHT_SKIP_BUILD=1 npm run test:e2e` to reuse it. GitHub Actions follows that sequence. Use `npm run test:e2e` by itself when you want Playwright to build first.

## End-to-End Coverage

Current browser checks include:

- home-to-resume navigation and standard PDF download metadata
- installed iOS/PWA-style behavior where **Save PDF** uses the Web Share API with the actual PDF file
- the regular download link and standalone sharing with stubbed Web Share APIs. Verify the native share sheet and fallback on physical iOS for release.
- direct deep links and hydrated not-found content. The static smoke test asserts the HTTP `404` status.
- privacy, copyright, FlipClock, and regional routes
- mobile header/menu behavior and active navigation state
- viewport containment across phone, tablet, and desktop layouts
- first-viewport hero actions on modern phones
- desktop sections, footer, projects, and resume sheets
- the VMNorth launcher state-message integration, desktop hover label, and compact touch sizing using stub responses

The E2E tests block or stub `https://vmnorth.com/chat-embed.js` to avoid live chat traffic. Release QA verifies that the live launcher and panel work and that the privacy disclosure is current.

## Resume Export Verification

`npm run export:resume` depends on Playwright Chromium. It first builds and serves `/resume`, then generates the PDF in `public/documents/`, copies it into `build/documents/`, and byte-verifies both copies.

If resume content changed, run:

```bash
npm run export:resume
npm run build
npm run test:static
```

The final build recreates the artifact from the updated public PDF.

## Recommended Flows

Normal development:

```bash
npm test
npm run build
npm run test:static
```

Clean pre-release verification:

```bash
nvm use
npm ci
npm run test:e2e:install
npm test
npm run build
npm run test:static
PLAYWRIGHT_SKIP_BUILD=1 npm run test:e2e
```

If resume content changed, insert `npm run export:resume` before the final build/static verification. If visuals changed, run `npm run docs:screenshots` and review the changed images rather than accepting them blindly.

## Continuous Integration

`.github/workflows/ci.yml` runs on pull requests, pushes to `main`, and manual dispatch:

- locked install, Vitest, production build, and static smoke
- locked install, Chromium system setup, production build, and the full Playwright matrix
- Markdown link checking via Lychee. The workflow includes relative references and HTTP links, excludes LinkedIn, and tolerates HTTP `429`. Review the destinations themselves when links change.

All three jobs are release gates. A Cloudflare Pages deployment status is not a substitute for repository CI because a host can publish a build that completed successfully while behavior or documentation checks still fail.

## Failure Interpretation

| Failure | Treat it as |
| --- | --- |
| Vitest | Route, state, metadata, analytics, or DOM regression |
| Build | TypeScript, import, bundling, or prerender failure |
| Static smoke | Missing/wrong route artifact, stale PDF, incorrect metadata/config, or broken 404 semantics |
| Playwright | User-visible navigation, interaction, layout, hydration, or resume behavior regression |
| Markdown links | Stale or broken documentation reference |
| Screenshot refresh | Stale visual docs or a state that can no longer be reached reliably |
| Resume export | Missing Chromium, failed `/resume` rendering, or PDF synchronization failure |

Resolve all three CI jobs before sign-off. See the [release checklist](./release-checklist.md) for manual gates.
