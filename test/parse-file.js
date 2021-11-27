var assert = require('chai').assert;
var path = require('path');
var fixture = require('./util').fixture;
var graph = require('./util').graph;

describe('js-graph', function(){
  describe('parseFile', function () {

    describe('with a simple graph', function() {
      it('should return a graph', function() {
        graph().fromFixtureFile('simple')
          .assertDecendents([
            'b.js',
            path.join('nested', 'c.js'),
          ])
          .assertAncestors(path.join('nested', 'c.js'), [
            'b.js',
            'index.js',
          ])
          .assertAncestors('b.js', [
            'index.js',
          ])
          .assertAncestors('index.js', []);
      });
    });

    describe('with a simple graph ts file', function() {
      it('should return a graph', function() {
        graph().tsFile().fromFixtureFile('simple-ts')
          .assertDecendents([
            'b.ts',
            path.join('nested', 'c.ts'),
          ])
          .assertAncestors(path.join('nested', 'c.ts'), [
            'b.ts',
            'index.ts',
          ])
          .assertAncestors('b.ts', [
            'index.ts',
          ])
          .assertAncestors('index.ts', []);
      });
    });


    describe('with a graph with loadPaths', function() {
      it('should return a graph', function() {
        var includeFolder = 'inside-load-path';
        var excludeFolder = 'outside-load-path';
        var rootFolder = path.dirname(fixture('load-path')());
        var opts = { loadPaths: [ rootFolder, fixture('load-path')(includeFolder) ] };

        graph(opts).fromFixtureFile('load-path')
          .assertDecendents([
            path.join(includeFolder, 'b.js'),
            path.join(includeFolder, 'c.js'),
            'd.js',
          ])
          .assertAncestors(path.join('d.js'), [
            path.join(includeFolder, 'c.js'),
            path.join(includeFolder, 'b.js'),
            'index.js',
          ])
          .assertAncestors(path.join(includeFolder, 'c.js'), [
            path.join(includeFolder, 'b.js'),
            'index.js',
          ])
          .assertAncestors(path.join(includeFolder, 'b.js'), [
            'index.js',
          ])
          .assertAncestors('index.js', [])
          .assertAncestors(path.join(excludeFolder, 'b.js'), [])
          .assertAncestors(path.join(excludeFolder, 'c.js'), []);
      });

      it('should prioritize cwd', function() {
        var includeFolder = 'inside-load-path';
        var excludeFolder = 'outside-load-path';
        var opts = { loadPaths: [ fixture('load-path-cwd')(includeFolder) ] };

        graph(opts).fromFixtureFile('load-path-cwd').assertDecendents([
          'b.js',
          path.join(includeFolder, 'c.js'),
        ])
        .assertAncestors(path.join(includeFolder, 'c.js'), [
          'b.js',
          'index.js',
        ])
        .assertAncestors('b.js', [
          'index.js',
        ])
        .assertAncestors('index.js', [])
        .assertAncestors(path.join(includeFolder, 'b.js'), [])
        .assertAncestors(path.join(excludeFolder, 'b.js'), [])
        .assertAncestors(path.join(excludeFolder, 'c.js'), []);
      });
    });

    describe('with a folder that has an extension', function() {
      it('should return a graph', function () {
        var leaf = path.join('nested.js', 'leaf.js');
        graph().fromFixtureFile('folder-with-extension')
          .assertDecendents([leaf])
          .assertAncestors(leaf, ['index.js']);
      });
    });

    describe('with no imports', function() {
      it('should return a graph', function () {
        graph().fromFixtureFile('no-imports').assertDecendents([]);
      });
    });

    describe('when the file is inaccessible', function() {
      it('should thow an error', function () {
        assert.throws(function() {
          graph().fromFixtureFile('no-such-path');
        });
      });
    });

    describe('with options', function() {
      it('should not use inherited propterties', function() {
        before(function() {
          Array.prototype.foo = function() {};
        });

        after(function() {
          delete Array.prototype.foo;
        });

        assert.doesNotThrow(function() {
          graph().fromFixtureFile('no-imports').assertDecendents([]);
        });
      });
    });

    describe('with exclusion pattern', function() {
      it('should exclude all files matching the regular expression', function() {
        graph({ exclude: /exclude-/ })
          .fromFixtureFile('exclusion-pattern')
          .assertDecendents([
            'dont-exclude.js',
          ]);
      });
    });
  });
});
