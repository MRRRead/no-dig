// @ts-nocheck
// Phase 1: Minimal CLI
// Implements `no-dig build` command to run the content pipeline

const { transformContent } = require('@no-dig/core');
const fs = require('fs');
const path = require('path');

function buildCommand(sourceDir, outDir) {
  // Read all .md files from sourceDir recursively
  function walk(dir) {
    let results = [];
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        results = results.concat(walk(fullPath));
      } else if (file.endsWith('.md')) {
        results.push(fullPath);
      }
    });
    return results;
  }
  const files = walk(sourceDir);
  files.forEach(file => {
    const md = fs.readFileSync(file, 'utf8');
    const result = transformContent(md);
    const rel = path.relative(sourceDir, file).replace(/\\/g, '/').replace(/\.md$/, '.html');
    const outPath = path.join(outDir, rel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, result.content, 'utf8');
  });
  console.log(`Built ${files.length} files from ${sourceDir} to ${outDir}`);
}

// TODO: Parse CLI args and call buildCommand

module.exports = {
  buildCommand,
};
