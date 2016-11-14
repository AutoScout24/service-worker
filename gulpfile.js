const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const options = {};

const loadTask = name => {
    const task = require(`./gulptasks/${name}`);
    return () => task(gulp, plugins, options);
};

const browserSync = require('browser-sync').create();

gulp.task('browser-sync', loadTask('browser-sync'));
gulp.task('manifests', loadTask('manifests'));
gulp.task('offline-pages', loadTask('offline-pages'));

gulp.task('default', ['browser-sync']);
gulp.task('dev', ['browser-sync']);
