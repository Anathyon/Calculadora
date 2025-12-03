const CACHE_NAME = 'calculadora-v2.0.0';
const STATIC_FILES = [
  './',
  './index.html',
  './CSS/index.css',
  './script_js/index.js',
  './manifest.json',
  './icons/icon.svg',
  './svgs/history-svgrepo-com.svg',
  './svgs/eraser-svgrepo-com.svg',
  './svgs/calculator-part-2-svgrepo-com.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .catch(() => {
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});