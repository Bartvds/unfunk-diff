/// <reference path="../src/_bootstrap.ts" />

module helper {
	require('source-map-support').install();

	var path = require('path');
	var mkdirp = require('mkdirp');
	var chai = require('chai');

	export function getTmpPath(...args:string[]):string {
		args.unshift('test', 'tmp');

		var dest = path.resolve.apply(path, args);
		mkdirp.sync(path.dirname(dest), parseInt('0744', 8));
		return dest;
	}

	export function getFixturePath(...args:string[]):string {
		args.unshift('test', 'fixtures');
		return path.resolve.apply(path, args);
	}

	export function longAssert(actual:string, expected:string, msg?:string):void {
		if (actual !== expected) {
			throw new chai.AssertionError((msg ? msg + ': ' : '') + ' long string', {
				actual: actual,
				expected: expected
			}, helper.longAssert);
		}
	}
}
