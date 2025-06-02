const path = require('path');
const interlinker = require(path.resolve(__dirname, 'node_modules/@photogabble/eleventy-plugin-interlinker'));

module.exports = function(eleventyConfig) {
  // Add wikilink/interlinker plugin for Obsidian-style links
  eleventyConfig.addPlugin(interlinker, {
    // NO-DIG defaults: SEO-friendly URLs, Obsidian compatibility
    baseDir: 'test-fixtures/sample-vault',
    titleAttr: true,
    // Add more options as needed
  });

  // Passthrough copy for static assets (if any)
  eleventyConfig.addPassthroughCopy({ "src/input.css": "input.css" });

  // Set custom input/output directories for sample-vault live preview
  return {
    dir: {
      input: "test-fixtures/sample-vault",
      output: "_site",
      includes: "../../src", // so base.njk/page.njk are found
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
    passthroughFileCopy: true,
    pathPrefix: "/"
  };
};
