const { transformContent, generateNavigationTree } = require('@no-dig/core');
const { provideContentTo11ty } = require('./index');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

describe('11ty Adapter', () => {
  it('provides transformed content to 11ty with layout and navigation', () => {
    const md = '# Hello [[World]]!';
    const transformed = transformContent(md);
    const nav = generateNavigationTree([
      'about.md',
      'blog/post-1.md',
      'blog/post-2.md',
      'contact.md',
      'services/web.md',
      'services/seo.md'
    ]);
    // Ensure the template file exists for the test
    const basePath = path.join(__dirname, 'base.njk');
    expect(fs.existsSync(basePath)).toBe(true);
    const html = provideContentTo11ty(transformed, nav);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<a href="/world">World</a>');
    expect(html).toContain('<main>');
    // Navigation checks
    expect(html).toContain('<nav>');
    expect(html).toContain('about');
    expect(html).toContain('blog');
    expect(html).toContain('services');
    expect(html).toContain('post-1');
    expect(html).toContain('web');
  });

  it('renders expected HTML snapshot', () => {
    const md = '# Hello [[World]]!';
    const transformed = transformContent(md);
    const nav = generateNavigationTree([
      'about.md',
      'blog/post-1.md',
      'blog/post-2.md',
      'contact.md',
      'services/web.md',
      'services/seo.md'
    ]);
    const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname));
    const html = provideContentTo11ty(transformed, nav, { nunjucksEnv: env });
    expect(html).toMatchSnapshot();
  });

  it('handles missing template gracefully (negative test)', () => {
    const md = '# Hello [[World]]!';
    const transformed = transformContent(md);
    const nav = generateNavigationTree(['about.md']);
    // Inject env with no templates
    const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('nonexistent_dir'));
    expect(() => provideContentTo11ty(transformed, nav, { nunjucksEnv: env, templateName: 'missing.njk' })).not.toThrow();
    const html = provideContentTo11ty(transformed, nav, { nunjucksEnv: env, templateName: 'missing.njk' });
    expect(html).toContain('Render error');
  });
});

describe('11ty Adapter - sample vault integration', () => {
  const vaultDir = path.join(__dirname, '../test-fixtures/sample-vault');
  const files = [
    'Home.md',
    'Blog/Post 1.md',
    'Blog/Post 2.md',
    'About.md',
    'Services/Web.md',
    'Services/SEO.md'
  ];
  it('transforms and renders all sample vault files (edge cases)', () => {
    const nav = generateNavigationTree(files);
    files.forEach(file => {
      const filePath = path.join(vaultDir, file);
      const md = fs.readFileSync(filePath, 'utf8');
      const transformed = transformContent(md);
      const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname));
      const html = provideContentTo11ty(transformed, nav, { nunjucksEnv: env });
      expect(html).toContain('<!DOCTYPE html>');
      // Check for wikilinks, embeds, tags, code blocks, empty content, backlinks, non-existent page links
      if (file === 'Home.md') {
        expect(html).toContain('Welcome');
        expect(html).toContain('About');
        expect(html).toContain('first blog post');
        expect(html).toContain('tag1');
      }
      if (file === 'Blog/Post 1.md') {
        expect(html).toContain('Backlink');
        expect(html).toContain('image.png');
      }
      if (file === 'Blog/Post 2.md') {
        expect(html).toContain('Edge case');
        expect(html).toContain('NonExistentPage');
      }
      if (file === 'Services/Web.md') {
        expect(html).toContain('console.log');
        expect(html).toContain('Contact');
      }
      if (file === 'Services/SEO.md') {
        expect(html).toContain('SEO Services');
      }
    });
  });
});
