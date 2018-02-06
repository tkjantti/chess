/* jshint node:true */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');


function customPlumber(errTitle) {
    return plumber({
        errorHandler: notify.onError({
            title: errTitle || "Error running Gulp",
            message: "Error: <%= error.message %>"
        })
    });
}

gulp.task('lint:js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(customPlumber('JSHint Error'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('watch', ['browserSync'], function () {
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/css/*.css', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: 'src'
        }
    });
});
