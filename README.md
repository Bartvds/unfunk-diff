# unfunk-diff

[![Build Status](https://secure.travis-ci.org/Bartvds/unfunk-diff.png?branch=master)](http://travis-ci.org/Bartvds/unfunk-diff) [![Dependency Status](https://gemnasium.com/Bartvds/unfunk-diff.png)](https://gemnasium.com/Bartvds/unfunk-diff) [![NPM version](https://badge.fury.io/js/unfunk-diff.png)](http://badge.fury.io/js/unfunk-diff)

> Object & String diff formatter for all displays

## What?

Most diff renderers you'd find on npm (either object diff or string diffs) are not usable without colours. And then the object diffs usually lack a string diff representation which makes it difficult to spot subtle changes in string values deep in the objects structure. Unfunk-diff aims to integrate both to allow debugging of object difference.

* String-diff algorithm is [jsDiff](https://github.com/kpdecker/jsdiff). 
* Object-diff algorithm is [objectDiff](https://github.com/NV/objectDiff.js) with nested string-diff. May currently be even stricter then your assertions!
* Style output is [ministyle](https://github.com/Bartvds/ministyle), which bundles with plain text, ANSI and HTML /CSS output.

## Usage

Install from npm:

````
$ npm install unfunk-diff
```` 

## Build

Unfunk-diff is written in [TypeScript](http://typescript.com) and built using [grunt](http://gruntjs.com).

Install development dependencies in your git checkout:
````
$ npm install
````

You need the global [grunt](http://gruntjs.com) command:
````
$ npm install grunt-cli -g
````

Build and run tests:
````
// self test
$ grunt
````

See the `Gruntfile` for additional commands, including many mocha runners.

## Versions

* 0.0.1 - Extracted from [mocha-unfunk-reporter](https://github.com/Bartvds/mocha-unfunk-reporter)

## Credit

* String diff from [jsDiff](https://github.com/kpdecker/jsdiff) by Kevin Decker
* Object diff from [objectDiff](https://github.com/NV/objectDiff.js) by Nikita Vasilyev

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.