# Release Checklist

Use this checklist immediately before publishing any meaningful update to production.

## 1. Content Integrity

- confirm name, role, summary, location, phone number, and contact email
- confirm project descriptions, ordering, and outbound links
- confirm regional landing-page copy for Canada, USA, and Europe still matches the current positioning
- confirm resume content still matches homepage positioning and footer CTA copy
- confirm legal pages still reflect the current privacy and ownership stance
- regenerate the resume PDF if resume content changed

## 2. Technical Verification

Run:

```bash
npm install
npm test
npm run build
npx playwright test
```

Confirm:

- no failing unit tests
- no failing end-to-end tests
- no type errors during build
- build output contains public files and documents

## 3. Interaction Verification

- confirm the home hero `Resume` button opens `/resume`
- confirm the footer CTA and `/resume` toolbar download the current PDF
- confirm `/canada`, `/usa`, and `/europe` still render the intended market-specific copy and CTAs
- confirm theme switching still works in dark and light modes
- confirm desktop sidebar collapse still behaves correctly
- confirm desktop project reordering still works and persists locally
- confirm protected email, phone, GitHub, and LinkedIn links resolve correctly

## 4. Asset and Documentation Verification

- confirm hero and project preview assets are current and optimized
- confirm favicon, manifest icons, and social preview images resolve
- confirm no obsolete experiment assets are accidentally referenced
- run `npm run docs:screenshots` if the UI changed materially
- confirm `docs/visual-gallery.md` and the screenshots in `docs/assets/` match the current UI

## 5. SEO and Metadata

- confirm canonical URL uses the live production domain
- confirm route titles and descriptions remain accurate
- confirm regional `hreflang` alternates are still correct
- confirm `robots.txt` and `sitemap.xml` are present in the build
- confirm Open Graph and Twitter image paths are valid
- confirm structured data still reflects the live identity and links

## 6. Responsive and Mobile QA

- verify compact mobile width around `320px`
- verify standard modern phone width around `390px`
- verify large phone width around `430px`
- verify tablet portrait around `768px`
- verify footer CTA layout and legal links
- verify mobile navigation state and scroll behavior

## 7. Direct Route Checks

Open these routes directly in a production-like environment:

- `/`
- `/home` and confirm it redirects to `/`
- `/about`
- `/expertise`
- `/experience`
- `/projects`
- `/resume`
- `/privacy`
- `/copyright`
- `/canada`
- `/usa`
- `/europe`
- an unknown route to verify the not-found page

## 8. Hosting Readiness

- confirm the published directory is `build/`
- confirm the host serves generated route HTML and returns `404.html` for unknown routes
- confirm HTTPS is active
- confirm the custom domain is attached correctly

## 9. Go-Live Follow-Up

- open the live site from the final domain
- verify desktop and mobile navigation once more
- if analytics is enabled, verify the first visit appears in GA4 Realtime
- submit or refresh the sitemap in search tooling
- archive screenshots or notes for the release if you keep manual QA records

## 10. Release Notes

- record the release using `docs/release-notes-template.md`
- capture the date, scope, verification commands, and any known follow-ups
