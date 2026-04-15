import os
import re

files_to_check = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.astro', '.css', '.js', '.ts', '.md')):
            files_to_check.append(os.path.join(root, file))

for path in files_to_check:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    # Replace Tailwind arbitrary classes
    new_content = new_content.replace('text-[#667eea]', 'text-accent')
    new_content = new_content.replace('bg-[#667eea]', 'bg-accent')
    new_content = new_content.replace('border-[#667eea]', 'border-accent')
    
    # Replace hover and prose arbitrary classes
    new_content = new_content.replace('hover:text-[#667eea]', 'hover:text-accent')
    new_content = new_content.replace('prose-a:text-[#667eea]', 'prose-a:text-accent')
    new_content = new_content.replace('prose-pre:border-[#667eea]', 'prose-pre:border-accent')
    new_content = new_content.replace('prose-blockquote:border-[#667eea]', 'prose-blockquote:border-accent')
    
    # Replace specific strings
    new_content = new_content.replace('<span style="color:#667eea">', '<span class="text-accent">')
    
    # Replace the remaining literal colors (except in the global.css declaration and selection)
    if not path.endswith('global.css') and not path.endswith('replace_colors.py'):
        # For CSS/inline styles in graph.astro and graph-renderer.js
        new_content = new_content.replace('#667eea88', 'color-mix(in srgb, var(--color-accent) 53%, transparent)')
        new_content = new_content.replace('rgba(102,126,234,0.45)', 'color-mix(in srgb, var(--color-accent) 45%, transparent)')
        
        # Now handle literal '#667eea'
        new_content = new_content.replace("'#667eea'", "getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#667eea'")
        new_content = new_content.replace('background:#667eea;', 'background:var(--color-accent);')
        new_content = new_content.replace('color: #667eea;', 'color: var(--color-accent);')
        
    if content != new_content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {path}")
