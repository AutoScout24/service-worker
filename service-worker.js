self.addEventListener('install', event => {
    const tld = location.hostname.split('.').pop();
    var offlineRequest = new Request(`offline.${tld}.html`);

    event.waitUntil(
        fetch(offlineRequest).then(function(response) {
            return caches.open('offline').then(function(cache) {
                return cache.put(offlineRequest, response);
            });
        })
    );

    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    if (event.request.method === 'GET' && !/\.(css|js|png|jpg|jpeg|svg)/i.test(event.request.url)) {
        // Only provide fallback for HTML content
        const tld = location.hostname.split('.').pop();
        const htmlFetchWithFallback = fetch(event.request).catch(function() {
            return caches.match(`offline.${tld}.html`);
        });

        event.respondWith(htmlFetchWithFallback);
    }
});
