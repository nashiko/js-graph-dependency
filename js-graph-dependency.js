'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var parseImports = require('./parse-imports');

// resolve a js module to a path
function resolveJsPath(filePath, loadPaths, extensions) {
  // trim sass file extensions
  var re = new RegExp('(\.('+extensions.join('|')+'))$', 'i');
  var jsPathName = filePath.replace(re, '');
  // check all load paths
  var i, j, length = loadPaths.length, jsPath, partialPath;
  for (i = 0; i < length; i++) {
    for (j = 0; j < extensions.length; j++) {
      jsPath = path.normalize(loadPaths[i] + '/' + jsPathName + '.' + extensions[j]);
      try {
        if (fs.lstatSync(jsPath).isFile()) {
          return jsPath;
        }
      } catch (e) {}
    }
  }

  // File to import not found or unreadable so we assume this is a custom import
  return false;
}

function Graph(options, dir) {
  this.dir = dir;
  this.extensions = options.extensions || [];
  this.exclude = options.exclude instanceof RegExp ? options.exclude : null;
  this.index = {};
  this.follow = options.follow || false;
  this.loadPaths = _(options.loadPaths).map(function(p) {
    return path.resolve(p);
  }).value();

  if (dir) {
    var graph = this;
    _.each(glob.sync(dir+'/**/*.@('+this.extensions.join('|')+')', { dot: true, nodir: true, follow: this.follow }), function(file) {
      try {
        graph.addFile(path.resolve(file));
      } catch (e) {}
    });
  }
}

// add a sass file to the graph
Graph.prototype.addFile = function(filepath, parent) {
  if (this.exclude !== null && this.exclude.test(filepath)) return;

  var entry = this.index[filepath] = this.index[filepath] || {
    imports: [],
    importedBy: [],
    modified: fs.statSync(filepath).mtime
  };

  var resolvedParent;
  var imports = parseImports(fs.readFileSync(filepath, 'utf-8'));
  var cwd = path.dirname(filepath);

  var i, length = imports.length, loadPaths, resolved;
  for (i = 0; i < length; i++) {
    loadPaths = _([cwd, this.dir]).concat(this.loadPaths).filter().uniq().value();
    resolved = resolveJsPath(imports[i], loadPaths, this.extensions);
    if (!resolved) continue;

    // check exclcude regex
    if (this.exclude !== null && this.exclude.test(resolved)) continue;

    // recurse into dependencies if not already enumerated
    if (!_.includes(entry.imports, resolved)) {
      entry.imports.push(resolved);
      this.addFile(fs.realpathSync(resolved), filepath);
    }
  }

  // add link back to parent
  if (parent) {
    resolvedParent = _(parent).intersection(this.loadPaths).value();

    if (resolvedParent) {
      resolvedParent = parent.substr(parent.indexOf(resolvedParent));
    } else {
      resolvedParent = parent;
    }

    // check exclude regex
    if (!(this.exclude !== null && this.exclude.test(resolvedParent))) {
      entry.importedBy.push(resolvedParent);
    }
  }
};

// visits all files that are ancestors of the provided file
Graph.prototype.visitAncestors = function(filepath, callback) {
  this.visit(filepath, callback, function(err, node) {
    if (err || !node) return [];
    return node.importedBy;
  });
};

// visits all files that are descendents of the provided file
Graph.prototype.visitDescendents = function(filepath, callback) {
  this.visit(filepath, callback, function(err, node) {
    if (err || !node) return [];
    return node.imports;
  });
};

// a generic visitor that uses an edgeCallback to find the edges to traverse for a node
Graph.prototype.visit = function(filepath, callback, edgeCallback, visited) {
  filepath = fs.realpathSync(filepath);
  var visited = visited || [];
  if (!this.index.hasOwnProperty(filepath)) {
    edgeCallback('Graph doesn\'t contain ' + filepath, null);
  }
  var edges = edgeCallback(null, this.index[filepath]);

  var i, length = edges.length;
  for (i = 0; i < length; i++) {
    if (!_.includes(visited, edges[i])) {
      visited.push(edges[i]);
      callback(edges[i], this.index[edges[i]]);
      this.visit(edges[i], callback, edgeCallback, visited);
    }
  }
};

function processOptions(options) {
  return Object.assign({
    loadPaths: [process.cwd()],
    extensions: ['js', 'ts'],
  }, options);
}

module.exports.parseFile = function(filepath, options) {
  if (fs.lstatSync(filepath).isFile()) {
    filepath = path.resolve(filepath);
    options = processOptions(options);
    var graph = new Graph(options);
    graph.addFile(filepath);
    return graph;
  }
  // throws
};

module.exports.parseDir = function(dirpath, options) {
  if (fs.lstatSync(dirpath).isDirectory()) {
    dirpath = path.resolve(dirpath);
    options = processOptions(options);
    var graph = new Graph(options, dirpath);
    return graph;
  }
  // throws
};
