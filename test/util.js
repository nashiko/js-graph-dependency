var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');
var jsGraph = require('..');

var fixtures = path.resolve(path.join('test', 'fixtures'));

var fixture = function(name) {
  return function(file) {
    if (!file) file = 'index.js';
    return path.join(fixtures, name, file);
  };
};

var graph = function(opts) {
  var instance, dir, isTsFile;

  function indexFile() {
    if (isTsFile) {
      return 'index.ts';
    }
    return 'index.js';
  }

  return  {
    tsFile: function() {
      isTsFile = true;
      return this;
    },

    fromFixtureDir: function(name) {
      dir = fixture(name);
      instance = jsGraph.parseDir(path.dirname(dir(indexFile())), opts);
      return this;
    },

    fromFixtureFile: function(name) {
      dir = fixture(name);
      instance = jsGraph.parseFile(dir(indexFile()), opts);
      return this;
    },

    assertDecendents: function(expected) {
      var actual = [];

      instance.visitDescendents(dir(indexFile()), function(imp) {
        actual.push(imp);
      });

      assert.deepEqual(expected.map(dir), actual);
      return this;
    },

    assertAncestors: function(file, expected) {
      var actual = [];

      instance.visitAncestors(dir(file), function(imp) {
        actual.push(imp);
      });

      assert.deepEqual(expected.map(dir), actual);
      return this;
    },
  };
};

module.exports.fixture = fixture;
module.exports.graph = graph;
