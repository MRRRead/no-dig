describe('CLI Build Command', () => {
  it('builds markdown files from a test vault to output using 11ty', () => {
    const fs = require('fs');
    const path = require('path');
    const { buildCommand } = require('./index');
    const tmp = path.join(__dirname, '../../.tmp-test-vault');
    const contentDir = path.join(tmp, 'content');
    const out = path.join(__dirname, '../../.tmp-test-out');
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
    fs.mkdirSync(contentDir, { recursive: true });
    // Clean input directory: remove all files (including .html) before writing index.md
    const leftover = fs.readdirSync(contentDir);
    for (const f of leftover) {
      fs.rmSync(path.join(contentDir, f));
    }
    // Write .eleventy.js config in tmp root, not content dir
    fs.writeFileSync(
      path.join(tmp, '.eleventy.js'),
      `module.exports = { dir: { input: 'content', output: '${out.replace(/\\/g, '/')}' }, templateFormats: ['md'] };`,
      'utf8'
    );
    fs.writeFileSync(path.join(contentDir, 'index.md'), '# Hello World!', 'utf8');
    // Debug: List all files in contentDir before build
    const beforeBuildFiles = fs.readdirSync(contentDir);
    console.log('[TEST] contentDir before buildCommand:', beforeBuildFiles);
    buildCommand(contentDir, out);
    const outputHtml = path.join(out, 'content', 'index.html');
    expect(fs.existsSync(outputHtml)).toBe(true);
    const html = fs.readFileSync(outputHtml, 'utf8');
    expect(html).toMatch(/Hello World/);
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });
});
