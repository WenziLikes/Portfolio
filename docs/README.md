# Documentation Hub

This folder is the operating handbook for the portfolio project.

Use it as the single documentation entry point when maintaining content, verifying releases, or handing the project to another developer.

## Reading Order

| Document | Use it for |
| --- | --- |
| `architecture.md` | Understand routing, app structure, data flow, and runtime behavior |
| `content-model.md` | Update profile content, project data, legal copy, and SEO safely |
| `testing.md` | Run and interpret unit, integration, and end-to-end checks |
| `mobile-matrix.md` | Validate responsive behavior across mobile and tablet viewports |
| `deployment.md` | Build, host, and launch the site with correct rewrite rules |
| `legal-and-brand.md` | Maintain copyright, brand ownership, privacy, and third-party usage notes |
| `release-checklist.md` | Run the final launch checklist before publishing changes |
| `release-notes-template.md` | Record a release in a consistent, professional format |
| `visual-gallery.md` | Browse documentation screenshots across desktop, mobile, and theme variants |
| `roadmap.md` | Track future improvements and product direction |

## Recommended Usage

1. Start with `architecture.md` if you are new to the codebase.
2. Use `content-model.md` before editing hiring copy, contact details, or project cards.
3. Use `testing.md` and `mobile-matrix.md` after UI or content changes.
4. Use `deployment.md` and `release-checklist.md` immediately before production release.
5. Use `release-notes-template.md` after packaging a release.
6. Use `visual-gallery.md` when you need presentation references or current-state screenshots.
7. Use `legal-and-brand.md` before introducing third-party assets, fonts, embeds, analytics, or new policy copy.

## Visual References

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
- Commands should match `package.json`.
- Release guidance should assume a static-hosted SPA with deep-link rewrites.
- Content documentation should always point back to `src/content/` as the source of truth.
