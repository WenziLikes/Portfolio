# Deployment

[Back to documentation hub](./README.md)

## Current Production Path

The portfolio is deployed as a static site through the Cloudflare Pages GitHub integration.

| Item | Current contract |
| --- | --- |
| Repository | `WenziLikes/Portfolio` |
| Production branch | `main` |
| Production trigger | A push or reviewed merge to `main` through the connected GitHub integration |
| Preview trigger | Pull requests and non-production branches when preview deployments are enabled in Cloudflare |
| Deployment provider | Cloudflare Workers and Pages / Cloudflare Pages |
| Custom production domain | [viacheslavmurakhin.com](https://viacheslavmurakhin.com/) |
| Build command | `npm run build` |
| Published directory | `build` |
| Pinned build runtime | Node.js `22.12.0` from `.nvmrc` |

GitHub records a successful Cloudflare Pages status check for commit `5708b2e` on `main`: [Cloudflare Pages deployment check](https://github.com/WenziLikes/Portfolio/runs/95191276528). The Cloudflare dashboard remains the source of truth for account-side project settings, branch controls, domains, and deployment history. Account IDs and other private dashboard identifiers do not belong in this repository.

## Runtime and Installation

Supported tooling is defined in `package.json`:

- Node.js `^20.19.0 || >=22.12.0`
- npm `>=10`
- the repository default is Node.js `22.12.0`, pinned in `.nvmrc`

Start a clean release checkout with the locked dependency graph:

```bash
nvm use
npm ci
npm run test:e2e:install
```

Do not replace `npm ci` with `npm install` in CI or release instructions. `npm ci` fails when `package.json` and `package-lock.json` disagree instead of silently changing the lockfile.

## Build Model

The deployment unit is the contents of `build/`. The build command performs:

1. TypeScript type-checking
2. Vite client build
3. SSR entry build for prerendering
4. route prerendering through `scripts/prerender.mjs`
5. generation of `robots.txt`, `sitemap.xml`, `/home` redirect HTML, and `404.html`
6. copying public assets, including `_headers`, `_redirects`, and the resume PDF

```bash
npm run build
npm run test:static
```

`npm run test:static` verifies the deployable artifact rather than the source application. It checks every known direct route, route-specific metadata and prerendered HTML, the `/home` redirect document, a real HTTP 404 response using `build/404.html`, `_headers`, `_redirects`, the manifest, robots/sitemap files, the social preview, and resume-PDF consistency.

## Build-Time Environment

| Variable | Required | Behavior |
| --- | --- | --- |
| `NODE_VERSION` | Cloudflare setting recommended | Set to `22.12.0` so Pages uses the same pinned runtime as local release and GitHub Actions. |
| `VITE_GA_MEASUREMENT_ID` | No | Build-time GA4 measurement ID. When omitted or blank, GA4 is disabled. When present, the browser still loads GA4 only after stored user consent is `granted`. |

`VITE_GA_MEASUREMENT_ID` is embedded during the Vite build. Changing it requires a new deployment. Store the production value in Cloudflare Pages environment variables; do not commit a real measurement ID to `.env.example` or documentation.

The VMNorth chat embed is different from GA4. `index.html` loads `https://vmnorth.com/chat-embed.js` with `data-site-id="portfolio"` on every page, and it is not gated by the analytics-consent setting. A page load therefore makes the normal script request to VMNorth; using the chat can involve messages, session identifiers, optional attachments, and service/network logs. Any change to the embed URL, loading policy, chat data handling, retention, or deletion process must be reflected in `/privacy`, `docs/legal-and-brand.md`, architecture, and handoff documentation before deployment.

## Resume PDF Release Safety

When resume content changes, run:

```bash
npm run export:resume
npm run test:static
```

`export:resume` now:

1. builds the application
2. serves the generated `build/` with the production-like static server
3. renders `/resume` with Playwright Chromium
4. writes the PDF to `public/documents/viacheslav-murakhin-resume.pdf`
5. copies and byte-verifies that PDF at `build/documents/viacheslav-murakhin-resume.pdf`

This makes the artifact produced by the command safe to deploy. A later `npm run build` is also safe because it copies the updated PDF from `public/` into the new build.

## Expected Build Output

Known route documents include:

- `build/index.html`
- `build/about/index.html`
- `build/expertise/index.html`
- `build/experience/index.html`
- `build/projects/index.html`
- `build/resume/index.html`
- `build/privacy/index.html`
- `build/copyright/index.html`
- `build/flipclock/index.html`
- `build/flipclock/support/index.html`
- `build/flipclock/privacy/index.html`
- `build/flipclock/terms/index.html`
- `build/canada/index.html`
- `build/usa/index.html`
- `build/europe/index.html`
- `build/home/index.html`
- `build/404.html`

The artifact must also contain hashed client assets, `manifest.json`, `robots.txt`, `sitemap.xml`, `seo-preview.jpg`, `_headers`, `_redirects`, and `documents/viacheslav-murakhin-resume.pdf`.

## Cloudflare Pages Runbook

### Verify project settings

In Cloudflare **Workers & Pages → the portfolio Pages project → Settings**, verify:

1. the connected repository is `WenziLikes/Portfolio`
2. the production branch is `main`
3. the root directory is the repository root
4. the build command is `npm run build`
5. the build output directory is `build`
6. `NODE_VERSION` is `22.12.0`
7. the production `VITE_GA_MEASUREMENT_ID` is either intentionally set or intentionally absent
8. `viacheslavmurakhin.com` is attached as the production custom domain

Cloudflare documents build commands, output directories, root directories, and environment variables in its [Pages build configuration guide](https://developers.cloudflare.com/pages/configuration/build-configuration/).

### Validate before merge

Run locally:

```bash
npm ci
npm run test:e2e:install
npm test
npm run build
npm run test:static
npm run test:e2e
```

If resume copy changed, run `npm run export:resume` before the final `npm run test:static`. If visuals changed, refresh and review documentation screenshots separately with `npm run docs:screenshots`.

For a pull request or non-production branch, use the unique `pages.dev` preview URL shown by the Cloudflare Pages check when preview deployments are enabled. Preview availability is controlled in the Cloudflare dashboard, so the status check—not a guessed URL—is authoritative.

### Release and verify

1. Merge the reviewed commit to `main`.
2. Wait for both the repository CI workflow and the Cloudflare Pages status check to pass.
3. Open the deployment details from the commit check and verify the deployed commit SHA.
4. Validate the unique deployment URL first.
5. Validate the custom domain after the production deployment becomes active.

### Roll back

If the production deployment is broken:

1. Open **Workers & Pages → portfolio project → Deployments**.
2. In **All deployments**, find the last known-good successful production deployment.
3. Use its actions menu and choose **Rollback to this deployment**.
4. Confirm the custom domain serves the known-good version.
5. Revert or fix the bad commit on `main` so the repository state and deployed state converge again.

Cloudflare allows rollback to a previous successful production deployment; preview deployments are not rollback targets. See [Cloudflare Pages rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/).

## Hosting Semantics

Cloudflare must serve generated directory indexes for known routes rather than rewriting every path to root `index.html`. The four FlipClock clean-path rewrites in `_redirects` must remain HTTP `200` rewrites, the resume rule in `_headers` must preserve the attachment filename, and unknown routes must return the generated `404.html` with status `404`.

The production-like server used by Playwright (`scripts/serve-build.mjs`) implements those semantics locally so E2E tests exercise the deployable artifact instead of the Vite development server.

## Post-Deploy Validation

After every production release:

1. open `/`, `/about`, `/expertise`, `/experience`, `/projects`, and `/resume` directly
2. open `/privacy` and `/copyright` directly
3. open `/flipclock`, `/flipclock/support`, `/flipclock/privacy`, and `/flipclock/terms` directly
4. open `/canada`, `/usa`, and `/europe` directly
5. verify `/home` moves visitors to `/`
6. verify an unknown URL returns the not-found page with HTTP `404`
7. verify the resume response has the expected filename and current PDF content
8. verify normal browsers download the PDF; in an installed iOS web app, verify **Save PDF** opens the system Share/Save sheet and the unsupported-share fallback opens the PDF in a separate view
9. verify favicon, manifest, social preview, canonical links, and sitemap
10. verify the VMNorth chat loads and that its privacy description remains accurate
11. if GA4 is configured, grant consent on a test device and verify the visit in GA4 Realtime; also confirm no GA request occurs before consent
