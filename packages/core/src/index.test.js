// @no-dig/core/src/index.test.js
const { buildSite } = require('./index');
const path = require('path');

describe('buildSite integration', () => {
  it('runs the full build pipeline with plugins and adapter', async () => {
    const calls = [];
    const plugins = [
      { name: 'test-plugin',
        onBuildStart: ctx => calls.push('onBuildStart'),
        onVaultParsed: ctx => calls.push('onVaultParsed'),
        onPageGenerated: ctx => calls.push('onPageGenerated'),
        onBuildEnd: ctx => calls.push('onBuildEnd')
      }
    ];
    const vaultPath = path.join(__dirname, '../../adapter-11ty/test-fixtures/sample-vault');
    let adapterCalled = false;
    const adapter = {
      async generateSite(pages, outputDir) {
        adapterCalled = true;
        expect(Array.isArray(pages)).toBe(true);
        expect(outputDir).toBeDefined();
      }
    };
    await buildSite({ plugins, vaultPath, adapter });
    expect(adapterCalled).toBe(true);
    expect(calls).toEqual([
      'onBuildStart',
      'onVaultParsed',
      // onPageGenerated called for each page (at least 1)
      ...Array(calls.length - 3).fill('onPageGenerated'),
      'onBuildEnd'
    ]);
  });
});
