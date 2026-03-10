# Legal and Brand

## Ownership Position

This project is intended to remain proprietary unless an explicit license is added later.

Current ownership position:

- original source code is all rights reserved
- original written copy is all rights reserved
- original visual presentation is all rights reserved
- custom portfolio graphics and branding are all rights reserved

Primary notice:

- see `COPYRIGHT.md`

## What the Project Owns Directly

The repository contains original first-party material such as:

- portfolio copy
- resume narrative
- layout and presentation design
- project card arrangement and labeling
- local preview graphics prepared specifically for the site

These should not be redistributed or reused as if they were open source or public-domain brand assets.

## Third-Party Material

Third-party npm packages remain under their own licenses.

When adding anything external, record:

1. the source
2. the usage terms
3. whether attribution is required
4. whether privacy copy must change

This is especially important for:

- fonts
- analytics tools
- embeds
- stock imagery
- icon packs
- third-party scripts

## Brand Use Guidance

The personal name, portfolio identity, and presentation style should not be reused in ways that imply:

- endorsement
- affiliation
- authorship by someone else
- permission to clone the site brand

## Privacy Profile

The site currently has a lightweight privacy surface:

- no user accounts
- no first-party contact forms
- optional GA4 integration gated by `VITE_GA_MEASUREMENT_ID`
- outbound links to GitHub and LinkedIn
- Google Fonts requests during normal browsing

If forms, analytics, cookies, embeds, or third-party scripts are added or enabled, the privacy notice must be reviewed before release.

## External Requests to Remember

The current app makes external font-related requests through Google Fonts:

- `fonts.googleapis.com`
- `fonts.gstatic.com`

That matters for both privacy documentation and performance review.

## Legal Change Triggers

Review legal documentation before release if any of the following change:

- you add analytics or trackers
- you add a contact form
- you add cookie-dependent features
- you add external media or embed providers
- you change the ownership or licensing stance of the code

## Public Release Rule

Do not add an open-source `LICENSE` file unless you intentionally want to grant reuse rights.

Without that explicit step, the repository should continue to be treated as a proprietary portfolio codebase.
