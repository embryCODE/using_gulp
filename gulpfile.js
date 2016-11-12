'use strict';

var    gulp = require('gulp'),
     concat = require('gulp-concat'),
     uglify = require('gulp-uglify'),
  uglifycss = require('gulp-uglifycss'),
     rename = require('gulp-rename'),
       sass = require('gulp-sass'),
       maps = require('gulp-sourcemaps'),
        del = require('del'),
   imagemin = require('gulp-imagemin'),
     eslint = require('gulp-eslint'),
     useref = require('gulp-useref');



var options = {
  src: 'src',
  dist: 'dist'
};



/**
 * Deletes dist and src/css directories
 */
gulp.task('clean', function() {
  del([options.dist, options.src + '/css', options.src + '/js/global.js*']);
});

gulp.task('compileScripts', function() {
  return gulp.src([
    options.src + '/js/circle/*.js',
    options.src + '/js/*.js',
    '!node_modules/**'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(maps.init())
  .pipe(concat('global.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest(options.src + '/js'));
});

gulp.task('compileSass', function() {
  return gulp.src(options.src + '/sass/global.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(maps.write('./'))
  .pipe(gulp.dest(options.src + '/css'));
});

gulp.task('scripts', ['compileScripts'], function() {
  return gulp.src(options.src + '/js/global.js')
  .pipe(uglify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest(options.dist + '/js'));
});

gulp.task('styles', ['compileSass'], function() {
  return gulp.src(options.src + '/css/global.css')
  .pipe(uglifycss())
  .pipe(rename('all.min.css'))
  .pipe(gulp.dest(options.dist + '/css'));
});

gulp.task('images', function() {
  return gulp.src(options.src + '/images/*')
  .pipe(imagemin())
  .pipe(gulp.dest(options.dist + '/images'));
});

gulp.task('html', ['scripts', 'styles'], function() {
  return gulp.src(options.src + '/*.html')
    .pipe(useref({noAssets: true}))
    .pipe(gulp.dest(options.dist));
});

gulp.task('dev', ['clean'], function() {
  gulp.start(['compileScripts', 'compileSass']);
});

gulp.task('build', ['clean'], function() {
  gulp.start(['html', 'images']);
  gulp.src([options.src + '/icons/**/*'])
  .pipe(gulp.dest(options.dist + '/icons'));
});

gulp.task('default', ['build']);
