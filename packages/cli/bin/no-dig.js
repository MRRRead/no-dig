#!/usr/bin/env node

console.log(`
────────────────────────────────────────────
🚀 NO-DIG v1.0
SEO-First Business Websites from Obsidian
────────────────────────────────────────────
`);

const args = process.argv.slice(2);

if (args[0] === 'init') {
  console.log('🛠 Initializing new NO-DIG project...');
  // TODO: implement project scaffolding
} else if (args[0] === 'build') {
  console.log('🏗 Building site...');
  // TODO: invoke @no-dig/core + adapter
} else {
  console.log('Available commands: init | build');
}
