var jsGraph = require('../js-graph-dependency');

var simpleDirGraph = jsGraph.parseDir('test/fixtures/simple');
console.dir(simpleDirGraph, { depth: null });

// var simpleFileGraph = jsGraph.parseFile('test/fixtures/simple/index.js');
// console.dir(simpleFileGraph, { depth: null });
