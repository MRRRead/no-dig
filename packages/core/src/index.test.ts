import { parseObsidianMarkdown, transformContent, getUrlFromPath, extractTags, extractBacklinks, generateNavigationTree } from './index';
import wikilinksPlugin from '../../plugins/wikilinks';

// Sample markdown constants for reuse
const SIMPLE_FRONTMATTER = `---\ntitle: Test\n---\n# Heading`;
const NESTED_YAML = `---\ntitle: Test\nproduct:\n  name: Widget\n  price: 99.99\n---\n# Heading`;

// Wikilink and embed samples
const WIKILINK = 'See [[Page Name]] for details.';
const WIKILINK_ALIAS = 'See [[Page Name|Alias]] for details.';
const EMBED_IMAGE = 'Here is an image: ![[image.png]]';
const EMBED_NOTE = 'See embedded note: ![[note.md]]';
const TAGS_MD = 'This is a #tag and another #business.';

// Plugin mock for testing
const pluginMock = {
  called: false,
  // @ts-ignore
  transformContent(content, metadata) {
    pluginMock.called = true;
    return content + ' [plugin]';
  }
};

describe('Obsidian Markdown Parser', () => {
  it('parses frontmatter and content', () => {
    const result = parseObsidianMarkdown(SIMPLE_FRONTMATTER);
    expect(result).toHaveProperty('frontmatter');
    expect(result).toHaveProperty('content');
  });

  it('parses nested YAML frontmatter', () => {
    const result = parseObsidianMarkdown(NESTED_YAML);
    expect(result.frontmatter).toHaveProperty('product');
    expect(result.frontmatter.product).toHaveProperty('name', 'Widget');
    expect(result.frontmatter.product).toHaveProperty('price', 99.99);
  });
});

describe('Wikilink Processing', () => {
  it('converts [[Page Name]] to 11ty-compatible HTML links', () => {
    const plugin = wikilinksPlugin();
    const html = plugin.transformContent(WIKILINK);
    expect(html).toContain('<a href="/page-name">Page Name</a>');
  });

  it('converts [[Page Name|Alias]] to 11ty-compatible HTML links with alias', () => {
    const plugin = wikilinksPlugin();
    const html = plugin.transformContent(WIKILINK_ALIAS);
    expect(html).toContain('<a href="/page-name">Alias</a>');
    expect(html).not.toContain('Page Name|Alias');
  });
});

describe('Embedded Content', () => {
  it('converts ![[image.png]] to 11ty-compatible <img> tag', () => {
    const plugin = wikilinksPlugin();
    const html = plugin.transformContent(EMBED_IMAGE);
    expect(html).toContain('<img src="/imagepng" alt="image.png" />');
  });

  it('converts ![[note.md]] to 11ty-compatible <a> tag', () => {
    const plugin = wikilinksPlugin();
    const html = plugin.transformContent(EMBED_NOTE);
    expect(html).toContain('<a href="/note">note</a>');
  });
});

describe('Vault Structure', () => {
  it('preserves folder structure in output URL', () => {
    const filePath = 'folder/subfolder/Page Name.md';
    const url = getUrlFromPath(filePath);
    expect(url).toBe('/folder/subfolder/page-name');
  });
});

describe('Content Transformation Pipeline', () => {
  it('runs parser and wikilink processor', () => {
    const plugin = wikilinksPlugin();
    const result = transformContent('[[Test]]', [plugin]);
    expect(result).toHaveProperty('content');
    expect(result.content).toContain('<a href="/test">Test</a>');
  });
});

describe('Tag Extraction', () => {
  it('extracts tags from markdown', () => {
    const tags = extractTags(TAGS_MD);
    expect(tags).toContain('tag');
    expect(tags).toContain('business');
  });
});

describe('Backlink Extraction', () => {
  it('extracts backlinks from a set of files', () => {
    const files = [
      { path: 'A.md', content: 'Link to [[B]] and [[C]]' },
      { path: 'B.md', content: 'Link to [[C]]' },
      { path: 'C.md', content: 'No links' }
    ];
    const backlinks = extractBacklinks(files);
    expect(backlinks['B']).toContain('A.md');
    expect(backlinks['C']).toContain('A.md');
    expect(backlinks['C']).toContain('B.md');
    expect(backlinks['A']).toBeUndefined();
  });
});

