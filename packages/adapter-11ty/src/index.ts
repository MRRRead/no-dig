// Phase 1: 11ty Adapter Integration
// Receives transformed content from core and integrates with 11ty

const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const srcDir = path.resolve(__dirname);

/**
 * Adapter for integrating NO-DIG content with 11ty using Nunjucks templates.
 * Follows SOLID, DRY, and SRP principles. Dependency injection for testability.
 */
export interface RenderOptions {
  nunjucksEnv?: any; // Allow injection for testability
  templateName?: string;
}

/**
 * Receives parsed content and provides it to 11ty for site generation.
 * @param content The transformed content from core
 * @param navigation Optional navigation tree
 * @param options Optional render options (DI for Nunjucks env, template override)
 * @returns Rendered HTML string
 */
export function provideContentTo11ty(
  content: { frontmatter: Record<string, any>; content: string },
  navigation: Array<{ name: string; path?: string; children: any[] }> = [],
  options: RenderOptions = {}
): string {
  const templateName = options.templateName || 'base.njk';
  const env = options.nunjucksEnv ||
    new nunjucks.Environment(new nunjucks.FileSystemLoader(srcDir));
  try {
    return env.render(templateName, {
      title: content.frontmatter?.title || '',
      content: content.content,
      navigation
    });
  } catch (err) {
    // Log error with context for observability
    // eslint-disable-next-line no-console
    console.error(`Nunjucks render error in provideContentTo11ty:`, err);
    return '<!-- Render error -->';
  }
}

// For CommonJS compatibility
module.exports = {
  provideContentTo11ty,
};

// TODO: Add minimal 11ty template and config if needed
