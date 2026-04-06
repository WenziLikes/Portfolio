# Documentation Hub

This folder is the operating handbook for the portfolio project.

Use it as the single documentation entry point when maintaining content, verifying releases, refreshing screenshots, or handing the project to another developer.

## Reading Order

| Document | Use it for |
| --- | --- |
| `architecture.md` | Understand routing, app structure, persisted UI state, and runtime behavior |
| `content-model.md` | Update profile content, project data, legal copy, and resume-related surfaces safely |
| `testing.md` | Run and interpret unit, integration, end-to-end, and visual-refresh checks |
| `mobile-matrix.md` | Validate responsive behavior across mobile and tablet viewports |
| `deployment.md` | Build, host, and launch the site with correct static route handling |
| `legal-and-brand.md` | Maintain copyright, brand ownership, privacy, analytics, and third-party usage notes |
| `release-checklist.md` | Run the final launch checklist before publishing changes |
| `release-notes-template.md` | Record a release in a consistent, professional format |
| `seo-keywords.md` | Review target keyword clusters, route intent, and content SEO positioning |
| `visual-gallery.md` | Browse and regenerate current-state screenshots across desktop, mobile, and theme variants |
| `roadmap.md` | Track future improvements and product direction |

## Recommended Usage

1. Start with `architecture.md` if you are new to the codebase.
2. Use `content-model.md` before editing hiring copy, contact details, project cards, or resume copy.
3. Use `testing.md` and `mobile-matrix.md` after UI or content changes.
4. Run `npm run docs:screenshots` after meaningful visual changes so the gallery stays current.
5. Use `seo-keywords.md` before changing homepage, about, expertise, projects, or resume positioning copy.
6. Use `deployment.md` and `release-checklist.md` immediately before production release.
7. Use `release-notes-template.md` after packaging a release.
8. Use `legal-and-brand.md` before introducing new fonts, analytics, embeds, or third-party assets.

## Visual References

Current gallery assets are generated with:

```bash
npm run docs:screenshots
```

### Homepage snapshot

![Homepage hero](./assets/home-hero-desktop.png)

### Projects snapshot

![Projects section](./assets/projects-section-desktop.png)

### Mobile resume snapshot

![Resume mobile view](./assets/resume-mobile.png)

Additional screenshots:

- [Open the full visual gallery](./visual-gallery.md)

## Documentation Principles

- Documentation should describe the current code, not an older intention.
- Commands should match `package.json`, `vite.config.ts`, and `playwright.config.ts`.
- Release guidance should assume pre-rendered static route HTML with `404.html` support.
- Content documentation should point back to `src/content/` and `src/utils/contact.ts` as the source of truth.
- Visual references in `docs/assets/` should be refreshed whenever the UI changes materially.
