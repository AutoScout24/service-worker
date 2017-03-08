'use strict';

self.addEventListener('install', function (event) {
    var tld = location.hostname.split('.').pop();
    var offlineRequest = new Request('/service-worker/offline-pages/offline.' + tld + '.html',{referrer: location.origin});

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
        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        // var fetchRequest = event.request.clone();

        var request = new Request(event.request.url, {
            method: 'GET',
            headers: event.request.headers,
            mode: event.request.mode == 'navigate' ? 'cors' : event.request.mode,
            credentials: event.request.credentials,
            header:location.origin,
            redirect: event.request.redirect
        });

        var htmlFetchWithFallback = fetch(request).catch(function () {
            return caches.match('/service-worker/offline-pages/offline.' + tld + '.html');
        });

        event.respondWith(htmlFetchWithFallback);
    }
});