var gulp = require('gulp')
    webserver = require('gulp-webserver')


gulp.task('default', function() {
  gulp.src('')
    .pipe(webserver({
      fallback: 'index.html',
      // livereload: true,
      // directoryListing: true,
      open: true
    }));
});
