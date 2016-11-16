const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

module.exports = (gulp, plugins, options) => {

    // TODO: translations needed
    const data = {
        en: {
            lang: 'en',
            text: 'There is no Internet connection',
            buttonText: 'Reload this page'
        },
        de: {
            lang: 'de-DE',
            text: 'Keine Internetverbindung',
            buttonText: 'Diese Seite neu laden'
        },
        fr: {
            lang: 'fr',
            text: 'Aucune connexion Internet',
            buttonText: 'Actualiser cette page'
        },
        at: {
            lang: 'de-AT',
            text: 'Keine Internetverbindung',
            buttonText: 'Diese Seite neu laden'
        },
        nl: {
            lang: 'nl',
            text: 'Er is geen internetverbinding beschikbaar',
            buttonText: 'Deze pagina opnieuw laden'
        },
        // What to do with be?
        be: {
            lang: 'fr/nl',
            text: 'Aucune connexion Internet / Er is geen internetverbinding beschikbaar',
            buttonText: 'Actualiser cette page / Deze pagina opnieuw laden'
        },
        it: {
            lang: 'it',
            text: 'Connessione Internet assente',
            buttonText: 'Ricarica questa pagina'
        },
        es: {
            lang: 'es',
            text: 'No hay conexión a Internet',
            buttonText: 'Cargar página de nuevo'
        },
        lu: {
            lang: 'fr',
            text: 'Aucune connexion Internet',
            buttonText: 'Actualiser cette page'
        },
        hu: {
            lang: 'hu',
            text: 'Nincs internetkapcsolat',
            buttonText: 'Az oldal újratöltése'
        },
        bg: {
            lang: 'bg',
            text: 'Няма връзка с интернет',
            buttonText: 'Презаредете тази страница'
        },
        cz: {
            lang: 'cz',
            text: 'Připojení k internetu není k dispozici',
            buttonText: 'Načíst tuto stránku znovu'
        },
        hr: {
            lang: 'hr',
            text: 'Nema internetske veze',
            buttonText: 'Ponovno učitaj ovu stranicu'
        },
        pl: {
            lang: 'pl',
            text: 'Brak połączenia z internetem',
            buttonText: 'Odśwież stronę'
        },
        ro: {
            lang: 'ro',
            text: 'Nu există conexiune la internet',
            buttonText: 'Reîncarcă această pagină'
        },
        ru: {
            lang: 'ru',
            text: 'Нет подключения к Интернету',
            buttonText: 'Oбновить эту страницу'
        },
        sk: {
            lang: 'sk',
            text: 'Det finns ingen internetanslutning',
            buttonText: 'Hämta sidan igen'
        },
        tr: {
            lang: 'tr',
            text: 'İnternet bağlantısı yok',
            buttonText: 'Bu sayfayı yeniden yükle'
        },
        ua: {
            lang: 'ua',
            text: 'Немає з’єднання з Інтернетом',
            buttonText: 'Перезавантажити цю сторінку'
        }
    };

    const tlds = ['de', 'at', 'nl', 'it', 'fr', 'lu', 'es', 'hu', 'cz', 'bg', 'ro', 'pl', 'hr', 'ru', 'sk', 'tr', 'ua', 'com', 'localhost'];

    tlds.forEach(tld =>{
        const html = nunjucks.render('offline-page-template.html', data[tld] || data['en']);
        fs.writeFileSync(path.resolve(process.cwd(), `service-worker/offline-pages/offline.${tld}.html`), html);
    });
};
