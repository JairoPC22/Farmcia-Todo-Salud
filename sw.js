const CACHE_NAME = 'farmacia-v10';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const noCache = ['.css', '.js', '.png', '.jpg', '.svg'];

  if (noCache.some(ext => url.pathname.endsWith(ext))) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => caches.match('/index.html'))
  );
});