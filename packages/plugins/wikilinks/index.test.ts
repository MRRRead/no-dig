import wikilinksPlugin from './index';

describe('@no-dig/plugin-wikilinks', () => {
  it('transforms [[Page Name]] to HTML link', () => {
    const plugin = wikilinksPlugin();
    const result = plugin.transformContent('See [[Test Page]] for details.');
    expect(result).toContain('<a href="/test-page">Test Page</a>');
  });

  it('transforms [[Page Name|Alias]] to HTML link with alias', () => {
    const plugin = wikilinksPlugin();
    const result = plugin.transformContent('See [[Test Page|Alias]] for details.');
    expect(result).toContain('<a href="/test-page">Alias</a>');
  });

  it('slugifies URLs with spaces, case, and special chars', () => {
    const plugin = wikilinksPlugin();
    const result = plugin.transformContent('See [[My Page!@# 2025]] and [[Another_Page]]');
    expect(result).toContain('<a href="/my-page-2025">My Page!@# 2025</a>');
    expect(result).toContain('<a href="/another_page">Another_Page</a>');
  });

  it('ignores non-wikilink text', () => {
    const plugin = wikilinksPlugin();
    const result = plugin.transformContent('No links here.');
    expect(result).toBe('No links here.');
  });
});
