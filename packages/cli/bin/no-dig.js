#!/usr/bin/env node

console.log(`
────────────────────────────────────────────
🚀 NO-DIG v1.0
SEO-First Business Websites from Obsidian
────────────────────────────────────────────
`);

const args = process.argv.slice(2);
const { buildCommand } = require('../../cli/src/index');
const path = require('path');

if (args[0] === 'init') {
  console.log('🛠 Initializing new NO-DIG project...');
  // TODO: implement project scaffolding
} else if (args[0] === 'build') {
  console.log('🏗 Building site...');
  // Use 11ty via buildCommand
  const sourceDir = path.resolve(__dirname, '../../adapter-11ty/test-fixtures/sample-vault');
  const outDir = path.resolve(__dirname, '../../adapter-11ty/_site');
  buildCommand(sourceDir, outDir);
  console.log('✨ Build complete');
} else {
  console.log('Available commands: init | build');
}
