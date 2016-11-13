'use strict';

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  uglifycss = require('gulp-uglifycss'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  maps = require('gulp-sourcemaps'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  eslint = require('gulp-eslint'),
  useref = require('gulp-useref'),
  browserSync = require('browser-sync').create(),
  imageminMozjpeg = require('imagemin-mozjpeg'),
  imageminOptipng = require('imagemin-optipng');


/**
 * Sets paths for src and dist directories.
 */
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

/**
 * Lints, maps, & concats all js files in src directory. Saves in js directory.
 */
gulp.task('compileScripts', function() {
  return gulp.src([
      options.src + '/js/circle/*.js',
      options.src + '/js/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(maps.init())
    .pipe(concat('global.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.src + '/js'));
});

/**
 * Compiles and maps sass files in src directory. Saves in css directory.
 */
gulp.task('compileSass', function() {
  return gulp.src(options.src + '/sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.src + '/css'));
});

/**
 * Calls compileScripts then minifies and renames the result and copies to
 * dist/js directory.
 */
gulp.task('scripts', ['compileScripts'], function() {
  return gulp.src(options.src + '/js/global.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest(options.dist + '/js'));
});

/**
 * Calls compileSass then minifies and renames the result and copies to
 * dist/css directory.
 */
gulp.task('styles', ['compileSass'], function() {
  return gulp.src(options.src + '/css/global.css')
    .pipe(uglifycss())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest(options.dist + '/css'));
});

/**
 * Optimizes images using the following built-in plugins:
 * gifsicle — Compress GIF images
 * jpegtran — Compress JPEG images
 * optipng — Compress PNG images
 * svgo — Compress SVG images
 *
 * Saves optimized images to dist/images.
 */
gulp.task('images', function() {
  return gulp.src(options.src + '/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest(options.dist + '/images'));
});

/**
 * Uses useref to copy index.html to dist directory and change css and js
 * links to use the minified versions. Does NOT automatically concat and minify
 * files because those tasks are being done by the 'scripts' and 'styles' tasks.
 */
gulp.task('html', ['scripts', 'styles'], function() {
  return gulp.src(options.src + '/*.html')
    .pipe(useref({
      noAssets: true // This tells useref to not mess with the files at all.
    }))
    .pipe(gulp.dest(options.dist));
});

/**
 * Compiles sass and js for development. Does not minify or copy to a
 * dist directory.
 */
gulp.task('dev', ['clean'], function() {
  gulp.start(['compileScripts', 'compileSass']);
});

/**
 * Builds a dist directory which includes compiled, concatenated, and minified
 * js and css, optimized images, and an index.html with correct links. Also
 * copies over the icons directory.
 */
gulp.task('build', ['clean'], function() {
  gulp.start(['html', 'images']);
  return gulp.src([options.src + '/icons/**/*'])
    .pipe(gulp.dest(options.dist + '/icons'));
});

/**
 * Sets 'build' as the default task.
 */
gulp.task('default', ['build']);

/**
 * Watches all sass files and js files for changes and calls 'styles' and
 * 'scripts', respectively.
 */
gulp.task('watch', function() {
  gulp.watch([options.src + '/sass/*.scss',
    options.src + '/sass/**/*.scss'
  ], ['styles']);
  gulp.watch([options.src + '/js/circle/*.js'], ['scripts']);
});

/**
 * Calls 'build' and 'watch' and serves the project using browserSync.
 *
 * 'watch' watches the sass and js files for changes and runs 'styles' and
 * 'scripts' when a change is detected.
 *
 * BrowserSync watches the dist directory for changes and refreshes the browser
 * when a change is detected.
 */
gulp.task('serve', ['build', 'watch'], function() {
  browserSync.init(options.dist, {
    server: {
      baseDir: options.dist
    }
  });
});
