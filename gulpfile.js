var gulp = require('gulp'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    mainBowerFiles = require('main-bower-files'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    streamqueue = require('streamqueue');

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
    var jqueryFiles = gulp.src(mainBowerFiles({filter: /jquery/}), { base: 'bower_components' });
    var notJquery = function(file) {
      return !/jquery/.test(file);
    };
    var otherFiles = gulp.src(mainBowerFiles({filter: notJquery}), { base: 'bower_components' });
    var appFiles = gulp.src('./src/js/**/*.js');
    return streamqueue({ objectMode: true }, jqueryFiles, otherFiles, appFiles)
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
