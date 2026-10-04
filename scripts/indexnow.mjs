import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const origin = 'https://1132-fixer.xyz';
const stateFile = '.indexnow-state.json';
const key = (await readFile('public/indexnow-key.txt', 'utf8')).trim();
const sitemap = await readFile('public/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
let previous = {};
try { previous = JSON.parse(await readFile(stateFile, 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

const current = {};
for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.origin !== origin || parsed.search || parsed.hash) throw new Error(`Noncanonical URL: ${url}`);
  const file = `public${parsed.pathname}index.html`;
  const source = await readFile(file, 'utf8');
  if (!source.includes(`<link rel="canonical" href="${url}">`) || /noindex/i.test(source)) {
    throw new Error(`Page is not indexable: ${url}`);
  }
  current[url] = createHash('sha256').update(source).digest('hex');
}
const changed = [...new Set([...Object.keys(current), ...Object.keys(previous)])]
  .filter(url => current[url] !== previous[url]);
if (!changed.length) {
  console.log('No changed URLs. No notification sent.');
} else {
  const keyResponse = await fetch(`${origin}/indexnow-key.txt`, { redirect: 'error' });
  if (keyResponse.status !== 200 || (await keyResponse.text()).trim() !== key) {
    throw new Error('Deploy the IndexNow key before submitting.');
  }
  for (const url of changed) {
    const response = await fetch(url, { headers: { Accept: 'text/html' }, redirect: 'manual' });
    if (current[url]) {
      const liveSource = await response.text();
      if (response.status !== 200 || !liveSource.includes(`<link rel="canonical" href="${url}">`) || /noindex/i.test(liveSource)) {
        throw new Error(`Deploy canonical page first: ${url} (HTTP ${response.status})`);
      }
      console.log(`${url}: HTTP ${response.status}, canonical confirmed.`);
    } else if (![404, 410].includes(response.status)) {
      throw new Error(`Removed URL still exists: ${url}`);
    }
  }
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host: '1132-fixer.xyz', key, keyLocation: `${origin}/indexnow-key.txt`, urlList: changed }),
  });
  console.log(`IndexNow: HTTP ${response.status}; ${changed.length} changed URL(s).`);
  if (![200, 202].includes(response.status)) throw new Error(await response.text());
  await writeFile(stateFile, JSON.stringify(current, null, 2) + '\n');
}
