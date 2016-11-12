'use strict';

var    gulp = require('gulp'),
     concat = require('gulp-concat'),
     uglify = require('gulp-uglify'),
  uglifycss = require('gulp-uglifycss'),
     rename = require('gulp-rename'),
       sass = require('gulp-sass'),
       maps = require('gulp-sourcemaps'),
        del = require('del');

var options = {
  src: 'src',
  dist: 'dist'
};

/**
 * Deletes dist and src/css directories
 */
gulp.task('clean', function() {
  del([options.dist, options.src + '/css']);
});

gulp.task('scripts', function() {
  return gulp.src([
    options.src + '/js/circle/*.js',
    options.src + '/js/*.js'
  ])
  .pipe(maps.init())
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(maps.write('./'))
  .pipe(gulp.dest(options.dist + '/js'));
});

gulp.task('compileSass', function() {
  return gulp.src(options.src + '/sass/global.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(maps.write('./'))
  .pipe(gulp.dest(options.src + '/css'));
});

gulp.task('styles', ['compileSass'], function() {
  return gulp.src(options.src + '/css/global.css')
  .pipe(uglifycss())
  .pipe(rename('all.min.css'))
  .pipe(gulp.dest(options.dist + '/css'));
});
