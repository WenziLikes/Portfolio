# Release Notes Template

[Back to documentation hub](./README.md)

Use this template for a production release, portfolio refresh, or significant content/infrastructure update.

## Release Identity

| Field | Value |
| --- | --- |
| Release name | |
| Release date and timezone | |
| Owner | |
| Environment | Production / Cloudflare preview / Local artifact |
| Domain or preview URL | |
| Git commit SHA | |
| Pull request | |
| GitHub CI run | |
| Cloudflare Pages check/deployment | |
| Previous known-good production deployment | |

## Summary

Describe what changed for visitors, why the release was needed, and the most important technical or operational change in two to five sentences.

## Included Changes

### Content and Projects

-

### Design and User Experience

-

### Engineering and Testing

-

### SEO and Metadata

- 

### Privacy, Legal, or External Services

- 

### Deployment and Documentation

- 

## Runtime and Build Configuration

| Item | Release value |
| --- | --- |
| Node.js | `22.12.0` / other supported version |
| npm | |
| Build command | `npm run build` |
| Output directory | `build` |
| `VITE_GA_MEASUREMENT_ID` | Configured / intentionally absent (do not record the real value) |
| VMNorth chat embed | Unchanged / changed and privacy-reviewed |
| Resume PDF | Unchanged / regenerated |
| Documentation screenshots | Unchanged / refreshed |

## Automated Verification

Record the exact commands and results:

```bash
nvm use
npm ci
npm run test:e2e:install
npm test
npm run build
npm run test:static
npm run test:e2e
```

If resume content changed:

```bash
npm run export:resume
npm run build
npm run test:static
```

If visuals changed:

```bash
npm run docs:screenshots
```

| Check | Result / evidence |
| --- | --- |
| Unit and integration tests | |
| Production build and prerender | |
| Static route/metadata/404/header smoke | |
| Playwright production E2E | |
| GitHub Markdown link check | |
| Cloudflare Pages status | |

## Manual Verification

- Direct routes checked:
- Unknown route and HTTP status:
- Desktop browsers/viewports:
- Mobile/tablet browsers/viewports:
- Standard resume download:
- Installed iOS **Save PDF** Share/Save flow:
- Unsupported-share fallback:
- VMNorth chat load/start/restore:
- GA4 before and after consent, if configured:
- External links and App Store CTA:
- Custom-domain metadata/social preview:

## Privacy and Legal Review

Answer explicitly when analytics, embeds, forms, storage, providers, retention, deletion, or legal copy changed.

| Question | Answer |
| --- | --- |
| Does this release change data sent automatically on page load? | |
| Does it change chat fields, sessions, messages, attachments, storage, retention, or deletion? | |
| Does it change GA4 configuration or consent behavior? | |
| Were `/privacy`, product privacy, legal/brand, architecture, and handoff docs updated where needed? | |
| Was private security reporting still verified? | |

## Known Risks and Follow-Ups

-

## Rollback Record

- Rollback trigger:
- Last known-good production deployment:
- Cloudflare rollback target:
- Repository revert/fix plan:
- Data or configuration steps that are not reverted by static deployment rollback:

## Final Sign-Off

| Gate | Status |
| --- | --- |
| Content reviewed | |
| Privacy/legal reviewed | |
| Locked install completed | |
| Unit tests passed | |
| Build passed | |
| Static smoke passed | |
| Playwright passed | |
| Markdown links passed | |
| Resume verified | |
| Mobile/iOS behavior verified | |
| VMNorth chat verified | |
| Metadata and direct routes verified | |
| GitHub CI passed | |
| Cloudflare deployment passed | |
| Custom domain verified | |
| Release published | |
