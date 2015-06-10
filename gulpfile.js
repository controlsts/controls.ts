
var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('less', function() {
    gulp.src(['**/*.less', '!./node_modules/**']).pipe(less()).pipe(gulp.dest(''));
});