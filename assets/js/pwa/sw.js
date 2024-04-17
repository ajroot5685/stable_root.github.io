---
layout: compress
permalink: /:basename.min.js
# PWA service worker
---

const swconfUrl = '{{ '/assets/js/data/swconf.js' | relative_url }}';

importScripts(swconfUrl);
const purge = swconf.purge;

function verifyHost(url) {
  for (const host of swconf.allowHosts) {
    const regex = RegExp(`^http(s)?://${host}/`);
    if (regex.test(url)) {
      return true;
    }
  }
  return false;
}

function verifyUrl(url) {
  if (!verifyHost(url)) {
    return false;
  }

  const requestPath = new URL(url).pathname;

  for (const path of swconf.denyPaths) {
    if (requestPath.startsWith(path)) {
      return false;
    }
  }
  return true;
}

if (!purge) {
  swconf.allowHosts.push(location.host);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(swconf.cacheName).then((cache) => {
      return cache.addAll(swconf.resources).then(() => {
        return self.skipWaiting();
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      let responseToCache = response.clone();
      if (response.status === 200 && response.type === 'basic') {
        caches.open(swconf.cacheName).then((cache) => {
          cache.put(event.request, responseToCache);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});
