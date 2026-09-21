import os
import re

def strip_html_comments(content):
    # Match <!-- ... --> but keep if it contains BLOG_INJECT
    def replacer(match):
        text = match.group(0)
        if 'BLOG_INJECT' in text:
            return text
        return ''
    return re.sub(r'<!--[\s\S]*?-->', replacer, content)

def strip_js_css_json_comments(content):
    lines = content.split('\n')
    new_lines = []
    in_block_comment = False
    
    for line in lines:
        stripped = line.strip()
        
        # Di dalam block comment
        if in_block_comment:
            if '*/' in line:
                in_block_comment = False
                after_comment = line[line.find('*/') + 2:].strip()
                if after_comment:
                    new_lines.append(after_comment)
            continue
            
        # Memulai block comment
        if stripped.startswith('/*'):
            if '*/' in stripped:
                after_comment = line[line.find('*/') + 2:].strip()
                if after_comment:
                    new_lines.append(after_comment)
            else:
                in_block_comment = True
            continue
            
        # Komentar sebaris
        if stripped.startswith('//'):
            continue
            
        # Komentar sebaris di akhir baris
        if '//' in line:
            line = re.sub(r'(?<!:)//.*$', '', line).rstrip()
        
        new_lines.append(line)
        
    return '\n'.join(new_lines)

if __name__ == "__main__":
    count_html = 0
    count_other = 0
    
    for root, dirs, files in os.walk('.'):
        for d in ['.agents', '.git', 'node_modules']:
            if d in dirs:
                dirs.remove(d)
                
        for file in files:
            filepath = os.path.join(root, file)
            ext = os.path.splitext(file)[1].lower()
            
            if ext not in ['.html', '.js', '.css', '.json']:
                continue
                
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception:
                try:
                    with open(filepath, 'r', encoding='utf-8-sig') as f:
                        content = f.read()
                except Exception:
                    continue
            
            original_content = content
            
            if ext == '.html':
                content = strip_html_comments(content)
                if content != original_content:
                    count_html += 1
            else:
                content = strip_js_css_json_comments(content)
                if content != original_content:
                    count_other += 1
                
            if content != original_content:
                # Remove multiple blank lines that might be left over
                content = re.sub(r'\n\s*\n', '\n\n', content)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

    print(f"Successfully stripped comments from {count_html} HTML files and {count_other} JS/CSS/JSON files.")
