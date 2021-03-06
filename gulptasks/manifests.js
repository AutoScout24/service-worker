const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

module.exports = async (gulp, plugins, options) => {
    const urls = [
        // TODO: What about be? Which language? 
        'https://www.autoscout24.be/',
        'https://www.autoscout24.de/',
        'https://www.autoscout24.at/',
        'https://www.autoscout24.it/',
        'https://www.autoscout24.es/',
        'https://www.autoscout24.lu/',
        'https://www.autoscout24.fr/',
        'https://www.autoscout24.nl/',
        'https://www.autoscout24.hu/',
        'https://www.autoscout24.cz/',
        'https://www.autoscout24.bg/',
        'https://www.autoscout24.ro/',
        'https://www.autoscout24.ru',
        'https://www.autoscout24.pl/',
        'https://www.autoscout24.com.ua/',
        'https://www.autoscout24.hr/',
        'https://www.autoscout24.se/',
        'https://www.autoscout24.com.tr/',
        'https://www.autoscout24.com/',
    ];

    const createManifest = (description) => {
        return {
            name: 'AutoScout24',
            short_name: "AutoScout24",
            start_url: '/?ipl=home-screen&ipc=launch',
            description,
            orientation: 'any',
            display: 'standalone',
            icons: [{
              src: "https://www.autoscout24.de/service-worker/images/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png"
            }, {
              src: "https://www.autoscout24.de/service-worker/images/android-chrome-256x256.png",
              sizes: "256x256",
              type: "image/png"
            }, {
                src: "https://www.autoscout24.de/service-worker/images/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png"
            }],
            theme_color: '#fff',
            background_color: '#fff'
        };
    };

    const writeManifestToFile = (manifest, tld) => {
        fs.writeFileSync(path.resolve(process.cwd(), `service-worker/manifests/manifest.${tld}.json`), JSON.stringify(manifest, null, 4));
    };

    urls.forEach(url => {
        axios.get(url).then(res => {
            const tld = url.split('.').pop().replace('/', '');
            const $ = cheerio.load(res.data);
            const manifest = createManifest($('meta[name=description]').attr('content'));
            // gcm_sender_id presents only in de
            if (tld === 'de') manifest.gcm_sender_id = "103953800507"
            writeManifestToFile(manifest, tld);
        });
    });

    writeManifestToFile(createManifest('Test description'), 'localhost');
};