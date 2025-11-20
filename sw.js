const CACHE_NAME = 'calculadora-v1.0.0';
const STATIC_CACHE = 'calculadora-static-v1';
const DYNAMIC_CACHE = 'calculadora-dynamic-v1';

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

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('SW: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('SW: Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('SW: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(fetchResponse => {
            // Cache dynamic content
            if (fetchResponse.ok) {
              const responseClone = fetchResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            return fetchResponse;
          })
          .catch(() => {
            // Fallback for offline
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('SW: Background sync triggered');
  }
});

// Push notifications (future feature)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icons/icon.svg'
    });
  }
});