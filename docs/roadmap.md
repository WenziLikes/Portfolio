# Roadmap

[← Back to documentation hub](./README.md)

This roadmap is a planning document, not a hard commitment list.

It captures the highest-value directions for improving the portfolio as a professional public-facing product.

## Existing Foundation

The site already supports optional Google Analytics 4. Analytics loads only when a measurement ID is configured and the visitor explicitly allows it. Future measurement work should refine that consent-gated implementation and its reporting purpose, not describe analytics as an unimplemented feature.

The repository also maintains a dated [`CHANGELOG.md`](../CHANGELOG.md). New shipped milestones should be added there or published as GitHub Releases rather than left only in commit messages.

## Priority Themes

| Theme | Goal |
| --- | --- |
| Presentation quality | Make the portfolio feel sharper, more intentional, and more differentiated |
| Performance | Keep the site lightweight and fast across desktop and mobile devices |
| Content clarity | Keep experience, projects, and hiring narrative aligned and current |
| Release discipline | Treat the site like a maintained product with documented releases and checks |

## Near-Term Opportunities

- reduce the transfer size of the large home background graphic without losing the visual mood
- tighten image optimization for any remaining heavy PNG or icon assets
- expand project case studies with clearer business outcomes and implementation details
- review typography and spacing polish across light and dark themes
- document accessibility review findings and track remediations
- validate the existing GA4 event taxonomy against a small, explicit reporting goal and keep privacy copy aligned with any event changes

## Mid-Term Opportunities

- add richer project detail pages if deeper case-study storytelling becomes necessary
- turn selected changelog entries into concise public-facing release highlights if the portfolio evolves frequently
- improve structured data coverage for portfolio and resume surfaces
- keep the Cloudflare Pages deployment playbook aligned with the actual project configuration, preview flow, and rollback procedure
- automate additional release checks if the site starts changing more frequently

## Long-Term Opportunities

- expand or replace the existing consent-gated analytics only when there is a clear reporting goal, and update privacy documentation before new collection goes live
- add a lightweight CMS or content-editing workflow only if manual `src/content/` editing becomes a bottleneck
- add deeper asset automation if the portfolio starts changing visuals often
- build a more formal design system section if the component library grows beyond the current site scope

## Decision Rules

Prioritize roadmap items that improve at least one of the following:

- hiring clarity
- visual quality
- mobile usability
- release confidence
- long-term maintainability

Avoid complexity that adds operational overhead without improving the portfolio's hiring or presentation value.
