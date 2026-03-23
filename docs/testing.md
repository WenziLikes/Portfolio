# Testing

## Testing Strategy

The project uses a layered verification approach:

| Layer | Tooling | Purpose |
| --- | --- | --- |
| Unit and integration | Vitest, Testing Library, happy-dom | Validate route rendering, stateful UI logic, protected contact helpers, and project-order behavior |
| End-to-end | Playwright | Validate navigation, legal routes, deep links, viewport behavior, and mobile interactions in a browser |
| Release build | TypeScript + Vite | Validate type safety and production bundling |
| Visual documentation | Playwright screenshot flow | Refresh `docs/assets/` so the documentation matches the live UI |

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npx playwright test` | Run Playwright directly |
| `npm run test:e2e` | Run Playwright through `package.json` |
| `npm run test:e2e:install` | Install Chromium for Playwright |
| `npm run build` | Type-check and generate the production bundle |
| `npm run docs:screenshots` | Refresh documentation screenshots in `docs/assets/` |

## What Unit Tests Cover

Current unit and integration coverage focuses on:

- route rendering for the portfolio shell, resume, privacy, and not-found routes
- protected email constants and `mailto:` generation
- desktop sidebar collapse state persistence
- project ordering defaults and local restoration
- drag-and-drop affordances and keyboard reordering logic
- compact mobile project-card presentation

Vitest runs in:

- `happy-dom`
- with Testing Library matchers loaded from `src/setupTests.ts`

## What End-to-End Tests Cover

Current Playwright coverage includes:

- home-to-resume navigation and PDF download metadata
- direct deep links and not-found route behavior
- privacy and copyright routes
- mobile home header visibility after scroll begins
- mobile menu section switching and active-state persistence
- mobile viewport containment for home and projects
- home hero primary actions remaining inside modern-phone first viewports
- desktop viewport containment for main sections, footer, and resume sheets

## Playwright Environment

The Playwright configuration uses:

- local web server boot from `npm run dev -- --host 127.0.0.1 --port 4181 --strictPort`
- desktop Chromium plus dedicated `phone-*` and `tablet-768` projects
- first-retry traces
- a fresh local server per run (`reuseExistingServer: false`)

## Resume Export Dependency

`npm run export:resume` depends on Playwright Chromium because the PDF is rendered from the live `/resume` route.

If Chromium is missing:

```bash
npm run test:e2e:install
```

## Documentation Screenshot Refresh

`npm run docs:screenshots` also uses Playwright and should be run after meaningful UI changes so `docs/assets/` remains aligned with the live product.

## Recommended Verification Flow

For normal development:

1. run `npm test`
2. run `npm run build`

For pre-release verification:

1. run `npm test`
2. run `npm run build`
3. run `npx playwright test`
4. run `npm run docs:screenshots` if visuals changed
5. manually review the main routes in a browser

## Failure Interpretation

| Failure type | Usual meaning |
| --- | --- |
| Vitest failure | route rendering, local state logic, or DOM behavior regression |
| Build failure | TypeScript issue, import breakage, or bundling problem |
| Playwright failure | route, layout, navigation, or viewport interaction regression |
| Screenshot-refresh failure | documentation assets are stale or the app cannot reach the expected visual state |

When in doubt, treat Playwright failures as release blockers because they represent user-visible behavior.
