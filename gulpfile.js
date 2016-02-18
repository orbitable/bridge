var gulp = require('gulp');
var concat = require('gulp-concat');
var path = require('path');
var runSequence = require('run-sequence');
var webserver = require('gulp-webserver');


var rootDirectory = path.resolve('.');
var sourceDirectory = path.join(rootDirectory, 'src');
var testDirectory = path.join(rootDirectory, 'test/unit');
var sourceFiles = [
  path.join(sourceDirectory, '/**/*.module.js'),
  path.join(sourceDirectory, '/**/*.js'),
  path.join(sourceDirectory, '/../../engine/src/*.js')
];

gulp.task('build', function() {
  gulp.src(sourceFiles)
    .pipe(concat('bridge.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('webserver', function() {
  gulp.src(rootDirectory)
    .pipe(webserver({fallback: 'index.html', open: true}));
});

gulp.watch('src/**/*.js', ['build']);

gulp.task('default', function () {
  runSequence('build', 'webserver');
});
