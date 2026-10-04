# Cross-property corrections prepared for review

These changes are prepared, not published. No old repository is archived.

## Old Windows release repository README replacement

> # 1132 Fixer: retired Windows release channel
>
> This repository contains old Windows builds. It is not the current download or update channel. Download current Setup or Portable builds from https://github.com/1132-Fixer/windows/releases/latest. Current source, issues and security reporting are at https://github.com/1132-Fixer/windows.
>
> Old builds used a different helper-account model. Do not treat the old static password or administrator-helper instructions as current guidance. Current source uses a standard user and fresh random password sealed with Windows DPAPI. Fix now resets helper profile data; back up required data first.
>
> Error 1132 does not establish a device ban. Follow official Zoom reporting guidance: https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0069762. No guaranteed fix or measured success rate is claimed.
>
> Historical releases remain here for reference. Do not install them as an alternative to the current supported release.

Repository description: “Retired Windows release channel. Current source and downloads: github.com/1132-Fixer/windows.”

## Current Windows README

Replace “It is often tied to a Windows user profile, not the Zoom installer.” with:
“Profile isolation is this project's troubleshooting approach. Error 1132 alone does not prove a profile-related cause. Follow Zoom's official reporting steps first.”

## Browser README and privacy policy

Use: “The popup cleanup makes no direct network request. Reloading Zoom makes normal Zoom requests. Opening Report a Bug makes a capability GET request. Submitting sends the report fields and may register a per-install support reference. The service can receive normal connection metadata, including IP address.”

Keep no-telemetry wording limited to the popup. Do not say merely opening the report page transmits nothing. Store 1.2.1 remains cookie-only; source 1.2.7 also clears active-tab site data.

## Botify Network product page

Use Windows 6.4.0 (2026-09-05), macOS 1.7.6 (2026-09-26), source browser 1.2.7 and Chrome store 1.2.1 (2026-08-06). Replace cookie-only source description with separate source/store behavior. State that deleted profile/site/app data needs a prior backup; uninstall does not restore it. Link /security/ and /downloads/. Windows/browser MIT code; macOS noncommercial source. Avoid all-component open-source claims.

## Chrome Web Store 1.2.1

Remove “usually means a stale cookie”. Use “This tool clears Zoom browser cookies as a troubleshooting step. Error 1132 has no single proven cause here. No fix is guaranteed.” Update source link to https://github.com/1132-Fixer/browser and sibling link to https://github.com/1132-Fixer/windows. Keep 1.2.1 cookie-only permissions/features until newer package is reviewed and actually published. Do not change listing to 1.2.7 behavior without a matching package.

## Telegram

Suggested profile: “1132 Fixer: free downloads and release news for Windows, macOS and browser tools. Independent project. Source, safety and versions: https://1132-fixer.xyz/.” Full posts need read access before historical-copy audit can close. No message or post sent.
