var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	react = require('gulp-react'),
	sourcemaps = require('gulp-sourcemaps'),
	traceur = require('gulp-traceur');

gulp.task('default',['compile'], function() {
  gulp.src('src/**/*.js')
  .pipe(uglify()).pipe(gulp.dest('src/main/webapp/build/js'));
});


 gulp.task('compile', function () {
      return gulp.src(['src/**/*.jsx', 'src/**/*.js'])
       	  .pipe(sourcemaps.init())
          .pipe(react())
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('src/main/webapp/build/js'));
});