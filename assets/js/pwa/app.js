---
layout: compress
permalink: /assets/js/dist/:basename.min.js
---

if ('serviceWorker' in navigator) {
  const isEnabled = '{{ site.pwa.enabled }}' === 'true';

  if (isEnabled) {
    const swUrl = '{{ '/sw.min.js' | relative_url }}';

    navigator.serviceWorker.register(swUrl).then((registration) => {
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            installingWorker.postMessage('SKIP_WAITING');
          }
        });
      });
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  } else {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
}
