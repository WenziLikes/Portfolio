# Contributing

[Documentation hub](../docs/README.md) · [Security policy](../SECURITY.md)

Thanks for helping improve VM Portfolio. Bug reports and documentation corrections are welcome through the repository's issue forms.

## License and Contribution Scope

This repository is proprietary and all rights are reserved. No license is granted to copy, reuse, redistribute, or create derivative works from its code, copy, design, or assets.

Code pull requests are accepted only after prior agreement with the maintainer. Before starting implementation, open an issue with the proposed scope and wait for confirmation. An accepted contribution does not change the repository's ownership or licensing terms.

## Development Setup

Use the pinned runtime and locked dependency graph:

```bash
nvm use
npm ci
npm run test:e2e:install
```

If resume content changed, run `npm run export:resume` first and include the regenerated public PDF. Before requesting review, run:

```bash
npm test
npm run build
npm run test:static
PLAYWRIGHT_SKIP_BUILD=1 npm run test:e2e
```

Update documentation when behavior changes. Refresh screenshots if the change affects a state captured in the [visual gallery](../docs/visual-gallery.md).

## Reports and Pull Requests

- Use the bug form for reproducible product or engineering defects.
- Use the documentation form for inaccurate, stale, or broken documentation.
- Do not include secrets, personal data, or vulnerability details in public reports.
- Report vulnerabilities privately through **Security → Report a vulnerability**.
- Keep an agreed pull request focused on one scope and complete the pull request checklist.

CI must pass unit tests, the production build, static-artifact smoke checks, Playwright E2E checks, and Markdown link checking before merge.
