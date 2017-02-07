var autoprefixer = require('gulp-autoprefixer');
var babel =require('gulp-babel');
var bump = require('gulp-bump');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('js', () => {
    processJs('main.js', 'src/js/**/*.js', 'js');
});

gulp.task('scss', () => {
	gulp.src('src/scss/**/*.scss')
	    .pipe(sourcemaps.init({ loadMaps: true }))
    	.pipe(scss())
        .on('error', handleError)
    	.pipe(autoprefixer({
        	browsers: ['last 2 versions', 'Explorer 9'],
        	cascade: false
    	}))
	    .pipe(rename('style.css'))
        .pipe(cleanCSS({debug: true}, (details) =>  {
            console.log('\nCSS Cleaned');
            console.log('========================================');
            console.log(details.name);
            console.log('Original : ' + details.stats.originalSize);
            console.log('Minified : ' + details.stats.minifiedSize);
            console.log('Efficiency : ' + (details.stats.efficiency * 100).toFixed(1) + '%');
            console.log('========================================\n');
        }))
    	.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('css'));

});

gulp.task('images', () => {
	gulp.src('src/img/*.png')
		.pipe(imagemin())
		.pipe(gulp.dest('images'));
});

gulp.task('html', () => {
	gulp.src('src/templates/**/*.html.twig')
		.pipe(gulp.dest('templates/'));
});

gulp.task('watch', () => {
	gulp.watch('src/templates/**/*.html.twig', ['html', 'patch-bump']);
	gulp.watch('src/scss/**/*.scss', ['scss', 'patch-bump']);
	gulp.watch('src/js/**/*.js', ['js', 'test', 'patch-bump']);
	gulp.watch('src/img/**', ['images', 'patch-bump']);
});

// Default task
// ========================================================================================

// gulp.task('default', ['js', 'scss', 'images', 'html', 'patch-bump', 'watch', 'connect', 'test']);
gulp.task('default', ['js', 'scss', 'images', 'html', 'patch-bump', 'watch']);

// Utilities
// ========================================================================================

gulp.task('patch-bump', () => {
    var stuff = gulp.src('./package.json')
        .pipe(bump({type:'patch'}))
        .pipe(gulp.dest('./'))
    return stuff;
});

const processJs = (f, s, d) => {
    return gulp.src(s)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat(f))
        .pipe(babel({
            compact: true,
            minified: true,
            comments: false,
            presets: ['es2015']
        }))
        .on('error', handleError)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(d));
}

const handleError = (error) => {
    console.log(error);
    this.emit('end');
}

// gulp.task('connect', () => {
// 	connect.server({
// 		port: 8000,
// 		root: 'dist/',
// 		livereload: true
// 	});
// });
