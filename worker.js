// Serves Unity's pre-compressed WebGL build files (*.br, *.gz) with the right
// Content-Encoding. Cloudflare's static-asset layer won't set that header from
// _headers, so without this the browser receives raw Brotli bytes.
const TYPES = {
  '.js': 'application/javascript',
  '.wasm': 'application/wasm',
  '.data': 'application/octet-stream',
  '.symbols.json': 'application/octet-stream',
};
const ENCODINGS = { '.br': 'br', '.gz': 'gzip' };
// Bump to force browsers (and Unity's IndexedDB cache) to drop stored copies.
const CACHE_VERSION = 'enc2';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const encExt = Object.keys(ENCODINGS).find(ext => path.endsWith(ext));
    if (!encExt || !path.includes('/Build/')) return env.ASSETS.fetch(request);

    const asset = await env.ASSETS.fetch(request);
    if (!asset.ok) return asset;

    const inner = path.slice(0, -encExt.length);
    const typeExt = Object.keys(TYPES).find(ext => inner.endsWith(ext));
    const headers = new Headers(asset.headers);
    headers.set('Content-Encoding', ENCODINGS[encExt]);
    headers.set('Content-Type', TYPES[typeExt] || 'application/octet-stream');
    headers.set('Vary', 'Accept-Encoding');
    headers.delete('Content-Length');

    // encodeBody: 'manual' passes the already-compressed bytes through untouched.
    return new Response(request.method === 'HEAD' ? null : asset.body, {
      status: asset.status,
      headers,
      encodeBody: 'manual',
    });
  },
};
