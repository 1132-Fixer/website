# SEO and AI discoverability TODO

Domain: https://1132-fixer.xyz/
Source: supplied "SEO & AI Discoverability Implementation Plan", sections 1-40.
Checked: 2026-10-04 (Europe/Stockholm).

Goal: make 1132 Fixer easy to find, understand, and verify for Zoom Error Code 1132.
Search engines decide indexing, ranking, and citations. No result is guaranteed.

Checked boxes below mean a specific check passed. They do not mean a whole phase is complete.
Public HTTP checks do not prove private Cloudflare settings or Google indexing.
P0 work and evidence: [2026-10-04 audit](docs/P0-audit-2026-10-04.md).
Code deployed and public checks passed. DNSSEC registrar DS and Google sitemap processing remain open.

## Current evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Homepage | Passed | HTTPS GET returned 200 and HTML. |
| HTTP to HTTPS | Passed | Apex HTTP returned 301 to HTTPS apex, then 200. |
| Preferred hostname | Passed | HTTP/HTTPS www now use one 301 to HTTPS apex; paths and queries preserved. |
| robots.txt | Passed | 200; allows crawling; names https://1132-fixer.xyz/sitemap.xml. |
| sitemap.xml | Passed for current list | 200 XML; only homepage listed; homepage returned 200. |
| Missing page | Passed for sampled path | /seo-validation-missing-20261004 returned 404. |
| Homepage indexing directives | Passed for sampled response | HTML says index, follow. No X-Robots-Tag header found. |
| Homepage metadata | P0 canonical fixed; P1 copy pending | Initial canonical is https://1132-fixer.xyz/. Title and description still focus on downloads. |
| Main heading | Needs work | No H1 found in returned page source. |
| Cloudflare settings | Audited; DNSSEC gap open | MCP audit complete. Strict TLS, valid origin certificate, redirects and document cache verified. DNSSEC pending; registrar DS absent. |
| Google/Bing indexing | Accounts inspected | Google homepage indexed and live fetch passed; indexing requested. Google sitemap processing has fetch error. Bing sitemap successful, one URL. |

## P0 - Cloudflare validation and crawl access

Use Cloudflare MCP for configuration checks. Read settings before changing them.
Record zone ID, setting/rule name, current value, result, and check date.
Do not mark these complete from public HTTP results alone.

- [x] Connect Cloudflare MCP and locate exact 1132-fixer.xyz zone.
- [x] Confirm zone is active and registrar delegation matches assigned nameservers.
- [x] Check apex and www DNS records against current hosting target. Check proxy state and remove conflicts only after proving correct target.
- [ ] Check DNSSEC status and matching registrar DS record if DNSSEC is enabled. **Blocked:** Cloudflare pending; registrar DS absent. Exact DS values in audit. Registrar access needed.
- [x] Verify edge certificate is active and covers apex and www.
- [x] Verify SSL/TLS mode is Full (strict), with a valid origin certificate. Do not use Flexible.
- [x] Inspect HTTPS and hostname redirect rules, including legacy Page Rules, Redirect Rules, and Workers. Remove conflicting rules if found.
- [x] Public check: HTTP apex redirects permanently to HTTPS apex.
- [x] Public check: HTTPS www redirects permanently to HTTPS apex.
- [x] Reduce HTTP www to one permanent redirect to https://1132-fixer.xyz/. Preserve paths and query strings.
- [x] Inspect WAF, bot controls, rate limits, security rules, and managed robots behavior for crawler blocks or challenges.
- [x] Confirm intended search and AI search crawlers can fetch public pages and assets. Record separate policy for AI training crawlers; do not assume search access requires training access.
- [x] Inspect cache rules for stale robots.txt, sitemap.xml, HTML, and incorrect content types.
- [x] Verify cache handling keeps HTML and Markdown responses separate when Accept varies. Check origin negotiation and Cloudflare cache behavior together.
- [x] Check compression, static-asset caching, and HTTP/2 or HTTP/3 support. Enable suitable options only when supported by current hosting.
- [x] Review Rocket Loader and other script transforms for rendering failures if enabled.
- [x] Record Search Console/Bing DNS verification records without exposing token values. DNS record presence alone does not prove account verification.
- [x] Recheck public URLs after any approved configuration change. Confirm no redirect loops, crawler challenges, or stale content.

## P0 - Indexing and URL rules

