// @no-dig/core/src/parseVault.ts
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

export async function parseVault(vaultPath: string): Promise<Array<{ url: string, content: string, frontmatter: Record<string, any> }>> {
  const pages: Array<{ url: string, content: string, frontmatter: Record<string, any> }> = [];
  function walk(dir: string) {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (file.endsWith('.md')) {
        const raw = fs.readFileSync(full, 'utf8');
        const { data: frontmatter, content } = matter(raw);
        const rel = path.relative(vaultPath, full).replace(/\\/g, '/');
        const url = '/' + rel.replace(/\.md$/, '').replace(/index$/i, '');
        pages.push({ url, content, frontmatter });
      }
    }
  }
  walk(vaultPath);
  return pages;
}
// Best practice: no conflicting code, clear separation, and no 11ty duplication. This parser is only for NO-DIG pipeline, not for 11ty native builds.
