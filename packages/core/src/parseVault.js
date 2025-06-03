// @no-dig/core/src/parseVault.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

async function parseVault(vaultPath) {
  const pages = [];
  function walk(dir) {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (file.endsWith('.md')) {
        const raw = fs.readFileSync(full, 'utf8');
        const { data: frontmatter, content } = matter(raw);
        const rel = path.relative(vaultPath, full).replace(/\\/g, '/');
        const url = '/' + rel.replace(/\.md$/, '').replace(/index$/i, '');
        pages.push({ url, content, frontmatter });
      }
    }
  }
  walk(vaultPath);
  return pages;
}

module.exports = { parseVault };
