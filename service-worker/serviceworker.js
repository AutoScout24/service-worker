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

function httpGet(url) {

    return new Promise(function(resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function() {
            if (this.status == 200) {
                resolve(this.response);
            } else {
                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };

        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };

        xhr.send();
    });

}

self.addEventListener('fetch', function (event) {
    if (event.request.mode === 'navigate' || event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
        // Only provide fallback for HTML content
        var tld = location.hostname.split('.').pop();
        var htmlFetchWithFallback = httpGet(event.request).catch(function () {
            return caches.match('/service-worker/offline-pages/offline.' + tld + '.html');
        });

        event.respondWith(htmlFetchWithFallback);
    }
});