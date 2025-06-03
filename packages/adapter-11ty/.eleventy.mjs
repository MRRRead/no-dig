import path from 'path';
import { fileURLToPath } from 'url';

export default async function(eleventyConfig) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // Dynamically import the ES module plugin
  const interlinker = (await import(path.resolve(
    __dirname,
    '../../node_modules/@photogabble/eleventy-plugin-interlinker/index.js',
  ))).default;

  // Add wikilink/interlinker plugin for Obsidian-style links
  eleventyConfig.addPlugin(interlinker, {
    baseDir: 'test-fixtures/sample-vault',
    titleAttr: true,
  });

  eleventyConfig.addPassthroughCopy({ 'src/input.css': 'input.css' });

  return {
    dir: {
      input: 'test-fixtures/sample-vault',
      output: '_site',
      includes: '../../src', // so base.njk/page.njk are found
      data: '_data',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', 'html'],
    passthroughFileCopy: true,
    pathPrefix: '/',
  };
}
