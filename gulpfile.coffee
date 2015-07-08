gulp = require 'gulp'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
watch = require 'gulp-watch'
cjsx = require 'gulp-cjsx'
browserify = require 'browserify'
transform = require 'vinyl-transform'
sass = require('gulp-sass')

gulp.task 'default', ['coffee', 'cjsx', 'sass']

gulp.task 'watch', ->
  gulp.watch('./src/**/*.*', ['default'])

gulp.task 'coffee', ->
  gulp
    .src('./src/**/*.coffee')
    .pipe(coffee(bare: true).on('error', gutil.log))
    .pipe gulp.dest('./dist')

gulp.task 'cjsx', ->
  gulp
    .src('./src/**/*.cjsx')
    .pipe(cjsx(bare: true).on('error', gutil.log))
    .pipe(gulp.dest('./dist'))

gulp.task 'sass', ->
  gulp.src('./src/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'));

electron = require('gulp-electron')
package_json = require('./package.json')

gulp.task 'electron', ->
  gulp.src('')
    .pipe(electron(
      src: './dist',
      packageJson: package_json,
      release: './release',
      cache: './cache',
      version: 'v0.28.3',
      packaging: true,
      platforms: ['win32-ia32', 'darwin-x64'],
      platformResources:
        darwin:
          CFBundleDisplayName: package_json.name,
          CFBundleIdentifier: package_json.name,
          CFBundleName: package_json.name,
          CFBundleVersion: package_json.version,
          icon: './human.icns'
    ))
    .pipe(gulp.dest(''))
