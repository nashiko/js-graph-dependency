# JS Graph Dependency

Parses JavaScript files in a directory and exposes a graph of dependencies.

Build a JS Graph of dependencies of files using:
```
import defaultExport from "moduleA";
import * as name from '../moduleB';
import { export1 } from "../nested/moduleC";
import { export1 as alias1 } from "moduleD";
import { export1 , export2 } from "moduleE";
import { foo , bar } from "module-name/path/to/specific/un-exported/file";
import { export1 , export2 as alias2 , [...] } from "moduleF";
import defaultExport, { export1 [ , [...] ] } from "moduleG";
import defaultExport, * as name from "moduleH";
import "moduleI";
var promise = import("moduleJ");
import("moduleK");

import {
  something
} from "./moduleL"
/*
import {
  something
} from "./moduleM"
*/
import{
  something, { export1 [ , [...] ] }
} from "./moduleN"

import{
  something, { 
    export1 [ , [...] ] 
  }
} from "./moduleO"

require("moduleP");
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
  -I, --load-path   Add directories to the js load path
  -e, --extensions  File extensions to include in the graph
  -j, --json        Output the index in json
  -h, --help        Show help
  -v, --version     Show version number

Examples:
  $ ./bin/jsgraph ancestors test test/fixtures/simple/nested/c.js
  /path/to/test/fixtures/simple/b.js
  /path/to/test/fixtures/simple/index.js
  
  $ ./bin/jsgraph descendents test test/fixtures/simple/index.js
  /path/to/test/fixtures/simple/b.js
  /path/to/test/fixtures/simple/nested/c.js
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

Directories to use when resolved `import` or `require` directives.

#### extensions

Type: `Array`
Default: `['js', 'ts']`

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
Example run command `$ node ./example/index.js`
See `example/index.js`
```
var jsGraph = require('./js-graph-dependency');
console.dir(jsGraph.parseDir('test/fixtures/simple'));

//{ index: {,
//    '/path/to/test/fixtures/simple/b.js': {
//        imports: ['simple/nested/c.js'],
//        importedBy: ['simple/index.js'],
//    },
//    '/path/to/test/fixtures/simple/nested/c.js': {
//        imports: [''],
//        importedBy: ['simple/b.js'],
//    },
//    '/path/to/test/fixtures/simple/index.js': {
//        imports: ['simple/b.js'],
//        importedBy: [],
//    },
//}}
```

## License

MIT
