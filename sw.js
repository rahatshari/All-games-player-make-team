const CACHE_NAME = 'pro-team-generator-v4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './html2canvas.min.js',
  './manifest.json',
  './favicon.png',
  './logo.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // For app navigation, serve index.html (SPA cache-first with offline fallback)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cachedIndex) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put('./index.html', responseClone);
              });
            }
            return response;
          })
          .catch(() => cachedIndex);

        return cachedIndex || fetchPromise;
      })
    );
    return;
  }

  // Cache-first for static assets, scripts, fonts, icons
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || networkResponse.type === 'cors')
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback for any HTML navigation or script
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
