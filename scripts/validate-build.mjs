import fs from 'node:fs';

const requiredHtmlFiles = [
  'dist/index.html',
  'dist/politica/index.html',
  'dist/eleicoes/index.html',
  'dist/economia/index.html',
  'dist/estados/index.html',
  'dist/dados-publicos/index.html',
  'dist/noticias/index.html',
  'dist/sobre/index.html',
  'dist/404.html',
];

for (const filePath of requiredHtmlFiles) {
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: ${filePath} does not exist in build output!`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('/src/') || content.includes('main.tsx')) {
    console.error(`ERROR: ${filePath} contains uncompiled development references (/src/ or main.tsx)!`);
    process.exit(1);
  }

  if (filePath === 'dist/index.html' && !content.includes('./assets/')) {
    console.warn(`WARNING: ${filePath} does not contain ./assets/ references.`);
  }
}

// Verifica integridade do sitemap e robots.txt
if (!fs.existsSync('dist/sitemap.xml')) {
  console.error('ERROR: dist/sitemap.xml does not exist!');
  process.exit(1);
}
if (!fs.existsSync('dist/robots.txt')) {
  console.error('ERROR: dist/robots.txt does not exist!');
  process.exit(1);
}

console.log(`Build validation passed: All ${requiredHtmlFiles.length} pages, sitemap.xml and robots.txt are clean and production-ready.`);
