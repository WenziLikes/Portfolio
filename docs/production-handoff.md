# Production Handoff

[Back to documentation hub](./README.md)

## Purpose

This is the practical handoff for the engineer maintaining the portfolio after content, design, SEO, privacy, or infrastructure changes. Read it with `architecture.md`, `content-model.md`, `testing.md`, and `deployment.md` before a release.

## Current Runtime Model

- React 18 application with React Router 6 and `BrowserRouter`
- Vite client output in `build/`
- build-time prerendering through `src/entry-server.tsx` and `scripts/prerender.mjs`
- no application backend implemented in this repository and no portfolio account system
- external VMNorth chat backend loaded on every route through `https://vmnorth.com/chat-embed.js`
- optional GA4 integration compiled from `VITE_GA_MEASUREMENT_ID` and activated only after user consent
- Cloudflare Pages deployment through the GitHub integration, with `main` as the production branch contract

Do not summarize production as simply “backend-free.” The portfolio bundle is static, but the eager VMNorth chat iframe connects to an external service that owns chat sessions, messages, attachments, presence, and related persistence.

## Browser and External State

Portfolio-owned browser state:

| State | Storage key | Owner |
| --- | --- | --- |
| Theme | `theme` | `src/App.tsx` |
| Desktop sidebar state | `portfolio-sidebar-collapsed` | `src/components/sideBar/SideBar.tsx` |
| Custom project order | `vm-projects-order` and `vm-projects-order-customized` | `src/sections/projects/Projects.tsx` |
| Analytics consent | `vm-analytics-consent` | `src/App.tsx` and `src/utils/analytics.ts` |

The VMNorth widget also stores a chat session credential in browser storage so it can restore a conversation. That state is owned by the external embed rather than this React codebase. Resetting the widget or clearing browser storage removes local restore capability; it does not delete server-side conversation data.

When reproducing a layout, navigation, consent, or chat report, state which local storage was preserved or cleared.

## Engineering Workflow

Use the pinned runtime and lockfile:

```bash
nvm use
npm ci
npm run test:e2e:install
```

Run the application locally:

```bash
npm run dev
```

Validate ordinary changes:

```bash
npm test
npm run build
npm run test:static
```

Validate release-sensitive behavior against the production artifact:

```bash
npm run test:e2e
```

`test:e2e` builds and serves `build/`; it does not test through the Vite development server. The static server resolves route folders and returns the generated `404.html` with an actual `404` status.

After a visual change:

```bash
npm run docs:screenshots
```

After resume-content changes:

```bash
npm run export:resume
npm run build
npm run test:static
```

`export:resume` already synchronizes the generated PDF into the current `build/`; the final build recreates the full artifact from the updated public PDF and makes the release order explicit.

## Files That Commonly Change Together

