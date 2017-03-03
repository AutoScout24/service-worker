'use strict';

self.addEventListener('install', function (event) {
    var tld = location.hostname.split('.').pop();
    var offlineRequest = new Request('/service-worker/offline-pages/offline.' + tld + '.html');

    event.waitUntil(fetch(offlineRequest).then(function (response) {
        return caches.open('offline').then(function (cache) {
            return cache.put(offlineRequest, response);
        });
    }));

    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
    if (event.request.mode === 'navigate' || event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
        // Only provide fallback for HTML content
        var tld = location.hostname.split('.').pop();
        var htmlFetchWithFallback = fetch(event.request).catch(function () {
            return caches.match('/service-worker/offline-pages/offline.' + tld + '.html');
        });

        event.respondWith(htmlFetchWithFallback);
    }
});