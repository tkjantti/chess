/* jshint node:true */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var Server = require('karma').Server;
var ghPages = require('gulp-gh-pages');

function customPlumber(errTitle) {
    if (process.env.CI) {
        return plumber({
            errorHandler: function(err) {
                throw Error(err.message);
            }
        });
    } else {
        return plumber({
            errorHandler: notify.onError({
                title: errTitle || 'Error running Gulp',
                message: 'Error: <%= error.message %>'
            })
        });
    }
}

gulp.task('lint:js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(customPlumber('JSHint Error'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('watch-js', ['lint:js'], browserSync.reload);

gulp.task('watch', function () {
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/css/*.css', browserSync.reload);
    gulp.watch('src/js/**/*.js', ['watch-js']);
});

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: 'src'
        }
    });
});

gulp.task('test', function (done) {
    new Server({
        configFile: process.cwd() + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('dev-ci', function (callback) {
    runSequence(
        'lint:js',
        callback
    );
});

gulp.task('deploy', function () {
    return gulp.src('./src/**/*')
        .pipe(ghPages());
});

gulp.task('default', function (callback) {
    runSequence(
        'lint:js',
        ['browserSync', 'watch'],
        callback
    );
});
