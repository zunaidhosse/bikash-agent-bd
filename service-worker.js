const CACHE_NAME = 'zunaid-invoice-cache-v2'; // Increment version to trigger update
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/app.js',
  '/manifest.json',
  '/pin-icon.png',
  '/advance-icon.png',
  '/settings-icon.png',
  '/delete-icon.png',
  '/history-icon.png', // Added new history icon
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable.png', // Added new maskable icon
  'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap',
  'https://cdn-icons-png.flaticon.com/512/1170/1170627.png',
  'https://cdn-icons-png.flaticon.com/512/9377/9377574.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching all assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force activation of new service worker
  );
});

self.addEventListener('fetch', event => {
  // Use a "Cache then Network" strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Cache hit - return response
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - fetch from network, and cache it for next time
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Cache the new resource for future use.
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
            console.error('Fetching failed:', error);
            // Optional: You could return a custom offline page here
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all clients immediately
  );
});