# Release Checklist

Use this checklist immediately before publishing any meaningful update to production.

## 1. Content Integrity

- confirm name, role, summary, location, and contact details
- confirm project descriptions and outbound links
- confirm resume content still matches homepage positioning
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

## 3. Asset Verification

- confirm hero images load correctly in dark and light themes
- confirm project previews are current and optimized
- confirm favicon, manifest icons, and social preview images resolve
- confirm no obsolete experiment assets are accidentally referenced

## 4. SEO and Metadata

- confirm canonical URL uses the live production domain
- confirm route titles and descriptions remain accurate
- confirm `robots.txt` and `sitemap.xml` are present in the build
- confirm Open Graph and Twitter image paths are valid

## 5. Responsive and Mobile QA

- verify compact mobile width around `320px`
- verify standard modern phone width around `390px`
- verify large phone width around `430px`
- verify tablet portrait around `768px`
- verify footer CTA layout and legal links
- verify mobile navigation state and scroll behavior

## 6. Direct Route Checks

Open these routes directly in a production-like environment:

- `/`
- `/resume`
- `/privacy`
- `/copyright`
- an unknown route to verify the not found page

## 7. Hosting Readiness

- confirm the host rewrites unknown routes to `index.html`
- confirm the published directory is `build/`
- confirm HTTPS is active
- confirm the custom domain is attached correctly

## 8. Go-Live Follow-Up

- open the live site from the final domain
- verify desktop and mobile navigation once more
- submit or refresh the sitemap in search tooling
- archive screenshots or notes for the release if you keep manual QA records

## 9. Release Notes

- record the release using `docs/release-notes-template.md`
- capture the date, scope, verification commands, and any known follow-ups
