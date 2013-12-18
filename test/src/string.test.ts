/// <reference path="../helper.ts" />

describe('string diffs', () => {

	var fs = require('fs');
	var path = require('path');
	var mkdirp = require('mkdirp');
	var ministyle = <MiniStyle> require('ministyle');
	var assert:Chai.Assert = require('chai').assert;
	var unfunk = require('../../build/index');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	function assertStringDiff(nameA:string, nameB:string, name:string, style, debug:boolean = true) {
		var stringA = fs.readFileSync(helper.getFixturePath('big', nameA + '.txt'), 'utf8');
		var stringB = fs.readFileSync(helper.getFixturePath('big', nameB + '.txt'), 'utf8');
		assertStringValueDiff(stringA, stringB, name, style, debug);
	}

	function assertStringValueDiff(stringA:string, stringB:string, name:string, style, debug:boolean = true) {

		var diff = new unfunk.DiffFormatter(style);
		var actual = diff.getStyledDiff(stringA, stringB);

		var expPath = helper.getTmpPath('string', name + '.txt');
		mkdirp.sync(path.dirname(expPath), parseInt('0644', 8));
		fs.writeFileSync(expPath, actual, 'utf8');

		if (debug) {
			console.log('');
			console.log(new unfunk.DiffFormatter(ministyle.ansi()).getStyledDiff(stringA, stringB, '            '));
			console.log('');
		}

		var expected = fs.readFileSync(path.join('test', 'fixtures', 'string', name + '.txt'), 'utf8').replace(/\r\n/g, '\n');

		assert.strictEqual(actual, expected);
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	describe('strings', () => {
		it('should diff empty', () => {
			assertStringValueDiff('', '', 'empty', ministyle.plain());
		});
		it('should diff empty', () => {
			assertStringValueDiff('aa', '', 'aa-empty', ministyle.plain());
		});
		it('should diff empty', () => {
			assertStringValueDiff('', 'aa', 'empty-aa', ministyle.plain());
		});
		it('should diff same', () => {
			assertStringValueDiff('aaaa', 'aaaa', 'aaaa-aaaa', ministyle.plain());
		});
		it('should diff same', () => {
			assertStringValueDiff('aa aa', 'aa aa', 'aa-space-aa', ministyle.plain());
		});

		it('should diff aaaa/bbbb/cccc', () => {
			assertStringValueDiff('aaaacccc', 'bbbbcccc', 'aaaa-bbbb-cccc', ministyle.plain());
		});

		it('should diff aaaa/bbbb/cccc-dev', () => {
			assertStringValueDiff('aaaacccc', 'bbbbcccc', 'aaaa-bbbb-cccc-dev', ministyle.dev());
		});

		it('should diff hello a/b', () => {
			assertStringDiff('hello-a', 'hello-b', 'hello-diff-plain', ministyle.plain());
		});

		it('should diff aaaa/line/bbbb', () => {
			assertStringValueDiff('aaaa\naaaa\naaaa', 'aaab\naaab\naaab', 'aaaa-line', ministyle.plain());
		});

		it('should diff aaaa/line/bbbb', () => {
			assertStringValueDiff('aabb\n\nbaab\nabab', 'aaaa\naaaa\naaaa', 'aaaa-line-abab', ministyle.plain());
		});

		it('should diff lines a/b', () => {
			assertStringDiff('lines-a', 'lines-b', 'lines-diff-plain', ministyle.plain());
		});

		it('should diff medium a/b', () => {
			assertStringDiff('lorem-medium-a', 'lorem-medium-b', 'lorem-medium-diff-plain', ministyle.plain(), false);
		});
	});
});
