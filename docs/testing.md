# Testing

## Testing Strategy

The project uses a layered testing approach:

| Layer | Tooling | Purpose |
| --- | --- | --- |
| Unit and integration | Vitest, Testing Library, JSDOM | Validate component behavior, route rendering, and UI logic |
| End-to-end | Playwright | Validate navigation, legal routes, deep links, and mobile interactions in a browser |
| Release build | TypeScript + Vite | Validate type safety and production bundling |

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npx playwright test` | Run Playwright directly |
| `npm run test:e2e` | Run Playwright through `package.json` |
| `npm run test:e2e:install` | Install Chromium for Playwright |
| `npm run build` | Type-check and generate the production bundle |

## What Unit Tests Cover

Current unit and integration coverage focuses on:

- route rendering
- resume route presence
- not found handling
- project area behaviors covered by `Projects.test.tsx`

Vitest runs in:

- `jsdom`
- with Testing Library matchers loaded from `src/setupTests.ts`

## What End-to-End Tests Cover

Current Playwright coverage includes:

- home and resume routes
- direct deep links
- not found route behavior
- privacy and copyright routes
- compact header appearance after scrolling
- mobile menu section switching and active state persistence

## Playwright Environment

The Playwright configuration uses:

- local web server boot from `npm run dev -- --host 127.0.0.1 --port 4173`
- desktop Chromium
- multiple mobile-sized Chromium projects
- first-retry traces

## Resume Export Dependency

`npm run export:resume` also depends on Playwright Chromium because the PDF is rendered from the live `/resume` route.

If Chromium is missing:

```bash
npm run test:e2e:install
```

## Recommended Verification Flow

For normal development:

1. run `npm test`
2. run `npm run build`

For pre-release verification:

1. run `npm test`
2. run `npm run build`
3. run `npx playwright test`
4. manually review the main live routes in a browser

## Failure Interpretation

| Failure type | Usual meaning |
| --- | --- |
| Vitest failure | component behavior, route rendering, or DOM logic regression |
| Build failure | TypeScript issue, import breakage, or bundling problem |
| Playwright failure | route, navigation, viewport, or runtime interaction regression |

When in doubt, treat Playwright failures as release blockers because they represent user-visible behavior.
