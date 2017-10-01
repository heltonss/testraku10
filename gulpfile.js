const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpCopy = require('gulp-copy');
const cleanCSS = require('gulp-clean-css');
const clean = require('gulp-clean-dest');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const server = require('gulp-server-livereload');


gulp.task('sass', function () {
    return gulp.src('styles/sass/**/*.scss').pipe(sass({
        noCache: true
    })).pipe(gulp.dest('styles/css'));
});

gulp.task('copy', function () {
    return gulp.src('./index.html').pipe(gulp.dest('build/'));
});

gulp.task('perform-css', function () {
    return gulp.src(['styles/css/**/*.css', '!styles/css/styles.css'])
        .pipe(cleanCSS())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('build/css'));
})


gulp.task('index', function () {
    const target = gulp.src('build/index.html');
    const sources = gulp.src(['build/js/*.js', 'build/css/*.css'], { read: false });

    return target.pipe(inject(sources, { relative: true }))
        .pipe(gulp.dest('build/'));
});

gulp.task('uglifyjs', function () {
    return gulp.src(['js/**/*.js'])
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(clean('build/js'))
        .pipe(gulp.dest('build/js'));
})

gulp.task('webserver', function() {
    gulp.src('build/')
        .pipe(server({
            livereload: true,
            open: true,
            port: 3000,
            defaultFile: 'index.html'
        }));
});

gulp.task('development', function () {  
    const watcher = gulp.watch(
        ['js/**/*.js','./index.html','styles/sass/**/*.scss'], 
        ['sass','copy','uglifyjs','perform-css','index']
    );
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    }) 
})

gulp.task('default',['webserver','development']);