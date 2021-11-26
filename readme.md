# JS Graph Dependency

Parses JavaScript files in a directory and exposes a graph of dependencies.

Build a JS Graph of dependencies of files using:
```
Regex Test: https://regex101.com/
Regex Code: parse-imports.js

import defaultExport from "module-name";
import * as name from 'module-name';
import { export1 } from "module-name";
import { export1 as alias1 } from "module-name";
import { export1 , export2 } from "module-name";
import { foo , bar } from "module-name/path/to/specific/un-exported/file";
import { export1 , export2 as alias2 , [...] } from "module-name";
import defaultExport, { export1 [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name";
var promise = import("module-name");
import("module-name");

import $ as name from "module-name";

import {
  something
} from "./test/okbb"

import{
  something
} from "./test/okbb"


require("module-name");
```

## Install
Install with npm
```
npm install --save-dev @nashiko/js-graph-dependency
```


## Usage

Usage as a Node library:

```js
var jsGraph = require('@nashiko/js-graph-dependency');
```

Usage as a command line tool:

The command line tool will parse a graph and then either display ancestors, descendents or both.

```
$ ./bin/jsgraph --help
Usage: bin/jsgraph <command> [options] <dir> [file]

Commands:
  ancestors    Output the ancestors
  descendents  Output the descendents

Options:
  -I, --load-path   Add directories to the sass load path
  -e, --extensions  File extensions to include in the graph
  -j, --json        Output the index in json
  -h, --help        Show help
  -v, --version     Show version number

Examples:
  $ ./bin/jsgraph ancestors test test/fixtures/simple/nested/_d.js
  /path/to/test/fixtures/simple/nested/c.js
  /path/to/test/fixtures/simple/_b.js
  /path/to/test/fixtures/simple/a.js
  /path/to/test/fixtures/simple/index.js
  
  $ ./bin/jsgraph descendents test test/fixtures/simple/index.js
  /path/to/test/fixtures/simple/a.js
  /path/to/test/fixtures/simple/_b.js
  /path/to/test/fixtures/simple/nested/c.js
  /path/to/test/fixtures/simple/nested/_d.js
```

## API

#### parseDir

Parses a directory and builds a dependency graph of all requested file extensions.

#### parseFile

Parses a file and builds its dependency graph.

## Options

#### loadPaths

Type: `Array`
Default: `[process.cwd]`

Directories to use when resolved `@import` directives.

#### extensions

Type: `Array`
Default: `['scss', 'sass']`

File types to be parsed.

#### follow

Type: `Boolean`
Default: `false`

Follow symbolic links.

#### exclude

Type: `RegExp`
Default: `undefined`

Exclude files matching regular expression.

## Example
See `test/index.js`.
```js
var jsGraph = require('./js-graph-dependency');
console.dir(jsGraph.parseDir('test/fixtures/simple'));

//{ index: {,
//    '/path/to/test/fixtures/a.js': {
//        imports: ['b.js'],
//        importedBy: [],
//    },
//    '/path/to/test/fixtures/b.js': {
//        imports: ['_c.js'],
//        importedBy: ['a.js'],
//    },
//    '/path/to/test/fixtures/_c.js': {
//        imports: [],
//        importedBy: ['b.js'],
//    },
//}}
```

## License

MIT
