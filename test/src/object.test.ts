/// <reference path="../helper.ts" />

describe('string diff', () => {

    var fs = require('fs');
    var path = require('path');
	var mkdirp = require('mkdirp');
    var ministyle = <MiniStyle> require('ministyle');
	var assert:Chai.Assert = require('chai').assert;

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	function assertObjDiff(prefix:string, name:string, objA, objB, style:MiniStyle.Style, debug:boolean = true) {
		var diff = new unfunk.DiffFormatter(style);
		var actual = diff.getStyledDiff(objA, objB);

		var expPath = path.join('test', 'tmp', prefix, name + '.txt');
		mkdirp.sync(path.dirname(expPath), parseInt('0644', 8));
		fs.writeFileSync(expPath, actual, 'utf8');

		if (debug) {
			console.log('');
            console.log(new unfunk.DiffFormatter(ministyle.ansi()).getStyledDiff(objA, objB, '            '));
			console.log('');
		}

		var expected = fs.readFileSync(path.join('test', 'fixtures', prefix, name + '.txt'), 'utf8').replace(/\r\n/g, '\n');
		assert.strictEqual(actual, expected);
	}

	function testObjDiff(prefix:string, label:string, objA, objB, debug:boolean = true) {
		label = label.replace(/ /g, '-');
		describe(prefix + ' ' + label, () => {
			it('should diff ' + prefix + ' / ' + label + '', () => {
				assertObjDiff(prefix, label, objA, objB, ministyle.plain(), debug);
			});
		});
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	describe('bad values', () => {
		it('should return on bad values', () => {
			var diff = new unfunk.DiffFormatter(ministyle.plain());
			assert.strictEqual(diff.getStyledDiff(null, null), '', 'null-null');
			assert.strictEqual(diff.getStyledDiff(null, 'aaa'), '', 'null-aaa');
			assert.strictEqual(diff.getStyledDiff('aaa', null), '', 'aaa-null');

			assert.strictEqual(diff.getStyledDiff({}, 'aaa'), '', 'obj-aaa');
			assert.strictEqual(diff.getStyledDiff('aaa', {}), '', 'aaa-obj');
			assert.strictEqual(diff.getStyledDiff('aaa', function() {}), '', 'aaa-func');
			assert.strictEqual(diff.getStyledDiff(function() {}, function() {}), '', 'func-func');
		});
	});

	describe('nested string', () => {
		it('should diff nested multiline a/b', () => {
			var objA = {
				nested: {
					aa: 'aaab'
				},
				lines: fs.readFileSync(path.join('test', 'fixtures', 'big', 'lines-a.txt'), 'utf8')
			};
			var objB = {
				nested: {
					aa: 'abaa'
				},
				lines: fs.readFileSync(path.join('test', 'fixtures', 'big', 'lines-b.txt'), 'utf8')
			};
			assertObjDiff('nested', 'multiline-diff-plain', objA, objB, ministyle.plain());
		});
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	describe('variations', () => {
		var all = {
			name: 'all',
			propA: 'valueA',
			propB: 'valueB',
			subA: {
				nestA: 'childA',
				nestB: 'childB',
				subA: {
					nestA: 'childA',
					nestB: 'childB'
				}
			},
			subB: {
				nestA: 'childA',
				nestB: 'childB',
				subA: {
					nestA: 'childA',
					nestB: 'childB'
				}
			}
		};

		var someA = {
			name: 'someA',
			propA: 'valueA',
			subA: {
				nestA: 'childA',
				subA: {
					nestA: 'childA'
				}
			}
		};

		var badA = {
			name: 'badA',
			propA: 'valueB',
			subA: {
				nestA: 'childB',
				subA: {
					nestA: 'childB',
					nestB: 'valueA'
				}
			}
		};

		testObjDiff('basic', 'all', all, all);

		testObjDiff('basic', 'someA vs all', someA, all);
		testObjDiff('basic', 'all vs someA', all, someA);

		testObjDiff('basic', 'someA vs badA', someA, badA);
		testObjDiff('basic', 'badA vs someA', badA, someA);
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	describe('props with special characters', () => {

		var namesA = {
			name: 'namesA',
			'ü\tspecial \n©\\♥': ['xxx'],
			'space out': ['xxx']
		};

		var namesB = {
			name: 'namesB',
			'ü\tspecial \n©\\♥': ['zzz'],
			'space out': ['zzz']
		};

		var namesC = {
			name: 'namesC'
		};

		testObjDiff('props', 'namesA vs namesA', namesA, namesA);

		testObjDiff('props', 'namesA vs namesB', namesA, namesB);
		testObjDiff('props', 'namesB vs namesA', namesB, namesA);

		testObjDiff('props', 'namesA vs namesC', namesA, namesC);
		testObjDiff('props', 'namesC vs namesA', namesC, namesA);
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	describe('values with special characters', () => {

		var objA = {
			name: 'objA',
			propA: 'ü\tspecial\\A \n©♥',
			escA: 'x\\xü'
		};

		var objB = {
			name: 'objB',
			propA: 'ü\tspecial\\B \n©♥',
			escA: 'x\\x\xFC'
		};

		var objC = {
			name: 'objC'
		};

		testObjDiff('values', 'objA vs objA', objA, objA);

		testObjDiff('values', 'objA vs objB', objA, objB);
		testObjDiff('values', 'objB vs objA', objB, objA);

		testObjDiff('values', 'objA vs objC', objA, objC);
		testObjDiff('values', 'objC vs objA', objC, objA);
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	describe('array values', () => {

		var objA = [
			'aa',
			'bb',
			'dd'
		];

		var objB = [
			'bb',
			'cc',
			'dd',
			'ee'
		];

		testObjDiff('array', 'objA vs objA', objA, objA);

		testObjDiff('array', 'objA vs objB', objA, objB);
		testObjDiff('array', 'objB vs objA', objB, objA);
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	describe('array with empty leading elements', () => {

		var objA = [
			'',
			'\n',
			'b',
			'\n',
			'cc'
		];

		var objB = [
			'a',
			'',
			'bb',
			'',
			'ccc',
			''
		];

		testObjDiff('array-empty', 'objA vs objA', objA, objA);

		testObjDiff('array-empty', 'objA vs objB', objA, objB);
		testObjDiff('array-empty', 'objB vs objA', objB, objA);
	});
});