| Change | Also review |
| --- | --- |
| `src/content/site.ts` | `src/seo.ts`, `/resume`, footer, privacy/copyright pages, route metadata |
| `src/content/flipClock.ts` | project card, `/flipclock`, `/resume`, `src/seo.ts`, App Store links, release docs |
| `src/pages/flipclock/FlipClockPages.tsx` | FlipClock support/privacy/terms copy, support/privacy email values, product-specific legal tests |
| `src/content/projects.ts` | `/projects`, screenshots, `docs/hr-overview.md`, outbound repository links, structured project data |
| Default project order | `DEFAULT_PROJECT_IDS` in `src/sections/projects/Projects.tsx`, the HR overview, and ordering tests |
| `src/content/marketPages.ts` | `/canada`, `/usa`, `/europe`, `src/seo.ts`, HR and deployment docs |
| resume copy | `/resume` and `public/documents/viacheslav-murakhin-resume.pdf` via `npm run export:resume` |
| route structure | `src/seo.ts`, `scripts/prerender.mjs`, static smoke, Playwright, deployment docs |
| GA4 behavior or ID | `.env.example`, `/privacy`, analytics tests, legal and deployment docs |
| VMNorth embed or chat data flow | `index.html`, launcher styles in `src/index.scss`, `e2e/chat.spec.ts`, `/privacy`, and the integration notes in [Architecture](./architecture.md#external-chat-boundary) |
| resume download/share component | standard download, installed iOS Share/Save, fallback, unit/E2E tests, release docs |
| visuals/layout | visual gallery, `docs/assets/`, mobile matrix, Playwright viewport checks |
| Cloudflare configuration | `_headers`, `_redirects`, static smoke, deployment runbook, release checklist |

## Resume Download and iOS Behavior

The toolbar and footer use `ResumeDownloadLink`:

1. Normal browser: the link downloads `/documents/viacheslav-murakhin-resume.pdf` as `Viacheslav-Murakhin-Resume.pdf`.
2. Standalone app with Web Share: the link shows **Preparing PDF…** while it fetches the file. When ready, **Save PDF** in the toolbar or **Save Resume PDF** in the footer opens the system share sheet with the file.
3. Standalone app without `navigator.share`: the link keeps normal download behavior.
4. If the fetch or file capability check fails, the fallback link targets a separate view. A failed share also switches to this fallback for the next tap. Cancelling the share sheet keeps the share action available.

The regional-page PDF buttons use regular download links. Their shared footers still offer the standalone share flow on supported devices.

The production `_headers` rule supplies the attachment filename for direct PDF responses. Check both the component behavior and that response header before release.

## Analytics and Chat Boundaries

`VITE_GA_MEASUREMENT_ID` is a build-time variable. A blank value removes GA4 behavior from that build; a configured value still requires `vm-analytics-consent=granted` before the Google script loads.

The VMNorth embed is not controlled by that choice. On every route, the browser requests the VMNorth script and iframe, exposing ordinary network metadata such as IP address, user agent, request time, origin/referrer, and diagnostic/security logs. When a visitor starts or restores a conversation, the service can process name, email, source site, locale, session credentials, messages, timestamps, typing/read state, and optional attachment metadata/content.

Current documentation records PostgreSQL storage for sessions/messages, separate S3/R2-compatible object storage for attachment bytes, and email delivery for replies or follow-up links. It does not promise one fixed retention period. Access, correction, and deletion requests go to `privacy@vmnorth.com`; resetting local widget state is not a server-side deletion request.

The general Playwright tests, screenshot capture, and resume export block the external script. The dedicated launcher regression stubs the script and iframe. On the live site, hover over the closed launcher with a mouse and check that the label becomes visible. Open the panel and verify normal sizing. On a touch device, check that the launcher remains compact and tappable.

## Release-Critical Behaviors

Do not ship without checking:

- every known direct route returns its own prerendered document
- `/home` retains its generated redirect document
- an unknown route returns the generated page with HTTP `404`
- indexable and noindex routes have the intended robots metadata
- FlipClock project/product links and structured data use the canonical App Store URL and current product version
- resume file in `public/` and `build/` is current and identical
- normal download, installed iOS Share/Save, and fallback behavior remain usable
- mobile menu, desktop sidebar, project ordering, and viewport containment
- GA4 remains off before consent and uses the intended property after consent
- VMNorth chat loads, can start/restore a session, and matches the current privacy notice
- Cloudflare Pages and repository CI checks pass for the released commit

## External Dependencies

| Dependency | Role | Failure effect |
| --- | --- | --- |
| Cloudflare Pages | Static hosting, custom domain, `_headers`, `_redirects`, deployment history | Site or route delivery fails |
| VMNorth chat | Eager support widget, iframe, sessions, messages, attachments, presence | Portfolio remains readable, but support chat can fail or degrade |
| Google Fonts | Typography resources | Browser falls back to available fonts |
| Google Analytics | Optional consent-gated analytics | Portfolio remains functional; measurement is unavailable |
| Apple App Store | FlipClock download destination | Product CTA cannot complete its intended handoff |
| GitHub, LinkedIn, email, and telephone handlers | Outbound professional/contact actions | Individual outbound action fails |
| Playwright Chromium | E2E, docs screenshots, resume export | Release verification or PDF generation cannot complete |

## Common Failure Modes

| Symptom | Likely cause or check |
| --- | --- |
| Known direct route serves homepage metadata | Host fallback or route artifact is wrong; run `npm run test:static` |
| Unknown route returns HTTP `200` | Generic SPA fallback bypassed `build/404.html` |
| Resume PDF is stale | Export was skipped, or final artifact predates the public PDF; run export, build, and static smoke |
| iOS Save PDF does nothing | Check whether the file is still preparing, the browser lacks `navigator.share`, or a failed share switched the next tap to the separate-view fallback |
| Resume downloads with the wrong filename | `public/_headers` was changed or host rules are not applied |
| GA4 loads before consent | Analytics initialization regression; block release and inspect `src/utils/analytics.ts` |
| Chat appears despite declined analytics | Expected: GA4 consent does not gate VMNorth chat |
| Desktop chat hover label is clipped | Check the iframe state message and the hover/fine-pointer launcher override in [Architecture](./architecture.md#external-chat-boundary) |
| Chat cannot restore after local reset | Expected local credential removal; server conversation may still exist |
| Docs claim no external backend | Handoff/privacy/architecture drifted from the VMNorth embed |
| Docs screenshots differ from UI | Screenshot refresh was skipped after a visual change |
| Cloudflare succeeds while repository checks fail | Hosting completed, but the commit is not release-ready; fix CI before treating it as approved |

## Handoff Checklist

Before another maintainer takes ownership or a release is published:

1. Confirm `README.md` and the documentation hub match actual routes, commands, runtime, and dependencies.
2. Confirm content ownership in `docs/content-model.md` still matches source files.
3. Confirm architecture and privacy docs describe the VMNorth boundary accurately.
4. Install locked dependencies and Chromium. Re-export the resume before the final build if its content changed.
5. Run unit tests, build, static smoke, and Playwright. Refresh screenshots for visual changes within the gallery's capture scope.
6. Check `docs/release-checklist.md` and the Cloudflare runbook in `docs/deployment.md`.
7. Record the release with `docs/release-notes-template.md`, including commit and Cloudflare deployment evidence.
