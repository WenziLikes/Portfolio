# Legal and Brand

[Back to documentation hub](./README.md)

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
- documentation screenshots in `docs/assets/`

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

The site privacy surface includes:

- no user accounts
- no portfolio-hosted contact form; the embedded VMNorth chat provides its own name/email form and backend
- protected `mailto:` and `tel:` contact links
- outbound links to GitHub and LinkedIn
- an asynchronous `vmnorth.com/chat-embed.js` script and eager VMNorth-hosted iframe on every route
- a VMNorth chat flow that accepts the visitor's name, email address, messages, and optional attachments
- browser storage for the VMNorth chat session ID/token so a conversation can be restored
- optional GA4 integration gated by `VITE_GA_MEASUREMENT_ID`
- Google Fonts requests during normal browsing

Loading the VMNorth embed is not gated by the portfolio analytics choice. The choice controls GA4 only. Before a visitor starts a conversation, VMNorth can receive ordinary script, iframe, configuration, and presence requests together with technical data such as IP address, user-agent/browser details, request time, referring origin, and security or diagnostic logs.

After a visitor submits the chat form, VMNorth processes the supplied name and email, source-site and locale information, session credentials, messages, timestamps, read/typing state, and any attachment metadata and content. VMNorth documents PostgreSQL storage for sessions/messages, separate S3/R2-compatible object storage for attachment bytes, and email delivery for follow-up links or replies.

VMNorth does not publish one fixed retention period for every conversation, attachment, and operational log. Its [public privacy policy](https://vmnorth.com/privacy) says records are retained for as long as reasonably necessary to provide services, resolve disputes, maintain records, and meet legal obligations. Access, correction, and deletion requests go to `privacy@vmnorth.com`; the [Privacy Choices page](https://vmnorth.com/privacy-choices) explains the request route. Resetting the widget or clearing browser storage removes local session restore but does not itself delete the server-side conversation.

If analytics is enabled, the app can emit:

- `page_view`
- `contact_click`
- `resume_click`
- `github_click`
- `linkedin_click`

If forms, analytics, cookies, embeds, or third-party scripts are added or enabled, the privacy notice must be reviewed before release.

## External Requests to Remember

The current app can make external requests to:

- `vmnorth.com/chat-embed.js` and the VMNorth chat iframe, public configuration, and presence endpoints on every route
- VMNorth chat session, message, stream, and attachment endpoints after the visitor starts or restores a conversation
- `fonts.googleapis.com`
- `fonts.gstatic.com`
- `www.googletagmanager.com` when GA4 is enabled
- GitHub, LinkedIn, `mailto:`, and `tel:` targets after the user clicks an outbound link

That matters for both privacy documentation and performance review.

## Legal Change Triggers

Review legal documentation before release if any of the following change:

- you add analytics or trackers
- you add a contact form
- you add cookie-dependent features
- you add external media or embed providers
- you change VMNorth chat fields, session storage, providers, retention, deletion, or consent behaviour
- you change the ownership or licensing stance of the code

## Public Release Rule

Do not add an open-source `LICENSE` file unless you intentionally want to grant reuse rights.

Without that explicit step, the repository should continue to be treated as a proprietary portfolio codebase.
No license is granted or implied by public access to the repository.
