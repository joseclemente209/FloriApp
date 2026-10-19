const CACHE_NAME = 'floriapp-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './offline.html',
  './css/main.css',
  './js/app.js',
  './js/register-sw.js',
  './js/modules/ui.js',
  './js/modules/storage.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('./offline.html'));
    })
  );
});