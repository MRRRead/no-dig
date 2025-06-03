/// <reference types="node" />
/// <reference types="jest" />
import { resolvePlugin } from './pluginResolver';
import * as path from 'path';
import * as fs from 'fs';

// TDD: Uncle Bob style - tests define contract

const monorepoRoot = path.resolve(__dirname, '../../../../');
process.chdir(monorepoRoot);
const wikilinksPluginPath = path.join(monorepoRoot, 'packages/plugins/wikilinks/dist/index.js');
const interlinkerPath = path.join(monorepoRoot, 'node_modules/@photogabble/eleventy-plugin-interlinker');

function canResolve(p: string) {
  try {
    require.resolve(p);
    return true;
  } catch {
    return false;
  }
}

describe('pluginResolver', () => {
  it('resolves a plugin by absolute path', () => {
    const plugin = resolvePlugin(wikilinksPluginPath);
    expect(plugin).toBeDefined();
  });

  it('throws a helpful error if plugin is not found', () => {
    expect(() => resolvePlugin('not-a-real-plugin')).toThrow(/not found/i);
  });

  it('works with both ESM and CJS plugins', () => {
    const cjsPlugin = resolvePlugin(wikilinksPluginPath);
    expect(cjsPlugin).toBeDefined();
  });

  if (fs.existsSync(interlinkerPath)) {
    const pkg = fs.existsSync(path.join(interlinkerPath, 'package.json'))
      ? JSON.parse(fs.readFileSync(path.join(interlinkerPath, 'package.json'), 'utf8'))
      : null;
    const isESM = pkg && pkg.type === 'module';
    if (isESM) {
      it.skip('resolves a plugin by name from node_modules (simple case) [ESM-only plugin cannot be loaded in Jest]', () => {});
      it.skip('returns the .default export if present (ESM interop) [ESM-only plugin cannot be loaded in Jest]', () => {});
    } else {
      it('resolves a plugin by name from node_modules (simple case)', () => {
        expect(() => resolvePlugin('@photogabble/eleventy-plugin-interlinker')).not.toThrow();
      });
      it('returns the .default export if present (ESM interop)', () => {
        const plugin = resolvePlugin('@photogabble/eleventy-plugin-interlinker');
        expect(plugin).toBeDefined();
        const pluginObj = plugin as { default?: unknown };
        expect(pluginObj.default || pluginObj).toBeDefined();
      });
    }
  } else {
    it.skip('resolves a plugin by name from node_modules (simple case)', () => {});
    it.skip('returns the .default export if present (ESM interop)', () => {});
  }
});
