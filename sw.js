/* ============================================
   SERVICE WORKER — Super Farmacia Todo+Salud
   Versión: 1.0
   ⚠️ Cambia 'farmacia-v1' a 'farmacia-v2', 
   'farmacia-v3', etc. cada vez que 
   hagas cambios en tu página.
============================================ */

const CACHE_NAME = 'farmacia-v1';

const ARCHIVOS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
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