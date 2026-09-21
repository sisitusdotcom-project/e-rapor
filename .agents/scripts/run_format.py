import os
from py_mini_racer import MiniRacer

ctx = MiniRacer()
with open('.agents/scripts/beautify-html.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

setup_code = """
var window = this;
var global = this;
var navigator = { userAgent: "Node" };
"""
ctx.eval(setup_code)
ctx.eval(js_code)

options = {
  "indent_size": 2,
  "preserve_newlines": False,
  "max_preserve_newlines": 0,
  "wrap_line_length": 0,
  "brace_style": "collapse",
  "indent_scripts": "normal",
  "wrap_attributes": "auto",
  "end_with_newline": False
}

html_files = []
for root, dirs, files in os.walk('.'):
    for d in ['.agents', '.git', 'node_modules']:
        if d in dirs:
            dirs.remove(d)
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

count = 0
for path in html_files:
    try:
        with open(path, 'r', encoding='utf-8-sig') as f:  # utf-8-sig auto-strips BOM on read
            content = f.read()
        formatted = ctx.call('html_beautify', content, options)
        formatted = formatted.lstrip()  # trim leading blank lines
        with open(path, 'w', encoding='utf-8') as f:  # write without BOM
            f.write(formatted)
        count += 1
    except Exception as e:
        print(f"Error on {path}: {e}")

print(f"Successfully formatted {count} HTML files using mini-racer and beautify-html.js.")
