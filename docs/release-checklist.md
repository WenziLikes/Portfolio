# Release Checklist

[Back to documentation hub](./README.md)

Use this checklist before every meaningful production deployment.

## 1. Scope and Content

- [ ] Confirm name, role, summary, location, phone, and contact email.
- [ ] Confirm project descriptions, ordering, evidence, and every outbound link.
- [ ] Confirm Canada, USA, and Europe pages match current positioning.
- [ ] Confirm homepage, footer, route metadata, and resume tell the same professional story.
- [ ] Confirm FlipClock Display version, App Store URL, weather/location providers, privacy copy, and structured data match the current release.
- [ ] Confirm no temporary, generated test, or unrelated local files are included.

## 2. Runtime and Locked Install

- [ ] `.nvmrc` is `22.12.0`.
- [ ] `package.json` and `package-lock.json` both declare Node.js `^20.19.0 || >=22.12.0` and npm `>=10`.
- [ ] Install from the lockfile rather than mutating it during release.

```bash
nvm use
npm ci
npm run test:e2e:install
```

## 3. Resume Artifact

If any resume source content changed:

```bash
npm run export:resume
```

- [ ] The command completes with both the public export and build synchronization messages.
- [ ] `public/documents/viacheslav-murakhin-resume.pdf` is current.
- [ ] `build/documents/viacheslav-murakhin-resume.pdf` is byte-identical.
- [ ] Run the final build after export so the complete artifact is recreated from the updated public PDF.

## 4. Automated Verification

Run:

```bash
npm test
npm run build
npm run test:static
npm run test:e2e
```

Confirm:

- [ ] Vitest passes with no skipped release-critical regression.
- [ ] TypeScript, Vite client build, SSR build, and prerendering pass.
- [ ] Static smoke validates all direct routes, route metadata, real HTTP 404 behavior, `_headers`, `_redirects`, manifest/SEO assets, and the resume PDF.
- [ ] Playwright passes against the production `build/` server, not `vite dev`.
- [ ] The GitHub Actions unit/build/static, Playwright, and Markdown-link jobs pass for the release commit.

## 5. Interaction and Resume Delivery

- [ ] Home hero **Resume** opens `/resume`.
- [ ] Footer and resume-page actions use the current PDF.
- [ ] A normal browser downloads `Viacheslav-Murakhin-Resume.pdf`.
- [ ] An installed iOS web app shows **Save PDF** and opens the system Share/Save sheet with the PDF file.
- [ ] If file sharing is unsupported or preparation fails, the installed-app fallback opens the PDF in a separate view.
- [ ] Theme switching, desktop sidebar collapse, project reordering, and mobile navigation work.
- [ ] Email, phone, GitHub, LinkedIn, VM North, project repository, and App Store links resolve as intended.

## 6. Privacy and External Services

- [ ] `/privacy` states that the VMNorth script and iframe load on every route independently of GA4 consent.
- [ ] The notice covers ordinary request metadata, chat name/email, session credentials, messages, timestamps/state, optional attachments, storage boundaries, retention limits, and deletion requests.
- [ ] Resetting chat/browser storage is not described as server-side deletion.
- [ ] VMNorth data handling in `/privacy`, `docs/legal-and-brand.md`, architecture, and handoff is consistent.
- [ ] The live VMNorth chat loads, starts a conversation, and can restore a session.
- [ ] If `VITE_GA_MEASUREMENT_ID` is configured, no Google Analytics request occurs before consent and measurement works after consent.
- [ ] Google Fonts and all other third-party requests are still documented.
- [ ] `SECURITY.md` points vulnerability reporters to GitHub private reporting, not a public issue.

## 7. SEO and Static Hosting

- [ ] Canonical URLs use `https://viacheslavmurakhin.com`.
- [ ] Titles, descriptions, Open Graph/Twitter data, and JSON-LD are accurate.
- [ ] Regional `hreflang` alternates are correct.
- [ ] Indexable routes remain indexable; privacy/copyright, FlipClock legal routes, `/home`, and `404.html` remain noindex as designed.
- [ ] `robots.txt`, `sitemap.xml`, `manifest.json`, favicon assets, and `seo-preview.jpg` are present in `build/`.
- [ ] `_headers` preserves the resume attachment filename.
- [ ] `_redirects` preserves the four FlipClock clean-path `200` rewrites.
- [ ] Unknown routes return `build/404.html` with HTTP `404`, not a generic `200` SPA fallback.

## 8. Responsive and Visual QA

- [ ] Verify widths near `320`, `390`, `430`, and `768` pixels.
- [ ] Verify desktop with the sidebar expanded and collapsed.
- [ ] Verify homepage, projects, footer, market pages, legal/product pages, and resume sheets do not overflow.
- [ ] If visuals changed, run `npm run docs:screenshots` and review every changed image.
- [ ] Confirm `docs/visual-gallery.md` describes screenshots as dated release-support evidence rather than guaranteed live state.

## 9. Direct Routes

Open these through the production-like server or Cloudflare preview:

- [ ] `/`
- [ ] `/home` and its move to `/`
- [ ] `/about`
- [ ] `/expertise`
- [ ] `/experience`
- [ ] `/projects`
- [ ] `/resume`
- [ ] `/privacy`
- [ ] `/copyright`
- [ ] `/flipclock`
- [ ] `/flipclock/support`
- [ ] `/flipclock/privacy`
- [ ] `/flipclock/terms`
- [ ] `/canada`
- [ ] `/usa`
- [ ] `/europe`
- [ ] a unique unknown route with HTTP `404`

## 10. Cloudflare Pages

- [ ] Connected repository is `WenziLikes/Portfolio` and production branch is `main`.
- [ ] Build command is `npm run build`; output directory is `build`; root is the repository root.
- [ ] `NODE_VERSION=22.12.0` is configured.
- [ ] Production `VITE_GA_MEASUREMENT_ID` is intentionally present or absent.
- [ ] `viacheslavmurakhin.com` is attached and HTTPS is active.
- [ ] The unique Cloudflare preview/deployment URL serves the expected commit before custom-domain verification.
- [ ] Both repository CI and the Cloudflare Pages check pass on the release commit.

## 11. Go-Live and Rollback Readiness

- [ ] Verify the deployed commit SHA in the Cloudflare check/details.
- [ ] Repeat direct-route, 404, resume, chat, and consent checks on the custom domain.
- [ ] If GA4 is enabled, verify the consented test visit in Realtime.
- [ ] Identify the last known-good successful production deployment before closing the release.
- [ ] If rollback is required, use Cloudflare Pages **Deployments → All deployments → Rollback to this deployment**, then revert or fix `main`.

## 12. Release Record

- [ ] Complete `docs/release-notes-template.md`.
- [ ] Record release date, commit SHA, Cloudflare deployment/check link, scope, commands, manual evidence, environment/privacy changes, and known follow-ups.
- [ ] Record whether the resume PDF and documentation screenshots changed.
