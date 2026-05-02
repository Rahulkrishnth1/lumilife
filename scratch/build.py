import re

with open(r'c:\Users\hp\Downloads\lumilife-secure.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove imports
content = re.sub(r'import\s+{[^}]+}\s+from\s+["\']react["\'];?', '', content)

# Remove export default
content = content.replace('export default function App()', 'function App()')

html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lumilife</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  <style>
    body {{ margin: 0; padding: 0; }}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const {{ useState, useRef, useCallback }} = React;
{content}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
"""

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html created successfully.")
