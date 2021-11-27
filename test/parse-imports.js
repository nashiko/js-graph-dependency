var parseImports = require('../parse-imports');
var assert = require('chai').assert;

describe('parse-imports', function () {

  it('should parse single import with single quotes', function () {
    var str = 'import myDefault from \'module\';';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with double quotes', function () {
    var str = 'import myDefault from "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with extra spaces after import', function () {
    var str = 'import  myDefault  from  "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with extra spaces before ";"', function () {
    var str = 'import myDefault from "module"  ;';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with none ";"', function () {
    var str = 'import myDefault from "module"';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with using "as"', function () {
    var str = 'import * as name from "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with using bracket', function () {
    var str = 'import { export1 } from "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with using "as" in the bracket', function () {
    var str = 'import { export1 as alias1 } from "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with using "," in the bracket', function () {
    var str = 'import { export1 , export2 } from "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with using "as" and "," in the bracket', function () {
    var str = 'import { export1 , export2 as alias2 , [...] } from "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with using "as" and "," in the bracket', function () {
    var str = 'import { export1 , export2 as alias2 , [...] } from "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with using "default" and "as"', function () {
    var str = 'import defaultExport, * as name from "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with using "default" and bracket', function () {
    var str = 'import defaultExport, { export1 [ , [...] ] } from "module"';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with side effects only', function () {
    var str = 'import "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with in a valuable', function () {
    var str = 'var promise = import("module");';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import with multi line', function () {
    var str = 'import {\n' +
      'something\n' +
      '} from "module"';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single import of multiple rows with commas', function () {
    var str = 'import { export1 ,' +
      ' export2 as alias2 , [...] } from "module";';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse two individual imports', function () {
    var str = 'import myDefaultA from "moduleA" \n' +
      'import myDefaultB from "moduleB" \n';
    var result = parseImports(str);
    assert.deepEqual(['moduleA', 'moduleB'], result);
  });

  it('should not parse import in comment', function () {
    var str = '//var promise = import("module");';
    var result = parseImports(str);
    assert.deepEqual([], result);
  });

  it('should parse import when it has a comment at the end', function () {
    var str = 'var promise = import("module"); // comment';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should not parse import in comment', function () {
    var str = 'import myDefaultA from "moduleA"; \n' +
      '//import myDefaultB from "moduleB"; \n' +
      'import myDefaultC from "moduleC" // "moduleC"; \n' +
      '"moduleD"';
    var result = parseImports(str);
    assert.deepEqual(['moduleA', 'moduleC'], result);
  });

  it('should not parse import in any comment', function () {
    var str = '// import moduleA \n' +
      'import myDefaultA from "moduleA"; \n' +
      '\n' +
      '/** do not import moduleB, moduleC\n' +
      ' import myDefaultB from "moduleB";\n' +
      ' import myDefaultC from "moduleC";\n' +
      '*/\n' +
      '/*import moduleD*/ import myDefaultD from "moduleD"; /* do not import moduleF \n' +
      'import myDefaultD from "moduleF";' +
      '*/\n';
    var result = parseImports(str);
    assert.deepEqual(['moduleA', 'moduleD'], result);
  });

  it('should parse a full js file', function () {
    var str = '' +
      'import defaultExport from "moduleA";\n' +
      'import * as name from \'../moduleB\';\n' +
      'import { export1 } from "../nested/moduleC";\n' +
      'import { export1 as alias1 } from "moduleD";\n' +
      'import { export1 , export2 } from "moduleE";\n' +
      'import { export1 , export2 as alias2 , [...] } from "moduleF";\n' +
      'import defaultExport, { export1 [ , [...] ] } from "moduleG";\n' +
      'import defaultExport, * as name from "moduleH";\n' +
      'import "moduleI";\n' +
      'var promise = import("moduleJ");\n' +
      'import("moduleK");\n' +
      '\n' +
      'import {\n' +
      '  something\n' +
      '} from "moduleL"\n' +
      '/*\n' +
      'import {\n' +
      '  something\n' +
      '} from "moduleM"\n' +
      '*/\n' +
      'import{\n' +
      '  something, { export1 [ , [...] ] }\n' +
      '} from "moduleN"\n' +
      '\n' +
      'import{\n' +
      '  something, { \n' +
      '    export1 [ , [...] ] \n' +
      '  }\n' +
      '} from "moduleO"\n' +
      '\n' +
      'require("moduleP");';
    var result = parseImports(str);
    assert.deepEqual([
      'moduleA', '../moduleB', '../nested/moduleC', 'moduleD', 'moduleE', 'moduleF',
      'moduleG', 'moduleH', 'moduleI', 'moduleJ', 'moduleK', 'moduleL',
      'moduleN', 'moduleO', 'moduleP'
    ], result);
  });

  it('should parse single require with single quotes', function () {
    var str = 'require(\'module\');';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });

  it('should parse single require with double quotes', function () {
    var str = 'require("module");';
    var result = parseImports(str);
    assert.deepEqual(['module'], result);
  });
});
