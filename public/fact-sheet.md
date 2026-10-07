# 1132 Fixer canonical fact sheet

This sheet separates published artifacts, current source, automated checks, and live Zoom repair. None implies the others passed.

## Claim classes

- **Official Zoom fact:** Zoom's [1132 article](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0069762) asks users to update, reproduce, report, and confirm by email. It does not establish a universal cause.
- **Project source evidence:** actions and permissions below were read from source. Source behavior is not proof of behavior in an older published binary.
- **Project test evidence:** linked CI runs passed. They are not a current end-to-end Zoom repair test or proof of a success rate.
- **Community report:** project owner supplied long-term user reports: Error 1132 is described as a device ban linked to terms violations, cannot be reversed, and has a 1132 Fixer workaround. Reported symptom: Zoom desktop app shows 1132 when joining any meeting or signing in on the affected device. Published wording attributes these claims to users; no independent cause or exclusivity claim is made.
- **Unconfirmed hypothesis:** local profile or cookie state can be a troubleshooting target. Device-ban reports above are attributed to users, not established as official Zoom facts. Universal cookie causes, permanent fixes and numerical success rates are not established.

## Source identity

| Component | Canonical repository | Current source inspected | Published version |
| --- | --- | --- | --- |
| Windows | https://github.com/1132-Fixer/windows | 0981a721b91972a18b6240056f0e0a9e797dd33a | See [API release data](/downloads/) |
| macOS | https://github.com/1132-Fixer/macos | a72fc1432a080b328474c5fa6b359141a29e003c | See [API release data](/downloads/) |
| Browser | https://github.com/1132-Fixer/browser | d3d6b7dfbf9473a5d17b3c6ac947feac02cc464d | See [API release data](/downloads/) |

Local Windows checkout can differ from releases. Local chrome checkout predates repository restructuring. Current remote files were inspected instead of assuming local trees match releases. The chrome repository URL redirects to browser.

## Windows source facts

