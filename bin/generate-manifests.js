const urls = [
    // TODO: What about be? Which language? 'https://www.autoscout24.be/',
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
    'https://www.autoscout24.pl/',
    'https://www.autoscout24.com/',
];

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

urls.forEach(url => {
    axios.get(url).then(res => {
        const tld = url.split('.').pop().replace('/', '');
        const $ = cheerio.load(res.data);
        const manifest = {
            name: 'AutoScout24',
            short_name: "AutoScout24",
            start_url: '/?ipl=home-screen&ipc=launch',
            description: $('meta[name=description]').attr('content'),
            orientation: 'any',
            display: 'standalone',
            icons: [{
              src: "https://www.autoscout24.de/assets/external/home/1518/images/favicon/favicon-192x192.png",
              sizes: "192x192",
              type: "image/png"
            }],
            theme_color: '#FF7500',
            background_color: '#003468'
        };

        fs.writeFileSync(path.resolve(process.cwd(), `manifest.${tld}.json`), JSON.stringify(manifest, null, 4));
    });
});
