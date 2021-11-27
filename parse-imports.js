const jsTokens = require('js-tokens');

const parse = content => {
  const tokens = Array.from(jsTokens(content));
  let hasImport = false;
  let results = [];

  tokens.forEach((v, i)=>{
    //console.log('Line:', v);

    if(['SingleLineComment', 'MultiLineComment'].includes(v.type)) return;

    if(!hasImport && v.type === 'IdentifierName' && ['import', 'require'].includes(v.value)){
      hasImport = true;
      return;
    }

    if(hasImport && v.type === 'StringLiteral'){
      //console.log('Push:', v.value);
      results.push(v.value.replace(/["']/g, ''));
      hasImport = false;
    }

  });

  //console.log('Result:', results);

  return results;
};

module.exports = parse;
