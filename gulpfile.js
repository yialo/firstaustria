'use strict';

// Variables

var
  autoprefixer = require('autoprefixer'),
  browserSync = require('browser-sync').create(),
  del = require('del'),
  gulp = require('gulp'),
  mincss = require('gulp-csso'),
  plumber = require('gulp-plumber'),
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sassglob = require('gulp-sass-glob');

// Task functions

var cleanbuild = function () {
  return del('./build/');
}

var copyfonts = function () {
  return gulp.src('./app/fonts/**/*', {
      base: './app/fonts/'
    })
    .pipe(gulp.dest('./build/fonts/'));
}

var copyimg = function () {
  return gulp.src('./app/img/**/*', {
    base: './app/img/'
  })
    .pipe(gulp.dest('./build/img/'));
}

var scripts = function () {
  return gulp.src('./app/js/**/*.js')
    .pipe(gulp.dest('./build/'));
}

var style = function () {
  return gulp.src('./app/sass/main.sass')
    .pipe(plumber())
    .pipe(sassglob())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('./build/css/'))
    .pipe(mincss())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./build/css/'))
    .pipe(browserSync.stream());
}

var html = function () {
    return gulp.src('./app/*.html')
      .pipe(gulp.dest('./build/'));
  }

var serve = function () {
  browserSync.init({
    server: './build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch('./app/sass/**/*.sass', style);
  gulp.watch('./app/*.html', html).on('change', browserSync.reload);
}

// Gulp tasks

gulp.task('build', gulp.series(cleanbuild, copyfonts, copyimg, scripts, style, html));
gulp.task('serve', serve);
