/*
 * mocha-unfunk-reporter
 * https://github.com/Bartvds/mocha-unfunk-reporter
 *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks('grunt-ts');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: grunt.util._.defaults(grunt.file.readJSON('.jshintrc'), {
				reporter: './node_modules/jshint-path-reporter'
			}),
			all: [
				'Gruntfile.js',
				'lib/**/*.js'
			]
		},
		clean: {
			build: ['build'],
			test: ['test/tmp', 'test/_tmp.*', '*.js.map']
		},
		mochaTest: {
			options: {
				reporter: 'mocha-unfunk-reporter'
			},
			any: {
				src: ['test/tmp/*.test.js']
			}
		},
		tslint: {
			options: {
				configuration: grunt.file.readJSON('tslint.json'),
				formatter: 'tslint-path-formatter'
			},
			source: ['src/**/*.ts'],
			test: ['test/**/*.ts']
		},
		ts: {
			options: {
				module: 'commonjs',
				target: 'es5',
				declaration: false,
				sourcemap: true,
				noImplicitAny: false
			},
			main: {
				options: {
					base_path: 'src/'
				},
				src: ['src/index.ts'],
				out: 'build/index.js'
			},
			test: {
				options: {
					base_path: 'test/src/'
				},
				src: ['test/src/*.test.ts'],
				out: 'test/tmp/bundle.test.js'
			}
		}
	});

	grunt.registerTask('default', ['test']);

	grunt.registerTask('prep', [
		'clean',
		'jshint'
	]);

	grunt.registerTask('build', [
		'prep',
		'tslint:source',
		'ts:main'
	]);

	grunt.registerTask('test', [
		'build',
		'ts:test',
		'tslint:test',
		'mochaTest'
	]);
};
