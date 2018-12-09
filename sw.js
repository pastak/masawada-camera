self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
})

self.addEventListener('fetch', (event) => {
  if (/json$/.test(event.request.url)) return;
  if (location.hostname === 'localhost' && navigator.onLine) return;
      
  event.respondWith(
    (async () => {
      const cache = await caches.match(event.request.url);
      console.log('cache', cache);
      if (cache) return cache;
      try {
        return fetch(event.request.clone())
      } catch (e) {
        return fatch(event.request.url);
      }
    })()
  )
})
