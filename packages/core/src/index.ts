// Phase 1: MVP Content Pipeline
// 1. Obsidian Markdown Parser
// 2. Wikilink Processor
// 3. Content Transformation Pipeline

// --- Obsidian Markdown Parser ---
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

// --- Wikilink and Embedded Content Processor ---
export function processWikilinks(markdown: string): string {
  let html = replaceEmbeddedContent(markdown);
  html = replaceWikilinks(html);
  return html;
}

function replaceEmbeddedContent(markdown: string): string {
  return markdown.replace(/!\[\[([^\]]+)\]\]/g, (match, file) => {
    if (isImage(file)) {
      return `<img src="/${file}" alt="${file}" />`;
    } else {
      const name = removeFileExtension(file);
      return `<a href="/${name.toLowerCase()}">${name}</a>`;
    }
  });
}

function replaceWikilinks(markdown: string): string {
  return markdown.replace(/\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (match, page, _alias, alias) => {
    const text = alias || page;
    const href = page.trim().replace(/\s+/g, '-').toLowerCase();
    return `<a href="/${href}">${text.trim()}</a>`;
  });
}

function isImage(filename: string): boolean {
  return /\.(png|jpg|jpeg|gif|svg|webp|avif)$/i.test(filename);
}

function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

// --- Tag Extraction ---
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
  beforeBuild?: (context: any) => void;
  afterBuild?: (context: any) => void;
}

export function transformContent(markdown: string, plugins: ContentPlugin[] = []): { frontmatter: Record<string, any>, content: string } {
  // Call beforeBuild hooks
  for (const plugin of plugins) {
    if (typeof plugin.beforeBuild === 'function') {
      try {
        plugin.beforeBuild({ markdown });
      } catch {}
    }
  }
  const parsed = parseObsidianMarkdown(markdown);
  let content = processWikilinks(parsed.content);
  const metadata = parsed.frontmatter;
  for (const plugin of plugins) {
    if (typeof plugin.transformContent === 'function') {
      try {
        content = plugin.transformContent(content, metadata);
      } catch {}
    }
  }
  // Call afterBuild hooks
  for (const plugin of plugins) {
    if (typeof plugin.afterBuild === 'function') {
      try {
        plugin.afterBuild({ content, metadata });
      } catch {}
    }
  }
  return { ...parsed, content };
}
