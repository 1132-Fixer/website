# P1 local validation

Date: 2026-10-04, Europe/Stockholm.

## Website

- `npm start`: Express started at localhost:3000.
- `SITE_URL=http://localhost:3000 node scripts/check-site.mjs`: passed. Homepage HTML/Markdown negotiation, cache headers, redirects, 404, robots and nine sitemap destinations checked.
- `node scripts/check-p1.mjs`: passed. Nine pages have one H1, title, description, canonical, indexable response, parseable JSON-LD, visible breadcrumbs where used, valid internal links/assets and full SHA-256 digest lengths. Structured data uses no ratings or price offers. This is local syntax/content validation, not Google's Rich Results certification.
- Browser rendered all nine pages at 390 and 1200 CSS pixels. One H1 per page; no horizontal overflow.
- Native Playwright clicks passed in separate Chromium context at both widths: Windows Setup/Portable, macOS and browser tabs, desktop download URLs, Chrome store link, and free support modal. Desktop download destinations were intercepted with harmless test files. Chrome store navigation reached Google's consent page with the correct store listing in its continuation URL. No installation performed.
- Warning banner is hidden. Paid support offer removed. Official guidance block removed at user request.
- Existing Windows/macOS project captures used with provenance caveat. macOS image resized to 960 pixels with correct dimensions. Browser image captured from source 1.2.7 installed as a real Chromium extension, NOT ZOOM state, no cleanup action.
- External href targets checked: 45 endpoints. Content links returned 200; bare fonts.googleapis.com preconnect origin returns 404 without a stylesheet path. It is a connection hint, not a user-facing broken link.
- XML parser and Git whitespace checks passed. Original homepage CRLF retained; whitespace check used `core.whitespace=cr-at-eol`.

## Product checks

- Windows GitHub latest release: 6.4.0. Artifact digest metadata and unsigned signature-state.json read. No Windows runtime launched.
- macOS latest: 1.7.6. DMG downloaded. SHA-256 matched GitHub. Read-only mounted app passed strict code-signature validation; Gatekeeper accepted Notarized Developer ID. DMG stapled notarization ticket validated. App itself has no stapled ticket. App was not launched; image unmounted after checks.
- Browser current source: d3d6b7dfbf9473a5d17b3c6ac947feac02cc464d, version 1.2.7. Source guard, typecheck, 45 unit tests, five builds, manifest/permission/integration/package checks passed. Installed missing browser test binaries, then all six end-to-end suites passed with Chromium 151.0.7922.34 and Firefox 153.0. Branded browsers and real Zoom repair remain separate checks.

## Remaining gates

External copy fixes and old-repository deprecation notices are prepared in P1-property-corrections-2026-10-04.md, not published. Full Telegram history, branded compatibility, live Zoom repair, exact packaged support configuration and server retention need further evidence. TODO leaves these gates open.

No deployment, remote website push, repository archive, store update, Telegram post, sitemap submission or indexing result is claimed.
