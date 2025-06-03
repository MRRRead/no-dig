// Phase 1: MVP Content Pipeline
// 1. Obsidian Markdown Parser
// 2. Wikilink Processor
// 3. Content Transformation Pipeline

// --- Obsidian Markdown Parser ---
/**
 * Parses Obsidian-flavored markdown and extracts frontmatter and content.
 * @param markdown Markdown string
 * @returns Parsed frontmatter and content
 */
export function parseObsidianMarkdown(markdown: string): { frontmatter: Record<string, any>, content: string } {
  const yamlFrontmatterRegex = /^---\n([\s\S]*?)\n---\n?/;
  const match = markdown.match(yamlFrontmatterRegex);
  let frontmatter: Record<string, any> = {};
  let content = markdown;
  if (match) {
    const yaml = match[1];
    try {
      frontmatter = require('js-yaml').load(yaml);
    } catch {
      yaml.split(/\n/).forEach(line => {
        const [key, ...rest] = line.split(':');
        if (key && rest.length) {
          (frontmatter as any)[key.trim()] = rest.join(':').trim();
        }
      });
    }
    content = markdown.slice(match[0].length);
  }
  return { frontmatter, content: content.trim() };
}

// --- Tag Extraction ---
/**
 * Extracts tags from markdown content.
 * @param markdown Markdown string
 * @returns Array of tag strings
 */
export function extractTags(markdown: string): string[] {
  const tags = [];
  const tagRegex = /(^|\s)#([a-zA-Z0-9-_]+)/g;
  let match;
  while ((match = tagRegex.exec(markdown))) {
    tags.push(match[2]);
  }
  return tags;
}

// --- Vault Structure Preservation ---
/**
 * Converts a file path to a clean URL.
 * @param filePath Path to markdown file
 * @returns Clean URL string
 */
export function getUrlFromPath(filePath: string): string {
  return (
    '/' +
    filePath
      .replace(/\\/g, '/')
      .replace(/\.md$/, '')
      .split('/')
      .map(seg => seg.trim().replace(/\s+/g, '-').toLowerCase())
      .join('/')
  );
}

// --- Content Transformation Pipeline ---
export interface ContentPlugin {
  transformContent?: (content: string, metadata: Record<string, any>) => string;
  beforeBuild?: (context: { markdown: string }) => void;
  afterBuild?: (context: { content: string, metadata: Record<string, any> }) => void;
}

/**
 * Main content transformation pipeline. Applies plugins and processes markdown.
 * @param markdown Markdown string
 * @param plugins Array of ContentPlugin
 * @returns Transformed content and frontmatter
 */
export function transformContent(markdown: string, plugins: ContentPlugin[] = []): { frontmatter: Record<string, any>, content: string } {
  // Call beforeBuild hooks
  for (const plugin of plugins) {
    if (typeof plugin.beforeBuild === 'function') {
      try {
        plugin.beforeBuild({ markdown });
      } catch (err) {
        console.error('Plugin beforeBuild error:', err);
      }
    }
  }
  const parsed = parseObsidianMarkdown(markdown);
  let html = parsed.content;
  const metadata = parsed.frontmatter;
  for (const plugin of plugins) {
    if (typeof plugin.transformContent === 'function') {
      try {
        html = plugin.transformContent(html, metadata);
      } catch (err) {
        console.error('Plugin transformContent error:', err);
      }
    }
  }
  // Call afterBuild hooks
  for (const plugin of plugins) {
    if (typeof plugin.afterBuild === 'function') {
      try {
        plugin.afterBuild({ content: html, metadata });
      } catch (err) {
        console.error('Plugin afterBuild error:', err);
      }
    }
  }
  return { frontmatter: metadata, content: html };
}

// --- Backlink Extraction ---
export function extractBacklinks(allFiles: Array<{ path: string; content: string }>): Record<string, string[]> {
  const backlinks: Record<string, string[]> = {};
  const wikilinkRegex = /\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g;
  allFiles.forEach(file => {
    let match;
    while ((match = wikilinkRegex.exec(file.content))) {
      const target = match[1].trim();
      if (!backlinks[target]) backlinks[target] = [];
      backlinks[target].push(file.path);
    }
  });
  return backlinks;
}

// --- Navigation Tree Generator ---
/**
 * Generates a hierarchical navigation tree from a list of file paths.
 * @param {string[]} filePaths - List of content file paths (e.g., ['about.md', 'blog/post-1.md'])
 * @returns {Array<{ name: string, path?: string, children: any[] }>} Navigation tree
 */
export function generateNavigationTree(filePaths: string[]): Array<{ name: string, path?: string, children: any[] }> {
  type NavNode = { name: string; path?: string; children: NavNode[] };
  function insert(tree: NavNode[], parts: string[], fullPath: string) {
    if (parts.length === 0) return;
    const [head, ...rest] = parts;
    let node = tree.find(n => n.name === head);
    if (!node) {
      node = { name: head, path: rest.length === 0 ? fullPath : undefined, children: [] };
      tree.push(node);
    }
    if (rest.length > 0) {
      insert(node.children, rest, fullPath);
    }
  }
  const tree: NavNode[] = [];
  filePaths.forEach(fp => {
    const parts = fp.replace(/\\/g, '/').split('/');
    insert(tree, parts, fp);
  });
  return tree;
}

import { PluginHost } from './PluginHost';
import { parseVault } from './parseVault';

/**
 * buildSite({ plugins, vaultPath, adapter })
 * Orchestrates the build pipeline per spec.
 */
/**
 * @param {Object} opts
 * @param {Array} opts.plugins
 * @param {string} opts.vaultPath
 * @param {Object} opts.adapter
 */
export async function buildSite({ plugins = [], vaultPath, adapter }: { plugins?: any[]; vaultPath: string; adapter: any }) {
  const host = new PluginHost(plugins);
  await host.runHook('onBuildStart', {});
  const pages = await parseVault(vaultPath);
  await host.runHook('onVaultParsed', { pages });
  for (const page of pages) {
    await host.runHook('onPageGenerated', { page });
  }
  await adapter.generateSite(pages, 'dist');
  await host.runHook('onBuildEnd', {});
}
