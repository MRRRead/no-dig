// @no-dig/core/src/parseVault.test.js
const { parseVault } = require('./parseVault');
const fs = require('fs');
const path = require('path');

describe('parseVault', () => {
  it('parses a directory of markdown files into pages', async () => {
    const vaultPath = path.join(__dirname, '../../adapter-11ty/test-fixtures/sample-vault');
    const pages = await parseVault(vaultPath);
    expect(Array.isArray(pages)).toBe(true);
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      expect(page).toHaveProperty('url');
      expect(page).toHaveProperty('content');
      expect(page).toHaveProperty('frontmatter');
    }
  });

  it('extracts frontmatter and markdown content', async () => {
    const vaultPath = path.join(__dirname, '../../adapter-11ty/test-fixtures/sample-vault');
    const pages = await parseVault(vaultPath);
    const home = pages.find(p => p.url.toLowerCase().includes('home'));
    expect(home.frontmatter).toHaveProperty('title');
    expect(home.content).toMatch(/Welcome/);
  });
});
