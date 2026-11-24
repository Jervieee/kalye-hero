const CACHE_NAME = 'kalye-hero-v9';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest?v=9',
  './css/style.css?v=9',
  './js/audio.js?v=9',
  './js/sprites.js?v=9',
  './js/levels.js?v=9',
  './js/jeep_ride.js?v=9',
  './js/karenderya.js?v=9',
  './js/game.js?v=9',
  './assets/hero_chibi.jpg',
  './assets/hero_jeep_jersey.jpg',
  './assets/hero_manong_cook.jpg',
  './assets/ph_street_banner.jpg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        ASSETS.map((url) =>
          fetch(new Request(url, { cache: 'reload' }))
            .then((res) => (res.ok ? cache.put(url, res) : null))
            .catch(() => null)
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first so updates always appear immediately; falls back to cache when offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});
