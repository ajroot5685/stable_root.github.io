self.addEventListener('install', function (e) {
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  self.registration
    .unregister()
    .then(function () {
      return self.clients.matchAll();
    })
    .then(function (clients) {
      clients.forEach((client) => client.navigate(client.url));
      return Promise.resolve();
    })
    .then(() => {
      self.caches.keys().then(function (cacheNames) {
        Promise.all(
          cacheNames.map(function (cacheName) {
            return self.caches.delete(cacheName);
          })
        );
      });
    });
});
//test
