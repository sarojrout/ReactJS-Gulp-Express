var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	react = require('gulp-react'),
	sourcemaps = require('gulp-sourcemaps'),
	express=require('express'),
	traceur = require('gulp-traceur'),
	concat = require('gulp-concat'),
	devServer = require('./server');

gulp.task('scripts',['compile'], function() {
  return gulp.src('src/**/*.js')
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('src/main/webapp/build/js'));
});


 gulp.task('compile', function () {
      return gulp.src(['src/**/*.jsx', 'src/**/*.js'])
       	  .pipe(sourcemaps.init())
          .pipe(react())
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('src'));
});

gulp.task('start',function(){devServer()()});