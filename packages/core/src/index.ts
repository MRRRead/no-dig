// Phase 1: MVP Content Pipeline
// 1. Obsidian Markdown Parser
// 2. Wikilink Processor
// 3. Content Transformation Pipeline

/**
 * Parses an Obsidian markdown file and extracts metadata.
 * @param {string} markdown - The markdown content
 * @returns {object} Parsed result (to be defined)
 */
function parseObsidianMarkdown(markdown) {
  // TODO: Implement markdown parsing (frontmatter, content, metadata)
  return {};
}

/**
 * Processes Obsidian-style wikilinks ([[Page Name]]) in markdown.
 * @param {string} markdown - The markdown content
 * @returns {string} Markdown with wikilinks converted to HTML links
 */
function processWikilinks(markdown) {
  // TODO: Implement wikilink conversion
  return markdown;
}

/**
 * Runs the content transformation pipeline.
 * @param {string} markdown - The markdown content
 * @returns {object} Final transformed result
 */
function transformContent(markdown) {
  // TODO: Compose parser and wikilink processor
  const parsed = parseObsidianMarkdown(markdown);
  const withLinks = processWikilinks(markdown);
  return { ...parsed, content: withLinks };
}

module.exports = {
  parseObsidianMarkdown,
  processWikilinks,
  transformContent,
};
