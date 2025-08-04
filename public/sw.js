self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => cache.addAll(['/','/index.html','/manifest.webmanifest']))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