- Project requirements: Windows 10/11 x64, machine-wide Zoom and Secondary Logon. ARM64 native compatibility unverified.
- Administrator approval needed. Never reset user1 while signed into it or if it contains required data.
- Source resets user1 and its profile, creates standard user with fresh random password, starts Zoom under that identity, and writes helper settings/consent and optional shortcuts.
- Credentials: Windows CurrentUser DPAPI; `%APPDATA%\1132 Fixer\helper-credential.bin`. No plaintext helper-password claim is made for old builds.
- Updates: current source uses GitHub Releases. Older update channels include Botify and retired PrimeUpYourLife release repository.
- Optional support: configured service endpoint, per-install principal/token, report and optional screenshot. Current packaged endpoint and server log retention unverified.
- Project threat model excludes automatic telemetry. This is a source/policy finding, not a network trace of every binary.
- The Windows artifact inspected on 2026-10-04 reported UNSIGNED in signature-state.json. This does not describe later releases. Published GitHub digests are listed on /downloads/.
- Rollback: remove helper shortcut/account/profile from a different administrator login. Deleted helper data needs backup; removal is not proof all settings revert.
- [Workflow](https://github.com/1132-Fixer/windows/blob/0981a721b91972a18b6240056f0e0a9e797dd33a/main.js), [credential model](https://github.com/1132-Fixer/windows/blob/main/docs/security/helper-account.md), [support client](https://github.com/1132-Fixer/windows/blob/main/src/main/support-client.js), [threat model](https://github.com/1132-Fixer/windows/blob/main/docs/security/threat-model.md).

## macOS source and artifact facts

- Package.swift requires macOS 13+. Release is universal Intel/Apple Silicon.
- Start Zoom closes Zoom and updater processes, checks VPN/network, resets Zoom Library data, refreshes DNS under administrator approval, and starts sandbox-exec Zoom.
- Deleted home Library paths: Application Support/zoom.us; Caches/us.zoom.xos; Preferences/us.zoom.xos.plist; Saved Application State/us.zoom.xos.savedState; Logs/zoom.us.log*.
- Camera/microphone permissions support sandboxed Zoom. Source can change/reconnect network MAC on macOS 13; this method is disabled on macOS 14+.
- Source stops/disables Zoom updater launch agents. App uninstall does not restore them or deleted files. Restore backups and review/re-enable updater agents as required.
- GitHub update request; optional bug report with title, optional email, message, system information and diagnostics. Source default: 1132-bug-report-production.up.railway.app. Packaged endpoint configuration and retention unverified.
- Historical DMG inspected on 2026-10-04; SHA-256 matched GitHub digest. Read-only mounted app passed codesign --verify --deep --strict; spctl accepted it with source=Notarized Developer ID. DMG stapled notarization ticket passed xcrun stapler validate. App itself has no stapled ticket; online Gatekeeper assessment accepted it. These checks do not describe later releases. App was not launched. This does not prove repair or safety.
- [Commands](https://github.com/1132-Fixer/macos/blob/a72fc1432a080b328474c5fa6b359141a29e003c/Sources/1132Fixer/ShellCommands.swift), [report fields](https://github.com/1132-Fixer/macos/blob/main/Sources/1132Fixer/BugReportService.swift), [release](https://github.com/1132-Fixer/macos/releases/latest).

## Browser source and store facts

- Chrome store inspected on 2026-10-04: cookie-only cleanup; cookies, activeTab and Zoom hosts. Store claims are not a binary inspection.
- Current source adds scripting and clears active Zoom-origin localStorage, sessionStorage, Cache API, IndexedDB. Runs only after FIX ZOOM. Deletes Zoom cookies and reloads active tab. Does not confirm recovery.
- Source minimum Chromium 114; partition features degrade on older versions. Chrome/Edge/Brave branded installs still require manual validation. Firefox source minimum 140. Safari not implemented. TV guide is separate, not an extension.
- Host access is zoom.us/zoom.com and subdomains, HTTP/HTTPS. Other websites are outside intended cleanup scope.
- Popup cleanup has no direct network or telemetry. Reloaded Zoom makes normal page requests.
- Source report page checks capability, then sends user-submitted description, chosen screenshot, version, user agent and per-install support reference. Support origin: 1132-fixer-feedback-proxy-production.up.railway.app.
- Privacy policy states screenshot retention up to 90 days; server enforcement not checked. Current policy contains conflicting blanket no-transmission wording despite capability GET.
- Uninstall does not restore deleted state. Sign in again. Manual alternative: remove Zoom site data in browser settings.
- [Manifest](https://github.com/1132-Fixer/browser/blob/d3d6b7dfbf9473a5d17b3c6ac947feac02cc464d/apps/extensions/chrome/manifest.json), [core](https://github.com/1132-Fixer/browser/tree/main/packages/core/src), [compatibility](https://github.com/1132-Fixer/browser/blob/main/docs/platforms/compatibility-matrix.md), [privacy](https://github.com/1132-Fixer/browser/blob/main/PRIVACY_POLICY.md), [store](https://chromewebstore.google.com/detail/1132-fixer-for-chrome/fccnmckeeddpkhocebnbfnlapcjllljh).

## Price and license rights

Downloads are available without payment. Windows and browser code use MIT; brand assets have separate terms. macOS has a noncommercial license, with permission required for commercial use. Source availability is not unrestricted open source. No all-component open-source description is used. Read component LICENSE files before use.

User instructed removal of paid support and hiding warning banner. Banner copy stays in source, hidden. Paid Stars/dollar offer and paid contact action removed. Free discussions and bug reporting remain.

## Website network/privacy facts

server.js sends Umami download events with OS, variant, target URL and optional filename. Client loads /x.js from umami.primehosting.dev and Google Fonts. Discussions fetch comments.app on open. GitHub release lookup runs in browser. Normal web requests reveal IP to receiving servers; deployed log/retention policy unverified. No telemetry-free website claim.

## Current local browser source validation

Current inspected head d3d6b7dfbf9473a5d17b3c6ac947feac02cc464d checked in isolated /tmp checkout. Source guards, typecheck, 45 unit tests, all five builds, manifest/permission/integration/package validation passed. Initial end-to-end attempt could not start because browser binaries were absent. Installed Chromium and Firefox, then reran end-to-end gate: all six suites passed. Chrome/Edge/Brave unpacked builds were tested with real Chromium APIs; Zoom cookie cleanup paths use controlled API fixtures. This is not a branded-browser or live Zoom repair test.

Browser screenshot captured from installed source extension with real API, NOT ZOOM state, no cleanup action. Windows/macOS images copied from design-system captures; exact capture release/date unverified.

## Existing test evidence

- [Browser CI](https://github.com/1132-Fixer/browser/actions/runs/36777144734), 2026-09-30, ba585f41bbd1773018a0929321b09779557e2f59: success. This is not the current inspected head. Source matrix distinguishes mocked cleanup, real Gecko, Chromium package smoke and manual branded browser tests.
- [Windows CI](https://github.com/1132-Fixer/windows/actions/runs/37108891416), 2026-10-03, 97419271a9420603c6836e20686a4fcf6a8e11ac: success. This is not the published release or current inspected head.
- No current physical Windows/macOS/browser Zoom repair test, OS build, Zoom version or reproducible success cohort established. Pages explicitly say last repair test unverified.

## Cross-property conflict audit

| Surface | Finding | Action |
| --- | --- | --- |
| Website HTML/Markdown | macOS called open source; Windows ARM64; notarization asserted without artifact check; ambiguous browser source/store | Corrected; macOS artifact assessed; accurate guides added |
| Old Windows release repository | Claims device ban, static user1 password, administrator helper, profile preservation, live rating badge; not archived | Correction/deprecation text prepared in companion audit. External publication pending. Do not archive until reviewed |
| PrimeUpYourLife Chrome path | Redirects to 1132-Fixer/browser | Website uses canonical browser links |
| Current Windows README | Says error is often profile-related without cause evidence | Proposed narrower wording in companion audit |
| Current macOS README/release | License distinguishes noncommercial rights; release notes sparse | Site cites license and exact source rather than promises |
| Browser README/privacy | Current source behavior differs from old store; blanket no-transmission and submit-only wording ignores capability GET | Proposed precise correction in companion audit |
| Botify Network | macOS listing stale; browser called cookie-only; rollback claims overly broad | Prepared exact replacement facts; external publication pending |
| Chrome Web Store | Obsolete source links; “usually stale cookie” not established | Keep store behavior separate. Dashboard edit/publication requires listing access |
| Telegram public profile | “Release notes and news regarding the apps for Windows and macOS” | Brand channel verified. Full historical posts not available from public profile; no post sent |

## Open P1 gates

External description/docs publication and full Telegram/release-history audit remain open. Maintainer personal-name consent not supplied; use project attribution only. Exact release support configuration, log/IP retention, branded compatibility and live repair dates remain unverified. Do not mark full P1 complete until these gates close. Local commit does not prove deployment or external-property consistency.
