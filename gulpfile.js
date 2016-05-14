var gulp = require('gulp');
var rename = require('gulp-rename');
var webpack = require('webpack-stream');

gulp.task('default', function () {
   return gulp.src('src/client/index.js')
       .pipe(webpack())
       .pipe(rename('bundle.js'))
       .pipe(gulp.dest('public/js'));
});