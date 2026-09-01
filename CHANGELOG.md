# Changelog

[← Back to documentation hub](./docs/README.md)

Notable portfolio changes are recorded here. The repository had no version tags as of 2026-08-31, so the dated history below records verified milestones from the `main` branch rather than inventing semantic version numbers or deployment dates.

Future releases should add an entry at the top and may use the [release notes template](./docs/release-notes-template.md) for verification and rollback detail.

## Unreleased

### Added

- Added GitHub Actions gates for Vitest, the production build, static-artifact smoke testing, Playwright, and Markdown links.
- Added a production-like static server and smoke test covering direct route artifacts, robots metadata, a real HTTP `404`, `_headers`, `_redirects`, SEO files, and resume-PDF consistency.
- Added `SECURITY.md`, private-vulnerability-reporting guidance, issue forms, a pull-request template, and contributor guidance.
- Added a pinned Node.js runtime, exact Node/npm engine requirements, a mobile homepage gallery capture, and this changelog.

### Changed

- Updated the Portfolio privacy notice and engineering documentation for the always-loaded VMNorth chat boundary, including request metadata, sessions, messages, attachments, storage, retention, deletion, and its independence from GA4 consent.
- Updated FlipClock Display to version 1.0.4 and aligned product schema, support, privacy, and terms with Apple WeatherKit and Apple geocoding in the Mac App Store build.
- Made resume export synchronize and byte-verify the PDF in both `public/documents/` and `build/documents/`.
- Moved Playwright release checks from the Vite development server to the built static artifact and documented Chromium installation before browser-based tasks.
- Documented the actual Cloudflare Pages branch, runtime, build, output, environment, preview, custom-domain, verification, and rollback contract.
- Removed the unavailable public CRM repository link while keeping the project as portfolio evidence.
- Documented standard-browser PDF download behavior, the installed iOS Share/Save flow, and its separate-view fallback.

### Documentation

- Made the documentation hub fully navigable, added return links, and clarified the source of truth for Portfolio versus FlipClock legal content.
- Aligned the HR overview with all five showcased projects and split deployable artifacts from repository-only release-support evidence.
- Refreshed the dated visual gallery, reframed GA4 as an existing consent-gated capability, and added reproducible release and handoff instructions.
- Clarified the proprietary ownership position: public visibility grants no license.

## 2026-08-16

### Changed

- Removed the mobile hero card to simplify the small-screen opening layout ([`5708b2e`](https://github.com/WenziLikes/Portfolio/commit/5708b2e)).
- Added installed-iOS-web-app resume delivery through the system Share/Save sheet, with a browser-view fallback ([`f4c4f72`](https://github.com/WenziLikes/Portfolio/commit/f4c4f72)).

### Added

- Added FlipClock Display to the portfolio, resume, product routes, metadata, and supporting documentation ([`4600ddb`](https://github.com/WenziLikes/Portfolio/commit/4600ddb)).

## 2026-08-09

### Changed

- Pointed the VM North studio shortcut to the admin workspace ([`cd2a624`](https://github.com/WenziLikes/Portfolio/commit/cd2a624)).

## 2026-08-02

### Added

- Connected the portfolio to the VM North visitor-chat experience ([`8fd088c`](https://github.com/WenziLikes/Portfolio/commit/8fd088c)).

## 2026-07-27

### Added

- Added FlipClock Display support, privacy, and terms pages ([`8e43114`](https://github.com/WenziLikes/Portfolio/commit/8e43114)).

### Changed

- Served FlipClock Display routes as direct static `200` responses and added clean-path proxy handling ([`29dd866`](https://github.com/WenziLikes/Portfolio/commit/29dd866), [`0c8b00a`](https://github.com/WenziLikes/Portfolio/commit/0c8b00a)).
- Normalized route metadata for trailing-slash requests ([`ddab487`](https://github.com/WenziLikes/Portfolio/commit/ddab487)).

## 2026-06-12

### Added

- Added VM North to the portfolio project list and resume ([`192104e`](https://github.com/WenziLikes/Portfolio/commit/192104e)).

## 2026-04-07 to 2026-04-08

### Added

- Added regional hiring pages, legal routing, and expanded SEO metadata ([`3a9990c`](https://github.com/WenziLikes/Portfolio/commit/3a9990c)).

### Changed

- Refined the sidebar, hero hierarchy, section motion, resume layout, project messaging, mobile menu, mobile sections, and mobile hero presentation ([`9427e4f`](https://github.com/WenziLikes/Portfolio/commit/9427e4f), [`3210316`](https://github.com/WenziLikes/Portfolio/commit/3210316), [`7b41cf6`](https://github.com/WenziLikes/Portfolio/commit/7b41cf6), [`7e1913f`](https://github.com/WenziLikes/Portfolio/commit/7e1913f)).
- Updated the project documentation and production handoff notes ([`7e9fab9`](https://github.com/WenziLikes/Portfolio/commit/7e9fab9)).

## 2026-04-05 to 2026-04-06

### Added

- Added prerendered routes and strengthened international search metadata ([`9f39ed7`](https://github.com/WenziLikes/Portfolio/commit/9f39ed7), [`c9bc659`](https://github.com/WenziLikes/Portfolio/commit/c9bc659)).

### Changed

- Improved analytics privacy controls and consent handling ([`a051e67`](https://github.com/WenziLikes/Portfolio/commit/a051e67)).

## 2026-04-01

### Added

- Added the repeatable documentation screenshot workflow ([`2e6fef7`](https://github.com/WenziLikes/Portfolio/commit/2e6fef7)).

### Changed

- Refined navigation, theme controls, hero positioning, and the VM Studio shortcut presentation ([`a45f616`](https://github.com/WenziLikes/Portfolio/commit/a45f616), [`c4c42b3`](https://github.com/WenziLikes/Portfolio/commit/c4c42b3), [`540e141`](https://github.com/WenziLikes/Portfolio/commit/540e141)).
