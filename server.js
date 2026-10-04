const express = require('express');
const path = require('path');
const fs = require('fs');
const umamiModule = require('@umami/node');

const umami = umamiModule.default || umamiModule;

const UMAMI_HOST_URL = process.env.UMAMI_HOST_URL || 'https://umami.primehosting.dev';
const UMAMI_API_ENDPOINT = process.env.UMAMI_API_ENDPOINT || '/data/x';
const ANALYTICS_ENDPOINT = process.env.ANALYTICS_ENDPOINT || '/data/x';
const UMAMI_WEBSITE_ID =
  process.env.UMAMI_WEBSITE_ID || '9cd27a99-9a90-4dc6-9d20-dd1549b5dd18';

const app = express();
const port = process.env.PORT || 3000;

umami.init({
  websiteId: UMAMI_WEBSITE_ID,
  hostUrl: UMAMI_HOST_URL,
});

umami.send = function sendToCustomEndpoint(payload, type = 'event') {
  return fetch(new URL(UMAMI_API_ENDPOINT, UMAMI_HOST_URL), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': `Mozilla/5.0 Umami/${process.version}`,
    },
    body: JSON.stringify({ type, payload }),
  });
};

app.use(express.json());

// Public paths use lowercase. Documents keep a trailing slash; files do not.
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  let canonicalPath = req.path.toLowerCase();
  if (['/index.html', '/index.md', '/discussion-mac', '/discussion-windows',
    '/discussion-ios', '/discussion-android'].includes(canonicalPath.replace(/\/$/, ''))) {
    canonicalPath = '/';
  } else if (path.extname(canonicalPath)) {
    canonicalPath = canonicalPath.replace(/\/$/, '');
  } else if (!canonicalPath.endsWith('/') &&
    fs.existsSync(path.join(__dirname, 'public', canonicalPath, 'index.html'))) {
    canonicalPath += '/';
  }
  if (canonicalPath !== req.path) {
    return res.redirect(301, canonicalPath + req.originalUrl.slice(req.path.length));
  }
  return next();
});

app.get('/x.js', (_req, res) => {
  // Redirect instead of proxying the script body to avoid upstream access checks
  // on server-side fetches while keeping the existing first-party script URL.
  res.redirect(302, new URL('/script.js', UMAMI_HOST_URL).toString());
});

app.post(ANALYTICS_ENDPOINT, async (req, res) => {
  const { os, variant, url, filename } = req.body || {};

  if (!os || !variant || !url) {
    return res.status(400).json({ error: 'Missing required download analytics fields.' });
  }

  try {
    await umami.track({
      name: 'download',
      hostname: req.hostname,
      language: req.get('accept-language')?.split(',')[0],
      referrer: req.get('referer'),
      title: `1132 Fixer download for ${os}`,
      url: req.originalUrl,
      data: {
        os,
        variant,
        filename: filename || null,
        targetUrl: url,
      },
    });
  } catch (error) {
    console.error('Failed to send download analytics to Umami:', error);
  }

  return res.status(204).end();
});

app.get('/', (req, res) => {
  res.vary('Accept');
  // Cloudflare does not generally key its cache on Accept.
  res.set('Cache-Control', 'no-store');

  const format = req.accepts(['text/html', 'text/markdown']);
  if (!format) return res.status(406).send('Supported formats: text/html, text/markdown.');

  if (format === 'text/markdown') {
    return res.sendFile(path.join(__dirname, 'public', 'index.md'), {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res, filePath) {
    if (/\.(html|md|xml|txt)$/.test(filePath)) {
      res.set('Cache-Control', 'no-cache');
    } else {
      res.set('Cache-Control', 'public, max-age=86400');
    }
  },
}));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
