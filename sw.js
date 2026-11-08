const GHPATH = '/Himkart-Garhwal';
const CACHE_NAME = 'wink-it-v3';

const ASSETS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/style.css`,
  `${GHPATH}/script.js`,
  `${GHPATH}/newlogo.jpg`,
  `${GHPATH}/intro.mp4`
];

// Install Event: Cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate Event: Delete old caches
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

// Skip waiting triggered from client
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Fetch Event: Cache First, fallback to Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
