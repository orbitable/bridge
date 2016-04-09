var babel = require('gulp-babel');
var browserify = require('browserify');
var concat = require('gulp-concat');
var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var webserver = require('gulp-webserver');

var rootDirectory = path.resolve('.');
var sourceDirectory = path.join(rootDirectory, 'src');
var testDirectory = path.join(rootDirectory, 'test/unit');
var sourceFiles = [
  path.join(sourceDirectory, '/**/*.module.js'),
  path.join(sourceDirectory, '/**/*.js')
];

gulp.task('build', function() {
  return gulp.src(sourceFiles)
    .pipe(concat('bridge.js'))
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('browserify', ['build'], function() {
  return browserify('./dist/bridge.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('webserver', ['build', 'browserify'], function() {
  gulp.src(rootDirectory)
    .pipe(webserver({host: '0.0.0.0',  open: true}));
});

gulp.watch('src/**/*.js', ['build', 'browserify']);
gulp.watch('index.html', ['build', 'browserify']);

gulp.task('default', ['build', 'browserify', 'webserver']);
