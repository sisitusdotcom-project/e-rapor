import os
from py_mini_racer import MiniRacer

# JS Beautifier
ctx_js = MiniRacer()
with open('.agents/scripts/beautify.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

setup_code = """
var window = this;
var global = this;
var navigator = { userAgent: "Node" };
"""
ctx_js.eval(setup_code)
ctx_js.eval(js_code)

options_js = {
  "indent_size": 2,
  "preserve_newlines": False,
  "max_preserve_newlines": 0,
  "wrap_line_length": 0,
  "brace_style": "collapse",
  "end_with_newline": False
}

# CSS Beautifier
ctx_css = MiniRacer()
with open('.agents/scripts/beautify-css.js', 'r', encoding='utf-8') as f:
    css_code = f.read()

ctx_css.eval(setup_code)
ctx_css.eval(css_code)

options_css = {
  "indent_size": 2,
  "preserve_newlines": False,
  "end_with_newline": False
}

js_files = []
css_files = []

for root, dirs, files in os.walk('.'):
    for d in ['.agents', '.git', 'node_modules']:
        if d in dirs:
            dirs.remove(d)
    for file in files:
        if file.endswith('.js') and not file.endswith('1.js') and file != 'format.js':
            js_files.append(os.path.join(root, file))
        elif file.endswith('.css') and not file.endswith('1.css'):
            css_files.append(os.path.join(root, file))

count_js = 0
for path in js_files:
    try:
        with open(path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        formatted = ctx_js.call('js_beautify', content, options_js)
        formatted = formatted.lstrip()  # trim leading blank lines
        with open(path, 'w', encoding='utf-8') as f:
            f.write(formatted)
        count_js += 1
    except Exception as e:
        print(f"Error on {path}: {e}")

count_css = 0
for path in css_files:
    try:
        with open(path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        formatted = ctx_css.call('css_beautify', content, options_css)
        formatted = formatted.lstrip()  # trim leading blank lines
        with open(path, 'w', encoding='utf-8') as f:
            f.write(formatted)
        count_css += 1
    except Exception as e:
        print(f"Error on {path}: {e}")

print(f"Successfully formatted {count_js} JS files and {count_css} CSS files.")
