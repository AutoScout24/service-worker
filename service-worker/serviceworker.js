'use strict';

var CACHE_NAME = 'offline-v3';

self.addEventListener('install', function (event) {
    self.skipWaiting();

    var tld = location.hostname.split('.').pop();
    var offlineRequest = new Request('/service-worker/offline-pages/offline.' + tld + '.html');

    event.waitUntil(fetch(offlineRequest).then(function (response) {
        return caches.open(CACHE_NAME).then(function (cache) {
            return cache.put(offlineRequest, response);
        });
    }));

});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (CACHE_NAME !== cacheName) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {

    if ((event.request.mode === 'navigate' || event.request.method === 'GET') && event.request.headers.get('accept').includes('text/html')) {
        // Only provide fallback for HTML content
        var tld = location.hostname.split('.').pop();
        var htmlFetchWithFallback = fetch(event.request).catch(function () {
            return caches.match('/service-worker/offline-pages/offline.' + tld + '.html');
        });

        event.respondWith(htmlFetchWithFallback);
    }
});

self.addEventListener('sync', function(event) {
    const tld = location.hostname.split('.').pop();

    if (event.tag.startsWith('offline-tracking-')) {
        const pv = JSON.parse(event.tag.replace('offline-tracking-', ''));
        const obj = {
            v: 1,
            aip: 1,
            t: 'pageview',
            tid: getTidForTld(tld),
            dp: `/vp-${tld}/all/all/offline`,
            dt: `vp-${tld}/all/all/offline`,
            cd6: `vp-${tld}/all/all/offline`,
            cid: pv.ga.cid,
            sr: pv.ga.sr,
            vp: pv.ga.vp,
            cd40: 'tatsu',
            z: (Math.random() * 1000000) | 0,
            qt: Date.now() - pv.date
        };
        const body = Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');

        const prom = fetch('https://www.google-analytics.com/collect', {
            method: 'POST',
            body
        });

        event.waitUntil(prom);
    }
});

function getTidForTld(tld) {
    switch(tld) {
        case 'de': return 'UA-43127313-1';
        case 'be': return 'UA-46278218-1';
        case 'es': return 'UA-46272074-1';
        case 'fr': return 'UA-46274090-1';
        case 'it': return 'UA-46275401-1';
        case 'lu': return 'UA-46275479-1';
        case 'nl': return 'UA-46274197-1';
        case 'at': return 'UA-46272880-1';
        case 'hu': return 'UA-49375829-6';
        case 'bg': return 'UA-49375829-5';
        case 'cz': return 'UA-49375829-4';
        default: return 'UA-49375829-1';
    }
}