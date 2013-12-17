/// <reference path="_bootstrap.ts" />

module unfunk {

	var jsesc = require('jsesc');

	var escapableExp = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var meta = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"': '\\"',
		'\\': '\\\\'
	};
	var jsonNW = {
		json: true,
		wrap: false,
		quotes: 'double'
	};

	// JSON escape: https://github.com/douglascrockford/JSON-js/blob/master/json2.js#L211
	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape sequences.
	export function escape(str:string):string {
		escapableExp.lastIndex = 0;
		if (escapableExp.test(str)) {
			return str.replace(escapableExp, function (a) {
				var c = meta[a];
				if (typeof c === 'string') {
					return c;
				}
				//return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				return jsesc(a, jsonNW);
			});
		}
		return str;
	}
}
