const browserSync = require('browser-sync').create();

module.exports = (gulp, plugins, options) => {
    browserSync.init({
        open: false,
        server: {
            baseDir: "."
        },
        serveStatic: ['.'],
        serveStaticOptions: {
            setHeaders: (res, path) => {
                res.setHeader('Service-Worker-Allowed', '/');
            }
        }
    });
};
