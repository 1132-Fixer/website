import assert from 'node:assert/strict';

const origin = process.env.SITE_URL || 'https://1132-fixer.xyz';
const get = (path, headers = {}) => fetch(new URL(path, origin), {
  headers, redirect: 'manual', signal: AbortSignal.timeout(20000),
});
for (const [accept, type] of [
  ['*/*', 'text/html'],
  ['text/markdown', 'text/markdown'],
  ['text/html;q=1, text/markdown;q=0.5', 'text/html'],
  ['text/html;q=0.2, text/markdown;q=0.8', 'text/markdown'],
  ['text/html, text/markdown;q=0', 'text/html'],
]) {
  const response = await get('/', { Accept: accept });
  assert.equal(response.status, 200, accept);
  assert.ok(response.headers.get('content-type').startsWith(type), accept);
  assert.match(response.headers.get('vary'), /Accept/i);
  assert.match(response.headers.get('cache-control'), /no-store/);
  const body = await response.text();
  if (type === 'text/html') assert.ok(body.includes('<link rel="canonical" href="https://1132-fixer.xyz/">'));
  else assert.ok(body.includes('# 1132 Fixer'));
}
assert.equal((await get('/', { Accept: 'text/html;q=0,text/markdown;q=0' })).status, 406);
for (const path of ['/index.html', '/INDEX.HTML', '/index.md', '/discussion-mac/']) {
  const response = await get(`${path}?check=1`);
  assert.equal(response.status, 301, path);
  assert.equal(new URL(response.headers.get('location'), origin).pathname, '/');
  assert.equal(new URL(response.headers.get('location'), origin).search, '?check=1');
}
assert.equal((await get('/p0-missing-page-20261004')).status, 404);
const robots = await get('/robots.txt');
assert.equal(robots.status, 200);
assert.match(robots.headers.get('cache-control'), /no-cache|no-store/);
assert.match(robots.headers.get('content-type'), /text\/plain/);
assert.match(await robots.text(), /Sitemap: https:\/\/1132-fixer.xyz\/sitemap.xml/);
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.status, 200);
assert.match(sitemap.headers.get('cache-control'), /no-cache|no-store/);
assert.match(sitemap.headers.get('content-type'), /xml/);
for (const [, url] of (await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)) {
  assert.equal((await fetch(url.replace('https://1132-fixer.xyz', origin), { redirect: 'manual' })).status, 200, url);
}
for (const agent of ['Googlebot', 'bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot']) {
  for (const path of ['/', '/favicon.svg', '/robots.txt', '/sitemap.xml']) {
    const response = await get(path, { 'User-Agent': agent });
    assert.equal(response.status, 200, `${agent} ${path}`);
    assert.notEqual(response.headers.get('cf-mitigated'), 'challenge');
    if (path === '/sitemap.xml') {
      assert.match(response.headers.get('content-type'), /xml/);
      assert.match(await response.text(), /<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
    }
  }
}
if (origin === 'https://1132-fixer.xyz') {
  for (const host of ['http://1132-fixer.xyz', 'http://www.1132-fixer.xyz', 'https://www.1132-fixer.xyz']) {
    const response = await fetch(`${host}/robots.txt?check=1`, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), `${origin}/robots.txt?check=1`);
  }
}
console.log(`${new Date().toISOString()}: public checks passed for ${origin}`);
