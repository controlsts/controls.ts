
var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var browserSync = require('browser-sync');

gulp.task('less', function() {
    gulp.src(['**/*.less', '!./node_modules/**'])
        .pipe(watch(['**/*.less', '!./node_modules/**']))
        .pipe(less())
        .pipe(gulp.dest(''))
        .pipe(livereload());
});

gulp.task('browser-sync', function() {
    var files = [
        'examples/**/*',
        'controls.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: '.'
        }
    })
});