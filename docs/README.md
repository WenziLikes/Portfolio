# Documentation Hub

This folder is the working handbook for the portfolio project.

Use it as the single entry point when you need to understand the product, update content, review the repository for hiring, or ship a production release safely.

## Start Here by Audience

### Recruiters and hiring managers

Start with:

1. `hr-overview.md`
2. `visual-gallery.md`
3. `../README.md`

Use this path when the goal is to understand the candidate profile, project evidence, regional hiring pages, and the fastest review flow through the portfolio.

### Developers and maintainers

Start with:

1. `architecture.md`
2. `content-model.md`
3. `testing.md`
4. `production-handoff.md`

Use this path when the goal is to understand routing, content ownership, UI state, SEO, tests, and release-sensitive behaviors without reverse-engineering the entire app first.

### Release owners

Start with:

1. `deployment.md`
2. `release-checklist.md`
3. `legal-and-brand.md`

Use this path when the goal is to publish or audit the site as a static production artifact.

## Document Map

| Document | Use it for |
| --- | --- |
| `hr-overview.md` | Candidate summary, recruiter review flow, project evidence, and GitHub-review talking points |
| `architecture.md` | Routing, runtime behavior, UI state, build pipeline, SEO flow, and component boundaries |
| `content-model.md` | Source-of-truth content files, regional landing-page copy, resume ownership, and legal copy maintenance |
| `testing.md` | Unit, SEO, end-to-end, build, resume-export, and docs-screenshot verification workflows |
| `production-handoff.md` | Day-to-day engineering handoff, coupled files, persisted browser state, and common failure modes |
| `deployment.md` | Static hosting requirements, build output structure, route handling, and post-deploy validation |
| `mobile-matrix.md` | Mobile viewport expectations and responsive QA checkpoints |
| `legal-and-brand.md` | Ownership stance, privacy surface, third-party requests, and licensing boundaries |
| `release-checklist.md` | Final release gate before going live |
| `release-notes-template.md` | Consistent release logging after shipping |
| `seo-keywords.md` | Keyword clusters, page intent, and search-facing copy guidance |
| `visual-gallery.md` | Current-state screenshots and screenshot refresh references |
| `roadmap.md` | Future improvements and product direction |

## Recommended Reading Paths

### Engineering onboarding path

1. Read `architecture.md`.
2. Read `content-model.md`.
3. Run the commands in `testing.md`.
4. Read `production-handoff.md` before touching release or deployment work.

### Content-update path

1. Read `content-model.md`.
2. Update `src/content/site.ts`, `src/content/projects.ts`, `src/content/marketPages.ts`, or `src/utils/contact.ts`.
3. Run the verification flow in `testing.md`.
4. Refresh screenshots if the UI changed meaningfully.

### Production-release path

1. Read `deployment.md`.
2. Work through `release-checklist.md`.
3. Re-check `legal-and-brand.md` if analytics, assets, embeds, or ownership assumptions changed.

### Recruiter-review preparation path

1. Review `hr-overview.md`.
2. Confirm `README.md` still matches the actual routes and resume surfaces.
3. Refresh `visual-gallery.md` references if the UI changed materially.

## Documentation Rules

- Documentation must describe the current code, not an earlier intention.
- Commands must match `package.json`, `vite.config.ts`, Playwright configs, and scripts in `scripts/`.
- Route lists must include the regional landing pages and the `/home` redirect.
- Content documentation must point back to `src/content/` and `src/utils/contact.ts` as the source of truth.
- HR-facing material should stay aligned with the actual resume content, project list, market pages, and live routes.
- Deployment documentation should assume static hosting from `build/` with route folders and `404.html`.
- Visual references in `docs/assets/` should be refreshed whenever the UI changes materially.
