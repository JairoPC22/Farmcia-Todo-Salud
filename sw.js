const CACHE_NAME = 'farmacia-v4.5';

const ARCHIVOS = [
  '/',
  '/index.html',
  '/styles.css?v=5',
  '/script.js?v=5',
  '/aso-icono.png'
];

/* ── Instalar: guarda archivos ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

/* ── Activar: borra cachés viejos ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('🗑️ Borrando caché viejo:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch: sirve archivos ── */
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).catch(() => {
        // Si no hay conexión, sirve index.html
        return caches.match('/index.html');
      });
    })
  );
});