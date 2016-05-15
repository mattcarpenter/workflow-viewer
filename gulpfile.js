var gulp = require('gulp');
var rename = require('gulp-rename');
var webpack = require('webpack-stream');

gulp.task('default', function () {
   return gulp.src('src/client/index.js')
       .pipe(webpack({
          watch: true,
           module: {
               loaders: [{
                   test: /\.js$/,
                   exclude: /node_modules/,
                   loader: 'babel',
                   query: {
                       presets: ['es2015']
                   }
               }]
           }
       }))
       .pipe(rename('bundle.js'))
       .pipe(gulp.dest('public/js'));
});