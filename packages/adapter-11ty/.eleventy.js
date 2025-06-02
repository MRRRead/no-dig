module.exports = function(eleventyConfig) {
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
