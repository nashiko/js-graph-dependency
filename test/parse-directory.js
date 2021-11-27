var path = require('path');
var graph = require('./util').graph;

describe('js-graph', function(){
  describe('parseDir', function () {

    describe('with a simple graph', function() {
      it('should return a graph', function() {
        graph().fromFixtureDir('simple').assertDecendents([
          'b.js',
          path.join('nested', 'c.js'),
        ]);
      });
    });

    describe('with mutliple ancestors', function() {
      it('should return a graph', function() {
        graph().fromFixtureDir('mutliple-ancestors').assertAncestors('leaf.js', [
          'entry_a.js',
          'entry_b.js',
          'entry_c.js',
          'entry_d.js',
        ]);
      });
    });
  });
});
