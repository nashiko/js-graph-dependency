const regex = /(?:import|require)[\s({]*(?:[\w*\s{}\[\].,$]*from\s+)?["'\s](.+?)["'\s].*(?:\s+|\)?);?/g;

const parse = content => {
  let match = [];
  let results = [];
  while ((match = regex.exec(content)) !== null) {
    results.push(match[1]);
  }

  return results;
};

module.exports = {
  parse: parse,
  regex: regex
};
