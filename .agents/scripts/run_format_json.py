import os
import json

def format_json_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            content = f.read()
            if not content.strip():
                return False
            data = json.loads(content)
        
        # Jika data berupa list of dictionary, format tiap dictionary menjadi 1 baris
        # agar lebih ringkas (minify per item) seperti yang diminta.
        if isinstance(data, list) and all(isinstance(item, dict) for item in data):
            formatted = "[\n"
            for i, item in enumerate(data):
                # dump dict ke dalam 1 baris string
                item_str = json.dumps(item, ensure_ascii=False, separators=(', ', ': '))
                formatted += f"  {item_str}"
                if i < len(data) - 1:
                    formatted += ",\n"
                else:
                    formatted += "\n"
            formatted += "]"
        else:
            # Jika bukan list of dict, gunakan standard beautify dengan indent 2
            formatted = json.dumps(data, ensure_ascii=False, indent=2)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(formatted)
            
        return True
    except Exception as e:
        print(f"Error on {filepath}: {e}")
        return False

if __name__ == "__main__":
    json_files = []
    # Kumpulkan semua file JSON kecuali di folder yang tidak perlu
    for root, dirs, files in os.walk('.'):
        for d in ['.agents', '.git', 'node_modules']:
            if d in dirs:
                dirs.remove(d)
        for file in files:
            # Abaikan package.json karena biasa dikelola npm
            if file.endswith('.json') and file not in ['package.json', 'package-lock.json']:
                json_files.append(os.path.join(root, file))

    count = 0
    for path in json_files:
        if format_json_file(path):
            count += 1

    print(f"Successfully formatted {count} JSON files.")
