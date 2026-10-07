// Product versions come only from GitHub API. Store and source builds differ.
(async () => {
  const repos = new Set([...document.querySelectorAll('[data-release-version]')]
    .map(element => element.dataset.releaseVersion));
  await Promise.all([...repos].map(async repo => {
    const elements = document.querySelectorAll(`[data-release-version="${repo}"], [data-release-date="${repo}"], [data-release-asset^="${repo}:"], [data-release-digest^="${repo}:"]`);
    try {
      const endpoint = repo === 'browser'
        ? 'contents/apps/extensions/chrome/manifest.json'
        : 'releases/latest';
      const response = await fetch(`https://api.github.com/repos/1132-Fixer/${repo}/${endpoint}`, {
        headers: { Accept: 'application/vnd.github.raw+json' },
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error(`GitHub API: ${response.status}`);
      const data = await response.json();
      const version = repo === 'browser' ? data.version : data.tag_name;
      if (!version) throw new Error('Missing version');
      elements.forEach(element => {
        if (element.dataset.releaseVersion) element.textContent = version;
        if (element.dataset.releaseDate) {
          element.textContent = data.published_at ? data.published_at.slice(0, 10) : 'Unavailable';
        }
        const key = element.dataset.releaseAsset || element.dataset.releaseDigest;
        if (key) {
          const type = key.split(':')[1];
          const asset = (data.assets || []).find(item => type === 'dmg'
            ? /\.dmg$/i.test(item.name)
            : new RegExp(`${type}.*\\.exe$`, 'i').test(item.name));
          if (element.dataset.releaseAsset && asset) {
            element.href = asset.browser_download_url;
            element.textContent = `Download ${asset.name}`;
          }
          if (element.dataset.releaseDigest) {
            element.textContent = asset?.digest?.startsWith('sha256:')
              ? asset.digest.slice(7) : 'Not published by GitHub';
          }
        }
      });
      // The Chrome SoftwareApplication describes the store, not source.
      if (repo !== 'browser') {
        document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
          const schema = JSON.parse(script.textContent);
          (schema['@graph'] || []).forEach(node => {
            if (node['@type'] === 'SoftwareApplication') node.softwareVersion = version;
          });
          script.textContent = JSON.stringify(schema);
        });
      }
    } catch {
      elements.forEach(element => {
        if (element.tagName !== 'A') element.textContent = 'Unavailable';
      });
    }
  }));
})();
