import * as path from 'path';
import * as fs from 'fs';

function getMonorepoRoot(): string {
  let dir = process.cwd();
  while (!fs.existsSync(path.join(dir, 'package.json')) || !fs.existsSync(path.join(dir, 'packages'))) {
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return dir;
}

function getErrorMessage(e: unknown): string {
  if (
    e &&
    typeof e === 'object' &&
    'message' in e &&
    typeof (e as { message?: string }).message === 'string'
  ) {
    return (e as { message: string }).message;
  }
  return String(e);
}

/**
 * Resolves a plugin by name or path, handling ESM/CJS interop and monorepo quirks.
 * Throws a helpful error if not found.
 * Returns the plugin module (default export if present).
 */
export function resolvePlugin(pluginNameOrPath: string): unknown {
  let resolvedPath = '';
  let error: unknown = null;
  const monorepoRoot = getMonorepoRoot();
  const searchPaths = [process.cwd(), path.join(monorepoRoot, 'node_modules')];
  let debugInfo: string[] = [];
  let isESM = false;
  let pkgJsonPath = '';
  try {
    // Try to resolve as a node module
    resolvedPath = require.resolve(pluginNameOrPath, { paths: searchPaths });
    debugInfo.push(`require.resolve('${pluginNameOrPath}', { paths: ${JSON.stringify(searchPaths)} }) => ${resolvedPath}`);
    // Check if resolved file is ESM by inspecting package.json
    const parts = resolvedPath.split('node_modules' + path.sep);
    if (parts.length > 1) {
      const pkgDir = path.join(monorepoRoot, 'node_modules', parts[1].split(path.sep)[0]);
      pkgJsonPath = path.join(pkgDir, 'package.json');
      if (fs.existsSync(pkgJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        if (pkg.type === 'module') isESM = true;
      }
    }
  } catch (e1) {
    debugInfo.push(`require.resolve as node module failed: ${getErrorMessage(e1)}`);
    // Try to resolve as a relative/absolute path
    try {
      resolvedPath = require.resolve(path.resolve(process.cwd(), pluginNameOrPath));
      debugInfo.push(`require.resolve as absolute path: ${resolvedPath}`);
    } catch (e2) {
      debugInfo.push(`require.resolve as absolute path failed: ${getErrorMessage(e2)}`);
      // Fallback: try resolving from monorepo root
      try {
        resolvedPath = require.resolve(path.resolve(monorepoRoot, pluginNameOrPath));
        debugInfo.push(`require.resolve from monorepo root: ${resolvedPath}`);
      } catch (e3) {
        debugInfo.push(`require.resolve from monorepo root failed: ${getErrorMessage(e3)}`);
        // Try to resolve ESM main/module from package.json
        const pkgDir = path.join(monorepoRoot, 'node_modules', pluginNameOrPath);
        pkgJsonPath = path.join(pkgDir, 'package.json');
        if (fs.existsSync(pkgJsonPath)) {
          const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          if (pkg.type === 'module') {
            isESM = true;
            resolvedPath = path.join(pkgDir, pkg.module || pkg.main || 'index.js');
            debugInfo.push(`Resolved ESM main/module from package.json: ${resolvedPath}`);
          }
        }
        error = e3;
      }
    }
  }
  if (!resolvedPath) {
    throw new Error(`Plugin '${pluginNameOrPath}' not found.\nDebug info:\n${debugInfo.join('\n')}`);
  }
  let mod: unknown;
  try {
    if (isESM || resolvedPath.endsWith('.mjs') || (resolvedPath.endsWith('.js') && pkgJsonPath && fs.existsSync(pkgJsonPath) && JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')).type === 'module')) {
      // Use dynamic import for ESM
      return import(resolvedPath).then((mod) => (mod && typeof mod === 'object' && 'default' in mod ? mod.default : mod));
    } else {
      mod = require(resolvedPath);
    }
  } catch (e3) {
    const e3Msg = getErrorMessage(e3);
    throw new Error(`Failed to load plugin '${pluginNameOrPath}':\n${e3Msg}`);
  }
  // ESM interop: return .default if present
  if (mod && typeof mod === 'object' && 'default' in mod) {
    return (mod as { default: unknown }).default;
  }
  return mod;
}
