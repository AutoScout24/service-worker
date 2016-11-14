const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

module.exports = (gulp, plugins, options) => {

    // TODO: translations needed
    const data = {
        de: {
            lang: 'de-DE',
            text: 'Sie sind zur Zeit offline.',
            buttonText: 'Nochmal versuchen'
        },
        at: {
            lang: 'de-AT',
            text: 'Sie sind zur Zeit offline.',
            buttonText: 'Nochmal versuchen'
        },
        en: {
            lang: 'en',
            text: 'You are offline now.',
            buttonText: 'Reload the page'
        }
    };

    const tlds = ['de', 'at', 'nl', 'it', 'fr', 'lu', 'es', 'hu', 'cz', 'bg', 'ro', 'pl', 'com', 'localhost'];

    tlds.forEach(tld =>{
        const html = nunjucks.render('offline-page-template.html', data[tld] || data['en']);
        fs.writeFileSync(path.resolve(process.cwd(), `service-worker/offline-pages/offline.${tld}.html`), html);
    });
};
