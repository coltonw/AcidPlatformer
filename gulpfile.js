var gulp = require('gulp'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    mainBowerFiles = require('main-bower-files'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge-stream'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');


gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

gulp.task('lint', function() {
  return gulp.src('./src/js/*.js')
    .pipe(jshint({
        browser: true,
        jquery: true
    }))
    .pipe(jshint.reporter('default'));
});

gulp.task('less', ['clean'], function () {
  return gulp.src('./src/less/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', ['clean'], function() {
    var bowerFiles = gulp.src(mainBowerFiles());
    var appFiles = gulp.src('./src/js/**/*.js');
    return merge(bowerFiles, appFiles)
      .pipe(sourcemaps.init())
      .pipe(concat('script.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['clean', 'lint', 'less', 'build'], function() {
  // place code for your default task here
});
