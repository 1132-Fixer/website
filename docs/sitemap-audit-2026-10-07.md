# Sitemap access audit

Checked 2026-10-07, about 03:27 Europe/Stockholm.

## Current results

- Cloudflare MCP confirms active zone, correct assigned nameservers, and proxied
  apex/www A records. Public nameservers match. No conflicting website records.
- SSL mode is Full (strict). Minimum TLS is 1.2. Universal certificate is active
  for apex and wildcard, with expiry 2026-11-26.
- HTTP and www redirect to HTTPS apex with path and query preserved.
- Cache rule bypasses XML and robots documents and respects origin cache headers.
- Bot Fight Mode, JavaScript bot detection, and crawler blocking are disabled.
  Cloudflare does not replace robots.txt. Rocket Loader is off.
- No custom zone/account security ruleset, IP access rule, Page Rule, Worker
  route, or enabled Cloudflare Access application was found.
- Browser Integrity Check is on; security level is medium. No evidence requires
  reducing these protections. No Cloudflare setting was changed.
- Live sitemap returns HTTP 200, application/xml, no-cache, and DYNAMIC cache
  status. Downloaded XML passes xmllint. All nine listed pages return HTTP 200.
- Live robots.txt allows crawling and lists canonical HTTPS sitemap.
- Googlebot, Googlebot Smartphone, and Google-InspectionTool user-agent requests
  return HTTP 200 for sitemap and robots without a challenge. These requests
  do not prove access from each real crawler's network.
- Existing public check script passes. Monitoring now also checks robots and
  sitemap with all five existing crawler user-agent names, including XML content.

## Google evidence

Signed-in Search Console live inspection of sitemap.xml says "URL is available
to Google" and "Page can be indexed", tested 7 Oct 2026 at 03:26.
This test was already visible when this audit opened the user's tab.

Sitemaps report still says "Couldn't fetch" and "Sitemap could not be read".
Submission date and detail-page last read are 7 Oct 2026; discovered pages are
zero. No detailed HTTP or parsing error is shown. The live test is evidence of
current inspection access, not successful sitemap processing. Root cause of
the processing failure remains unconfirmed. No duplicate sitemap was submitted.

## Open DNSSEC step

Cloudflare DNSSEC is pending. Public resolver has no parent DS record. Registrar
must publish the Cloudflare DS below; a DS record inside this zone is not a fix.
No registrar session is available in current browser inventory.

```text
Key tag: 2371
Algorithm: 13
Digest type: 2
Digest: CE857392C2DC02C965FEF4D9D9FA8EBE4C3BDA121293B45915FABA9F0577F0CC
```

Missing DS leaves DNSSEC incomplete; it does not establish a cause for this
sitemap error. Keep the sitemap processing issue open until Google reports
successful processing. Compare future failure times with Cloudflare security
events and origin logs if the report continues to fail.