- [x] Add Google Search Console Domain property for 1132-fixer.xyz. Complete DNS verification through Cloudflare MCP using exact supplied record.
- [x] Inspect homepage in Search Console: crawl access, rendered content, indexing status, and Google-selected canonical.
- [x] Investigate exclusions: crawled/discovered but not indexed, duplicates, noindex, robots blocks, soft 404s, redirect errors, and server errors.
- [x] Confirm public robots.txt exists and allows intended crawling.
- [x] Confirm public sitemap.xml exists and currently lists a canonical 200 homepage.
- [x] Check sampled production homepage has no noindex directive.
- [x] Confirm sampled missing page returns real HTTP 404.
- [x] Set absolute homepage canonical in initial HTML: https://1132-fixer.xyz/.
- [x] Define HTTPS, apex hostname, lowercase paths, and trailing-slash rules. Use permanent redirects for alternate URLs.
- [x] Require self-referencing absolute canonical for each new indexable page. IndexNow script checks this gate. No new page added in P0; dedicated pages remain P1.
- [x] Keep important text, metadata, and normal anchor links in initial HTML. Preserve Express static architecture.
- [x] Review existing Markdown response for accurate content, Accept quality handling, and Vary: Accept behavior. Keep HTML as browser default.
- [x] Expand sitemap only after each new canonical page returns 200 and is indexable. Exclude redirects, errors, query duplicates, and noindex pages.
- [x] Update lastmod only when page content changes. Automate from actual content changes if practical.
- [ ] Submit sitemap to Google. Request indexing after deployment. Monitor Pages and Performance reports. **Partial:** HTTPS sitemap submitted; homepage live test passed and indexing request completed. Google sitemap fetch report remains unresolved.
- [x] Register and verify Bing Webmaster Tools. Submit sitemap.
- [x] Implement IndexNow key verification and change notifications for added, changed, or removed URLs. Verify submission response; do not resend unchanged pages. Public key verified; one homepage notification returned 202 (key validation pending). Second run sent nothing.
- [x] Set up monitoring for production failures over time. Hourly public health workflow installed; first manual run passed. Ongoing results need review. One successful request does not prove absence of intermittent 5xx errors.

## P1 - Verify product facts before writing

- [ ] Create canonical fact sheet from current source code, releases, licenses, and tests.
- [ ] Record Windows, macOS, and browser versions, supported platforms, behavior, permissions, network requests, telemetry, licenses, source repositories, and official downloads.
- [ ] Verify free-of-charge and open-source claims per component. Distinguish source availability from license rights.
- [ ] Label claims as official Zoom facts, project test results, community reports, or unconfirmed hypotheses.
- [ ] Cite current official Zoom documentation for Zoom behavior. Link project behavior claims to source or test evidence.
- [ ] Remove unsupported claims about guaranteed fixes, success rates, or hardware bans.
- [ ] Audit website, current/old GitHub repositories, Botify Network, Chrome Web Store, Telegram descriptions, release notes, and READMEs for conflicts.
- [ ] Resolve paid-service warning and paid-support copy so users can understand exact scope.
- [ ] Update obsolete documentation with deprecation notices and current links. Review before archiving old repositories.

## P1 - Homepage

Consult design-system/ before visual changes. Preserve supplied warning copy and current style unless change is requested.

- [ ] Use title: "Zoom Error 1132 Fixer - Free Fix for Windows, macOS & Browser", after verifying claims.
- [ ] Use meta description: "Troubleshoot Zoom Error Code 1132 with free, open-source tools for Windows, macOS and web browsers. Learn what Error 1132 is and choose the right fix for your platform.", after verifying claims.
- [ ] Add one H1: "Fix Zoom Error Code 1132".
- [ ] Add short factual introduction explaining toolkit and supported platforms.
- [ ] Follow content order: introduction, platform selector, Error 1132 explanation, platform cards, how it works, safety, 5-8 FAQs, source code, downloads, official resources.
- [ ] Make path clear: understand error, choose platform, learn changes, verify safety, download correct tool.
- [ ] Link all core pages with descriptive normal anchors. Keep platform switching and download actions working.

## P1 - Dedicated pages

Give each page distinct content, title, H1, canonical, references, and useful internal links.
Show current version, release date, last tested date, and supported platforms where relevant.

- [ ] /zoom-error-1132/: define error, symptoms, official guidance, possible causes, first steps, platform fixes, reinstall/profile/browser-data options, limits, safety, FAQs, and references.
- [ ] /windows/: verify supported versions, installation, administrator access, exact changes, helper accounts, credentials and DPAPI if used, network requests, telemetry, rollback, limits, troubleshooting, screenshots, releases, source, and checksums.
- [ ] /macos/: verify supported versions, installation, signing/notarization and user verification steps, permissions, system changes, network requests, privacy, reversal, limits, troubleshooting, source, releases, and checksums.
- [ ] /browser/: verify Chrome/Edge/Brave support, store link, accessed/changed site data, cookie relevance, permissions, privacy, source, manual alternative, limits, and screenshots.
- [ ] /how-it-works/: for each platform explain initial state, actions, files/settings/accounts/data touched, permissions, network requests, final state, and reversal. Link source evidence.
- [ ] /security/: explain source licenses, official downloads, signing, notarization, checksums/signatures, permissions, destination domains, transmitted data, telemetry, crash reports, identifiers, IP/log handling, reversal, and security reporting.
- [ ] /faq/: answer error meaning/cause, permanence, fixes, reinstalling Windows/Zoom, browser issues, alternate Windows accounts, product purpose, cost, licenses, safety, data collection, Zoom changes, affiliation, and downloads. Answer directly first.
- [ ] /downloads/: show each product's latest version, release date, supported system, official download, source, checksum/signature, and release notes. Clearly separate old builds.
- [ ] Link homepage to all eight pages. Link platform pages to guide, security, how-it-works, and downloads.