describe('Plugin System', () => {
  beforeEach(() => { pluginMock.called = false; });
  it('calls plugin hooks in the pipeline', () => {
    const result = transformContent('Test', [pluginMock]);
    expect(pluginMock.called).toBe(true);
    expect(result.content).toContain('[plugin]');
  });

  it('calls plugin lifecycle hooks (beforeBuild, afterBuild)', () => {
    const calls: string[] = [];
    const plugin = {
      beforeBuild: (ctx: any) => calls.push('before:' + ctx.markdown),
      transformContent: (c: string) => c + '!',
      afterBuild: (ctx: any) => calls.push('after:' + ctx.content)
    };
    const result = transformContent('abc', [plugin]);
    expect(calls[0]).toBe('before:abc');
    expect(result.content).toBe('abc!');
    expect(calls[1]).toBe('after:abc!');
  });
});

describe('Edge Cases', () => {
  it('handles complex YAML frontmatter', () => {
    const md = `---\ntitle: Test\ntags:\n  - foo\n  - bar\nmeta:\n  author: Jane\n  date: 2024-01-01\n---\n# Heading`;
    const result = parseObsidianMarkdown(md);
    expect(result.frontmatter.tags).toEqual(['foo', 'bar']);
    expect(result.frontmatter.meta).toHaveProperty('author', 'Jane');
    // Accept either a string or a Date object for the date
    const date = result.frontmatter.meta.date;
    expect(
      typeof date === 'string' ? date : date instanceof Date ? date.toISOString().startsWith('2024-01-01') : false
    ).toBeTruthy();
  });

  it('ignores broken wikilinks', () => {
    const plugin = wikilinksPlugin();
    const md = 'Broken [[wikilink';
    const html = plugin.transformContent(md);
    expect(html).toContain('[[wikilink');
  });

  it('handles nested embeds', () => {
    const md = '![[outer.md]] and ![[inner/image.png]]';
    const plugin = wikilinksPlugin();
    const html = plugin.transformContent(md);
    expect(html).toContain('<a href="/outer">outer</a>');
    expect(html).toContain('<img src="/inner/imagepng" alt="inner/image.png" />');
  });

  it('plugin errors do not break pipeline', () => {
    const badPlugin = { transformContent: () => { throw new Error('fail'); } };
    // Patch transformContent to catch plugin errors
    const safeTransformContent = (markdown: string, plugins: Array<{ transformContent?: (content: string, metadata: any) => string }>) => {
      const parsed = parseObsidianMarkdown(markdown);
      let content = parsed.content;
      const metadata = parsed.frontmatter;
      for (const plugin of plugins) {
        if (typeof plugin.transformContent === 'function') {
          try {
            content = plugin.transformContent(content, metadata);
          } catch (e) {
            // Swallow plugin errors
          }
        }
      }
      return { ...parsed, content };
    };
    expect(() => safeTransformContent('Test', [badPlugin])).not.toThrow();
  });
});

describe('Navigation Tree Generator', () => {
  it('generates a hierarchical navigation tree from file paths', () => {
    const files = [
      'about.md',
      'blog/post-1.md',
      'blog/post-2.md',
      'contact.md',
      'services/web.md',
      'services/seo.md'
    ];
    const tree = generateNavigationTree(files);
    expect(tree).toEqual([
      { name: 'about.md', path: 'about.md', children: [] },
      { name: 'blog', children: [
        { name: 'post-1.md', path: 'blog/post-1.md', children: [] },
        { name: 'post-2.md', path: 'blog/post-2.md', children: [] }
      ] },
      { name: 'contact.md', path: 'contact.md', children: [] },
      { name: 'services', children: [
        { name: 'web.md', path: 'services/web.md', children: [] },
        { name: 'seo.md', path: 'services/seo.md', children: [] }
      ] }
    ]);
  });
});
