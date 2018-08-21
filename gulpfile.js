var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');
var svgmin = require('gulp-svgmin');
var uncss = require('gulp-uncss');
var concat = require('gulp-concat');

gulp.task('hello', function () {
    console.log("Hello World");
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(uncss({
        html: ['app/index.html']
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

gulp.task('useref',function(){
    return gulp.src('./app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js',uglify()))
    //Minify only if it's a CSS file
    .pipe(gulpIf('*.css',cssnano()))
    .pipe(gulp.dest('dist'))
});

//gulp.task('uncss', function () {
//    return gulp.src('./dist/css/temp/styles.min.css')
//        .pipe(gulp.dest('./dist/css/tmp'))
//        .pipe(del.sync('./dist/css/styles.min.css'))
//        .pipe(uncss({
//            html: ['./dist/index.html']
//        }))
//        .pipe(gulp.dest('./dist/css/1'));
//});

gulp.task('fonts',function(){
    return gulp.src('./app/assets/fonts/**/*')
    .pipe(gulp.dest('./dist/assets/fonts'))
});

gulp.task('svg',function(){
    return gulp.src('./app/assets/svg/*')
    .pipe(svgmin())
    .pipe(gulp.dest('./dist/assets/svg'))
});

gulp.task('clean:dist', function(){
    return del.sync('dist');
});

gulp.task('build', function(callback){
    runSequence('clean:dist',['sass','useref','fonts','svg'], callback
    )
});
gulp.task('default',function(callback){
    runSequence(['sass','browserSync','watch'],callback
    )
});