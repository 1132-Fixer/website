import assert from 'node:assert/strict';

const origin = process.env.SITE_URL || 'http://localhost:3000';
const canonicalOrigin = 'https://1132-fixer.xyz';
const paths = ['/', '/zoom-error-1132/', '/windows/', '/macos/', '/browser/',
  '/how-it-works/', '/security/', '/faq/', '/downloads/'];
const internal = new Set();
for (const path of paths) {
  const response = await fetch(origin + path, { redirect: 'manual' });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one H1`);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+">/);
  assert.ok(html.includes(`href="${canonicalOrigin}${path}"`), `${path}: canonical`);
  assert.doesNotMatch(html, /content="[^"]*noindex/);
  assert.ok(!response.headers.get('x-robots-tag')?.includes('noindex'));
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1, `${path}: structured data`);
  const data = JSON.parse(blocks[0][1]);
  assert.equal(data['@context'], 'https://schema.org');
  if (path === '/') {
    assert.equal(data['@type'], 'WebSite');
    assert.match(html, /class="scam-warning"[^>]* hidden/);
    assert.doesNotMatch(html, /250 Stars|\(\$5\)|offer paid support/);
    for (const guide of paths.slice(1)) assert.ok(html.includes(`href="${guide}"`));
  } else {
    const breadcrumb = data['@graph'].find(node => node['@type'] === 'BreadcrumbList');
    assert.equal(breadcrumb.itemListElement[1].item, canonicalOrigin + path);
    assert.ok(html.includes('aria-label="Breadcrumb"'));
    if (['/windows/', '/macos/', '/browser/'].includes(path)) {
      const app = data['@graph'].find(node => node['@type'] === 'SoftwareApplication');
      assert.ok(html.includes(app.softwareVersion.split(' ')[0]));
      assert.ok(app.downloadUrl.startsWith('https://'));
      assert.equal(app.aggregateRating, undefined);
      assert.equal(app.offers, undefined);
    }
  }
  for (const [, target] of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) internal.add(target);
  for (const [, digest] of html.matchAll(/<code>([a-f0-9]+)<\/code>/g)) {
    assert.equal(digest.length, 64, `${path}: SHA-256 length`);
  }
}
for (const path of internal) {
  const response = await fetch(origin + path, { redirect: 'manual' });
  if (path === '/x.js') {
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), 'https://umami.primehosting.dev/script.js');
  } else assert.equal(response.status, 200, path);
}
for (const path of paths.slice(1)) {
  const response = await fetch(origin + path.slice(0, -1), { redirect: 'manual' });
  assert.equal(response.status, 301, path);
  assert.equal(response.headers.get('location'), path);
}
console.log(`P1 metadata, structured data, internal links, assets and redirects passed (${paths.length} pages).`);
