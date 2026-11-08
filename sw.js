/* remove this for the code to work
const GHPATH = '/Himkart-Mussoorie';
const CACHE_NAME = 'wink-it-v3'; // Increment this every time you change code!
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/newlogo.jpg',
  '/intro.mp4'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Add this: allows the new SW to take over immediately
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
*/
