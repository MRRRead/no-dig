const { execSync } = require('child_process');

describe('CLI Build Command', () => {
  it('builds markdown files from a test vault to output', () => {
    const fs = require('fs');
    const path = require('path');
    const { buildCommand } = require('./index');
    const tmp = path.join(__dirname, '../../.tmp-test-vault');
    const out = path.join(__dirname, '../../.tmp-test-out');
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
    fs.mkdirSync(tmp, { recursive: true });
    fs.writeFileSync(path.join(tmp, 'test.md'), '# Hello [[World]]!', 'utf8');
    buildCommand(tmp, out);
    const html = fs.readFileSync(path.join(out, 'test.html'), 'utf8');
    expect(html).toContain('<a href="/world">World</a>');
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  });
});
