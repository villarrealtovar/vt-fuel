/*eslint-env node */

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');
//const jasmine = require('gulp-jasmine-phantom');
//const mocha = require('gulp-mocha');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin'); //losslessly compress JPEGs, GIFS, PNGs and SVGs 
//Lossy compression
const pngquant = require('imagemin-pngquant');
const nodemon = require('gulp-nodemon');

gulp.task('default', ['browser-sync','copy-html', 'copy-images','styles', 'lint'], ()=>{
	gulp.watch('./public/sass/**/*.scss',['styles']);
	gulp.watch('./public/js/**/*.js',['lint']);
	gulp.watch('./public/**/*.html', ['copy-html']);
	gulp.watch('./public/img/*', ['copy-images']);
	gulp.watch('./dist/index.html')
		.on('change', browserSync.reload);

});

gulp.task('browser-sync', ['nodemon'], ()=>{
	browserSync.init(null, {
		proxy: 'http://192.168.1.150:3000',
		watchOptions: {
			usePolling: true
		},
		//server: './dist',
		port: 7000
	});
});


gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'server/server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});



gulp.task('dist', [
	'copy-html',
	'copy-images',
	'styles',
	'lint',
	'scripts-dist'
]);

gulp.task('scripts', ()=>{
	gulp.src('./public/js/**/*.js')
		.pipe(babel())
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./dist/js'));	
});

gulp.task('scripts-dist', ()=>{
	gulp.src('./public/js/**/*.js')
		.pipe(babel())
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/js'));
});


gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths. 
    // So, it's best to have gulp ignore the directory as well. 
    // Also, Be sure to return the stream from the task; 
    // Otherwise, the task may end before the stream has finished. 
	return gulp.src(['**/*.js','!node_modules/**', '!server/**', '!public/bower_components/**'])
        // eslint() attaches the lint output to the "eslint" property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failAfterError last. 
        .pipe(eslint.failAfterError());
});


gulp.task('copy-html', ()=>{
	gulp.src('./public/index.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', ()=>{
	gulp.src('./public/img/*')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./dist/img'));
});


gulp.task('styles', ()=>{
	gulp.src('./sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['> 5%']
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});