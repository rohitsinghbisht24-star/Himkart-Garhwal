const GHPATH = '/Himkart-Garhwal';
const CACHE_NAME = 'wink-it-v4';

// Only lightweight critical static files are pre-cached on install
const ASSETS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/style.css`,
  `${GHPATH}/script.js`,
  `${GHPATH}/icon-192.png`
];

// Install Event: Cache critical resources safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event: Delete old caches and claim clients immediately
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

// Skip waiting message handler
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Fetch Event: Direct network for media, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass strict caching for videos (`intro.mp4`) to prevent range-request/streaming failures
  if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Standard cache-first strategy for app files
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
