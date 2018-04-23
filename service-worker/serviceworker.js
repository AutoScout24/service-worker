'use strict';

var CACHE_NAME = 'offline-v1';

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

const readPageviewsFromIdb = () => new Promise((resolve, reject) => {
    const request = indexedDB.open('offline-tracking', 1);
    request.onsuccess = function(event) {
        try {
            const db = event.target.result;
            const transaction = db.transaction(['pageviews'], 'readwrite');
            const objectStore = transaction.objectStore('pageviews');

            const events = [];
            const cur = objectStore.openCursor();
            cur.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    events.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(events);
                }
            };

            cur.onerror = err => reject(err);
        } catch(ex) {
            reject(ex);
        }
    };

    request.onerror = err => reject(e);
});

const deleteAllPageviews = pageviews => new Promise((resolve, reject) => {
    console.log('CLEAR;');
    try {
        const request = indexedDB.open('offline-tracking', 1);
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['pageviews'], 'readwrite');
            const objectStore = transaction.objectStore('pageviews');
            objectStore.clear();
            resolve();
        };
    } catch(ex) {
        reject(ex);
    }
});

self.addEventListener('sync', function(event) {
    const tld = location.hostname.split('.').pop();

    if (event.tag.startsWith('offline-tracking-')) {
        const pv = JSON.parse(event.tag.replace('offline-tracking-', ''));
        const obj = {
            XXXX: 1,
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

        console.log(event.tag);

        event.waitUntil(prom);
        // console.log(pv);
    }
    
    // if (event.tag === 'offline-tracking') {

    //     const prom = readPageviewsFromIdb().catch(e => []).then(pageviews => {
    //         const pvsToBeTracked = pageviews.filter(pv => pv.date > Date.now() - 4*60*60*1000).filter((pv, idx) => idx < 20);
    //         const body = pvsToBeTracked.map(pv => {

    //             const obj = {
    //                 v: 1,
    //                 aip: 1,
    //                 t: 'pageview',
    //                 tid: getTidForTld(tld),
    //                 dp: `/vp-${tld}/all/all/offline`,
    //                 dt: `vp-${tld}/all/all/offline`,
    //                 cd6: `vp-${tld}/all/all/offline`,
    //                 cid: pv.ga.cid,
    //                 sr: pv.ga.sr,
    //                 vp: pv.ga.vp,
    //                 cd40: 'tatsu',
    //                 z: (Math.random() * 1000000) | 0,
    //                 qt: Date.now() - pv.date
    //             };

    //             return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
    //         }).join('\n');

    //         return fetch('https://www.google-analytics.com/collect', {
    //             method: 'POST',
    //             body
    //         }).then(() => deleteAllPageviews());
    //     });

    //     event.waitUntil(prom);
    // }
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