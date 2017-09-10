/* jshint node:true */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

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
