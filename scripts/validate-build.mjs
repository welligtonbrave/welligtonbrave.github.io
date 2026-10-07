import fs from 'node:fs';

const htmlPath = 'dist/index.html';
if (!fs.existsSync(htmlPath)) {
  console.error('ERROR: dist/index.html does not exist!');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');

if (html.includes('/src/') || html.includes('main.tsx')) {
  console.error('ERROR: dist/index.html contains development references (/src/ or main.tsx)!');
  process.exit(1);
}

if (!html.includes('./assets/')) {
  console.error('WARNING: dist/index.html does not contain ./assets/ references.');
}

console.log('Build validation passed: dist/index.html is clean and production-ready.');
