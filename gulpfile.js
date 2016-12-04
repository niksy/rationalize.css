/* globals process:false */
/* eslint-disable no-process-env */

'use strict';

const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const debug = require('gulp-debug');
const nunjucks = require('gulp-nunjucks-render');
const babayaga = require('@niksy/babayaga');
const del = require('del');
const ws = require('local-web-server');
const opn = require('opn');
const minimist = require('minimist');
const globby = require('globby');
const postcss = require('gulp-postcss');
const atImport = require('postcss-import');

const args = minimist(process.argv.slice(2), {
	'default': {
		watch: false,
		port: 9000
	}
});
const watch = args.watch;
const port = args.port;

function handleError ( msg ) {
	gutil.log(gutil.colors.red(msg.message));
	this.emit('end');
}

gulp.task('test:cleanup', () => {
	return del([
		'./test-dist'
	]);
});

gulp.task('test:markup', ['test:cleanup'], () => {
	function bundle () {
		return gulp.src('./test/manual/suite/**/*.html')
				.pipe(plumber(handleError))
				.pipe(nunjucks())
				.pipe(plumber.stop())
				.pipe(gulp.dest('./test-dist'))
				.pipe(debug({ title: 'Markup:' }));
	}
	if ( watch ) {
		gulp.watch(['./test/manual/suite/**/*.html'], bundle);
	}
	return bundle();
});

gulp.task('test:style', ['test:cleanup'], function () {
	function bundle () {
		return gulp.src(['./test/manual/suite/**/*.css', './*.css'])
				.pipe(plumber(handleError))
				.pipe(sourcemaps.init({
					loadMaps: true
				}))
				.pipe(postcss([
					atImport()
				]))
				.pipe(sourcemaps.write())
				.pipe(plumber.stop())
				.pipe(gulp.dest('./test-dist'))
				.pipe(debug({ title: 'Style:' }));
	}
	if ( watch ) {
		gulp.watch(['./test/manual/suite/**/*.css', './*.css'], bundle);
	}
	return bundle();
});

gulp.task('test:script', ['test:cleanup'], () => {

	return globby(['./test/manual/suite/**/*.js'])
		.then(( files ) => {
			return files
				.map(( file ) => {
					const extname = path.extname(file);
					const key = path.basename(file, extname);
					const obj = {};
					obj[`${path.dirname(file).split(path.sep).pop()}/${key}`] = file;
					return obj;
				})
				.reduce(( prev, next ) => {
					return Object.assign(prev, next);
				}, {});
		})
		.then(( entries ) => {

			return babayaga({
				entries: entries,
				output: {
					path: './test-dist'
				},
				dev: true,
				watch: watch,
				setupBundle: ( bundle ) => {
					return bundle;
				},
				onAfterWrite: ( stream, isAsyncTask, isWatchUpdate ) => {
					if ( isWatchUpdate ) {
						return stream
							.pipe(debug({ title: 'Script:' }));
					}
					return stream;
				},
				onStartBuild: ( stream, isAsyncTask ) => {
					if ( isAsyncTask ) {
						return stream
							.pipe(debug({ title: 'Script:' }));
					}
					return stream
						.pipe(debug({ title: 'Script:' }));
				},
				onError: ( err ) => {
					gutil.log(gutil.colors.red(err.message));
				}
			}).build();

		});

});

gulp.task('test:assets', ['test:cleanup'], () => {
	function bundle () {
		return gulp.src('./test/manual/assets/**/*')
				.pipe(gulp.dest('./test-dist/assets'))
				.pipe(debug({ title: 'Assets:' }));
	}
	if ( watch ) {
		gulp.watch(['./test/manual/assets/**/*'], bundle);
	}
	return bundle();
});

gulp.task('test:prepare', ['test:cleanup', 'test:markup', 'test:style', 'test:script', 'test:assets']);

gulp.task('test:local:manual', ['test:prepare'], () => {
	if ( watch ) {
		ws({
			'static': {
				root: './test-dist'
			},
			serveIndex: {
				path: './test-dist'
			}
		}).listen(port);
		opn(`http://localhost:${port}`);
	}
});
