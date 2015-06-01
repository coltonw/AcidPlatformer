var gulp = require('gulp'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    mainBowerFiles = require('main-bower-files'),
    gulpIgnore = require('gulp-ignore'),
    merge = require('merge-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin');

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

gulp.task('build:js', ['clean'], function() {
    var bowerFiles = gulp.src(mainBowerFiles());
    var jqueryFiles = bowerFiles
      .pipe(gulpIgnore.include('bower_components/jquery/**'));
    var otherFiles = bowerFiles
      .pipe(gulpIgnore.exclude('bower_components/jquery/**'));
    var appFiles = gulp.src('./src/js/**/*.js');
    return merge(jqueryFiles, otherFiles, appFiles)
      .pipe(sourcemaps.init())
      .pipe(concat('script.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/js'));
});

gulp.task('build:img', ['clean'], function () {
  return gulp.src('./src/img/**/*.{svg,png,gif,jpg,ico}')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('build:html', ['clean'], function() {
    return gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'lint', 'less', 'build:js', 'build:img', 'build:html'], function() {
  // Any additional default tasks can go here
});
