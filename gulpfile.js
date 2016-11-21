// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var fs = require('fs');
var remoteSrc = require('gulp-remote-src');
var stripDebug = require('gulp-strip-debug');
var debug = require('gulp-debug');
var del = require('del');

// Compile Our Sass
gulp.task('sass', function () {
	return gulp.src('css/base.scss')
		.pipe(sass())
		.pipe(rename('style.css'))
		.pipe(gulp.dest('css'));
});


function run_cmd(cmd, cb, param) {
	var exec = require('child_process').exec;

	if (Array.isArray(cmd)) {

		console.log('Running: ' + cmd[0]);
		console.log((cmd.length - 1) + ' Others Queued');
		exec(cmd[0], function (err, stdout, stderr) {
			console.log(stdout);
			if (cmd[1] !== undefined) {
				//Pop array
				cmd.shift();
				run_cmd(cmd);
			}
		});

	} else {
		console.log('Running: ' + cmd);
		exec(cmd, function (err, stdout, stderr) {
			if (stdout) {
				console.log(stdout);
			}
			if (stderr) {
				console.log(stderr);
			}

			if (cb !== undefined) {
				cb(param);
			}
		});
	}


}

gulp.task('servers', function () {
	console.log('Starting web server for local site...');
	run_cmd('php -S 0.0.0.0:7000 -t ~/Documents/sensibleui/');
	console.log('Starting web server for local site...');
	run_cmd('php -S 0.0.0.0:7001 -t ~/Documents/sensibleui/tests/');

});

// Watch Files For Changes
gulp.task('watch', function () {
	gulp.watch('*.js', ['scripts']);
	gulp.watch('css/*.scss', ['sass']);

});

// Default Task
gulp.task('default', [
	'scripts',
	'sass',
	'watch'
]);