## P1 - Structured data and project identity

- [ ] Add accurate visible-content JSON-LD: WebSite, project Organization if appropriate, platform SoftwareApplication, and BreadcrumbList on internal pages.
- [ ] Render visible breadcrumbs where used. Validate markup. Do not invent ratings, reviews, counts, prices, authors, or compatibility.
- [ ] Use exact brand "1132 Fixer" across official properties. Link official site, source repositories, store listing, and project profiles together.
- [ ] Add About information: maintainers who consent to public names, purpose, history, source, bug reports, and security reports.
- [ ] Keep clear independent-project and Zoom trademark/affiliation statement. Verify company wording before publication.

## P2 - Evidence, usability, and authority

- [ ] Publish compatibility matrix with actual app, OS, browser, and Zoom versions; date; scenario; expected/observed behavior; and result.
- [ ] Document sample size, period, success definition, method, exclusions, and privacy if publishing success statistics.
- [ ] Add original screenshots of error, tools, installation, verification, and tested outcomes. Use descriptive filenames, useful alt text, compression, and explicit dimensions.
- [ ] Add tested troubleshooting decision tree: official guidance/update, desktop or browser path, platform steps, tool options, then official support. Provide accessible text equivalent.
- [ ] Add per-page Open Graph and Twitter/X metadata with absolute URLs and suitable 1200x630 previews.
- [ ] Test phone, Android, tablet, and desktop widths: readable text, tap targets, no sideways scrolling, clear downloads, usable tables/navigation, and unobscured content.
- [ ] Check headings, landmarks, keyboard access, focus, contrast, link text, labels, image descriptions, and color-independent meaning.
- [ ] Measure production Lighthouse/PageSpeed and available real-user data. Improve loading speed (LCP), response to interaction (INP), and layout stability (CLS).
- [ ] Optimize images, fonts, scripts, and third-party requests. Lazy-load lower images; keep main image prompt. Preload only critical assets.
- [ ] Make answers easy to quote with short factual sections, comparisons, numbered steps, references, authorship, and meaningful dates.
- [ ] Treat llms.txt as optional experiment after core indexing and content work.
- [ ] Prepare relevant editorial backlink targets: Zoom troubleshooting resources and open-source tool guides. Use documented testing, compatibility, security, and decision tree as useful references.
- [ ] Send outreach only with explicit authorization. Do not buy links or use automated forum/comment spam.

## Release checks

- [ ] Before deploy: each intended page has correct title, description, one H1, initial HTML content, canonical, and no noindex.
- [ ] Validate sitemap XML and every listed URL. Validate structured data and normal internal/external links.
- [ ] Confirm HTTP/hostname/path redirects, real 404s, permissions/security accuracy, current official downloads, affiliation statement, and updated old documentation.
- [ ] Test browser platform switching and downloads at desktop/mobile sizes. Run npm start for server/routing changes.
- [ ] After deploy: test actual production URLs, redirects, HTML/Markdown responses, robots.txt, sitemap, download destinations, and cache behavior.
- [ ] Run production performance and structured-data checks. Inspect Google-rendered HTML and selected canonicals.
- [ ] Submit Google/Bing sitemap, request Google indexing, and verify IndexNow. Monitor errors daily during initial rollout.

## P3 - Measure and maintain

- [ ] Use privacy-conscious analytics for landing pages, downloads, platform choices, GitHub/store clicks, troubleshooting completion, FAQ use, and referrals. Collect no unnecessary sensitive data.
- [ ] Review Search Console/Bing queries, impressions, click-through rate, positions, indexing, and available AI citation reporting after several weeks.
- [ ] Improve high-impression/low-click pages and content that does not meet query intent.
- [ ] Create Windows 11/Chrome/Edge/Brave subpages only when demand supports distinct useful content. Avoid duplicate keyword pages.
- [ ] Track relevant referring sites and useful AI citations without treating them as guaranteed outcomes.
- [ ] Update compatibility, versions, security, and guidance when evidence changes. Change dates only after meaningful work.

## Completion criteria

- [x] Cloudflare MCP audit complete; each relevant setting has evidence and unresolved gaps are explicit. See dated P0 audit; DNSSEC gate remains open.
- [ ] Google can crawl/index intended canonical pages; Search Console has no unexplained blocking issue.
- [ ] Homepage identifies product and error; all eight detailed pages exist and are internally linked.
- [ ] Technical, security, license, and compatibility claims match current evidence across official properties.
- [ ] Users can verify source, downloads, permissions, and build authenticity.
- [ ] Structured data matches visible content; original test evidence and primary-source citations are published.
- [ ] Search data guides future work. No keyword stuffing, fake reviews/statistics, copied content, doorway pages, or spam links.
