# Documentation Hub

This folder is the working handbook for the portfolio project.

Use it as the single entry point when you need to understand the product, update content, review the repository for hiring, or ship a production release safely.

## Start Here by Audience

### Recruiters and hiring managers

Start with:

1. [HR and hiring overview](./hr-overview.md)
2. [Visual gallery](./visual-gallery.md)
3. [Project README](../README.md)

Use this path when the goal is to understand the candidate profile, project evidence, regional hiring pages, and the fastest review flow through the portfolio.

### Developers and maintainers

Start with:

1. [Architecture](./architecture.md)
2. [Content model](./content-model.md)
3. [Testing](./testing.md)
4. [Production handoff](./production-handoff.md)

Use this path when the goal is to understand routing, content ownership, UI state, SEO, tests, and release-sensitive behaviors without reverse-engineering the entire app first.

### Release owners

Start with:

1. [Deployment](./deployment.md)
2. [Release checklist](./release-checklist.md)
3. [Legal and brand](./legal-and-brand.md)
4. [Changelog](../CHANGELOG.md)

Use this path when the goal is to publish or audit the site as a static production artifact.

## Document Map

| Document | Use it for |
| --- | --- |
| [Project README](../README.md) | Product overview, quick start, route map, and repository entry point |
| [HR and hiring overview](./hr-overview.md) | Candidate summary, recruiter review flow, project evidence, and GitHub-review talking points |
| [Architecture](./architecture.md) | Routing, runtime behavior, UI state, build pipeline, SEO flow, and component boundaries |
| [Content model](./content-model.md) | Source-of-truth content files, regional landing-page copy, resume ownership, and legal copy maintenance |
| [Testing](./testing.md) | Unit, SEO, end-to-end, build, resume-export, and docs-screenshot verification workflows |
| [Production handoff](./production-handoff.md) | Day-to-day engineering handoff, coupled files, persisted browser state, and common failure modes |
| [Deployment](./deployment.md) | Static hosting requirements, build output structure, route handling, and post-deploy validation |
| [Mobile matrix](./mobile-matrix.md) | Mobile viewport expectations and responsive QA checkpoints |
| [Legal and brand](./legal-and-brand.md) | Ownership stance, privacy surface, third-party requests, and licensing boundaries |
| [Release checklist](./release-checklist.md) | Final release gate before going live |
| [Release notes template](./release-notes-template.md) | Consistent release logging after shipping |
| [SEO keywords](./seo-keywords.md) | Keyword clusters, page intent, and search-facing copy guidance |
| [Visual gallery](./visual-gallery.md) | Dated repository screenshots and screenshot-refresh references |
| [Roadmap](./roadmap.md) | Future improvements and product direction |
| [Changelog](../CHANGELOG.md) | Dated repository milestones and future release history |
| [Copyright notice](../COPYRIGHT.md) | Proprietary ownership and reuse terms |
| [Security policy](../SECURITY.md) | Private vulnerability-reporting route and supported production scope |
| [Contribution guide](../.github/CONTRIBUTING.md) | Locked setup, verification gates, and contribution boundaries |

## Recommended Reading Paths

### Engineering onboarding path

1. Read [Architecture](./architecture.md).
2. Read [Content model](./content-model.md).
3. Run the commands in [Testing](./testing.md).
4. Read [Production handoff](./production-handoff.md) before touching release or deployment work.

### Content-update path

1. Read [Content model](./content-model.md).
2. Update the relevant source: [`src/content/site.ts`](../src/content/site.ts), [`src/content/flipClock.ts`](../src/content/flipClock.ts), [`src/content/projects.ts`](../src/content/projects.ts), [`src/content/marketPages.ts`](../src/content/marketPages.ts), [`src/utils/contact.ts`](../src/utils/contact.ts), or product-specific copy in [`src/pages/flipclock/FlipClockPages.tsx`](../src/pages/flipclock/FlipClockPages.tsx).
3. Run the verification flow in [Testing](./testing.md).
4. Refresh the [visual gallery](./visual-gallery.md) if the UI changed meaningfully.

### Production-release path

1. Read [Deployment](./deployment.md).
2. Work through the [release checklist](./release-checklist.md).
3. Re-check [Legal and brand](./legal-and-brand.md) if analytics, assets, embeds, or ownership assumptions changed.
4. Record the shipped change in the [changelog](../CHANGELOG.md) or with the [release notes template](./release-notes-template.md).

### Recruiter-review preparation path

1. Review [HR and hiring overview](./hr-overview.md).
2. Confirm the [project README](../README.md) still matches the actual routes and resume surfaces.
3. Refresh the [visual gallery](./visual-gallery.md) if the UI changed materially.

## Documentation Rules

- Documentation must describe the current code, not an earlier intention.
- Commands must match [`package.json`](../package.json), [`vite.config.ts`](../vite.config.ts), the Playwright configs, and scripts in [`scripts/`](../scripts/).
- Route lists must include the regional landing pages, FlipClock Display product routes, and the `/home` redirect.
- Portfolio content documentation must point to [`src/content/`](../src/content/) and [`src/utils/contact.ts`](../src/utils/contact.ts); FlipClock Display support, privacy, and terms copy must point to [`src/pages/flipclock/FlipClockPages.tsx`](../src/pages/flipclock/FlipClockPages.tsx).
- HR-facing material should stay aligned with the actual resume content, five-project list, market pages, and live routes.
- Deployment documentation should assume static hosting from `build/` with route folders and `404.html`.
- Visual references in [`docs/assets/`](./assets/) are release-support artifacts, not production-build files, and should be refreshed whenever the UI changes materially.
