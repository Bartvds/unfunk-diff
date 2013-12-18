/// <reference path="_bootstrap.ts" />
/// <reference path="diff.ts" />

module unfunk {
	var ministyle = require('ministyle');

	export function ansi(valueA:any, valueB:any, maxWidth:number = 80):string {
		var formatter = new unfunk.DiffFormatter(ministyle.ansi(), maxWidth);
		return formatter.getStyledDiff(valueA, valueB);
	}

	export function plain(valueA:any, valueB:any, maxWidth:number = 80):string {
		var formatter = new unfunk.DiffFormatter(ministyle.plain(), maxWidth);
		return formatter.getStyledDiff(valueA, valueB);
	}
}

(module).exports = unfunk;
