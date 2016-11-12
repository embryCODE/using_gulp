'use strict';

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps');

var options = {
  src: 'src',
  dist: 'dist'
};

gulp.task('scripts', function() {
  return gulp.src([
    options.src + '/js/circle/*.js',
    options.src + '/js/*.js'
  ])
  .pipe(maps.init())
  .pipe(concat(all.min.js))
  .pipe(maps.write('./'))
  .pipe(gulp.dest(options.dist));
});

gulp.task("concatScripts", function() {
    return gulp.src([
        'js/jquery.js',
        'js/sticky/jquery.sticky.js',
        'js/main.js'
        ])
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});
