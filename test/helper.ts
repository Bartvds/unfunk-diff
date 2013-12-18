/// <reference path="../src/_bootstrap.ts" />

module helper {
	require('source-map-support').install();

	var path = require('path');
	var mkdirp = require('mkdirp');

	export function getTmpPath(...args:string[]):string {
		args.unshift('test', 'tmp');

		var dest = path.resolve.apply(path, args);
		mkdirp.sync(path.dirname(dest), parseInt('0644', 8));
		return dest;
	}

	export function getFixturePath(...args:string[]):string {
		args.unshift('test', 'fixtures');
		return path.resolve.apply(path, args);
	}
}
