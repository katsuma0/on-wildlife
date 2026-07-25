/* Ontario Wildlife Log, offline service worker.
   Precaches the app shell so the app opens and works with no connection.
   Bump CACHE when any shell file changes to roll the cache forward. */
var CACHE = 'owl-v16';
var SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data/categories.js',
  './data/species.js',
  './data/notes.js',
  './data/learn.js',
  './data/trust.js',
  './data/badges.js',
  './manifest.webmanifest',
  './vendor/leaflet/leaflet.js',
  './vendor/leaflet/leaflet.css',
  './vendor/leaflet/images/marker-icon.png',
  './vendor/leaflet/images/marker-icon-2x.png',
  './vendor/leaflet/images/marker-shadow.png',
  './vendor/leaflet/images/layers.png',
  './vendor/leaflet/images/layers-2x.png',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Web Push (iOS 16.4+ when installed to the Home Screen). The client subscribes
   for nearby bear/hazard alerts; delivery needs VAPID keys on the backend (see
   server/README). These handlers render and open notifications when they arrive. */
self.addEventListener('push', function (e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) { data = { body: e.data && e.data.text() }; }
  var title = data.title || 'Ontario Wildlife Log';
  var opts = {
    body: data.body || 'New wildlife activity near you.',
    icon: './icons/icon-192.png', badge: './icons/icon-192.png',
    data: { url: data.url || './' }
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ('focus' in list[i]) { list[i].navigate && list[i].navigate(url); return list[i].focus(); } }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // don't touch cross-origin (e.g. tiles/APIs)

  // Cache-first for the app shell; fall back to network and cache new GETs.
  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // Offline navigation fallback → app shell
        if (req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
