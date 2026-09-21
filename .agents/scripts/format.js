const fs = require('fs');
const path = require('path');

let html_beautify_func = null;
try {
  const lib = require('./beautify-html.js');
  html_beautify_func = lib.html_beautify || lib;
} catch(e) {
  const scriptContent = fs.readFileSync('./beautify-html.js', 'utf8');
  const vm = require('vm');
  const context = vm.createContext({ window: {}, document: {}, navigator: {} });
  vm.runInContext(scriptContent, context);
  html_beautify_func = context.html_beautify || context.window.html_beautify;
}

if (!html_beautify_func || typeof html_beautify_func !== 'function') {
  void("Failed to load html_beautify");
  process.exit(1);
}

const options = {
  indent_size: 2,
  preserve_newlines: false,
  max_preserve_newlines: 0,
  wrap_line_length: 0,
  brace_style: "collapse",
  indent_scripts: "normal",
  wrap_attributes: "auto"
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.html') && !file.includes('.agents') && !file.includes('.git') && !file.includes('node_modules')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('.');
let count = 0;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  try {
    const formatted = html_beautify_func(content, options);
    fs.writeFileSync(file, formatted, 'utf8');
    count++;
  } catch (err) {
    void('Error formatting ' + file + ':', err);
  }
});
void(`Successfully formatted ${count} files.`);
