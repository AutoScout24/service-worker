const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const options = {};

const loadTask = name => {
    const task = require(`./gulptasks/${name}`);
    return () => task(gulp, plugins, options);
};

const browserSync = loadTask('browser-sync')
const manifests = loadTask('manifests')
const offlinePages = loadTask('offline-pages')

exports.default = browserSync;
exports.dev = browserSync;
exports.manifests = manifests;
exports.offlinePages = offlinePages;
exports.build = gulp.series(manifests, offlinePages);