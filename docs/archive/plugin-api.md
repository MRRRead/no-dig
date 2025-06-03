# Plugin API

This document outlines the Plugin API for NO-DIG, providing developers with the information needed to create custom plugins that extend the functionality of the static site generator.

## ⚠️ Current Limitations / Known Issues (June 2025)

- The plugin wrapper system is implemented and works for core and CLI, but **integration with 11ty for Obsidian-style wikilinks is not yet fully functional**. The 11ty build output does not render wikilinks as HTML links due to unresolved plugin resolution issues with @photogabble/eleventy-plugin-interlinker in a monorepo/Windows environment.
- Plugin wrappers for other 11ty plugins (SEO, images, etc.) are planned for Phase 2.
- See the [Development Roadmap](./roadmap/development-roadmap.md) and [README](../README.md) for status and next steps.

## Plugin Architecture

NO-DIG's plugin system is designed to be flexible, powerful, and easy to use. Plugins can hook into various stages of the build process, modify content, add new features, and integrate with external services.

### Plugin Package Structure

A typical NO-DIG plugin follows this structure:

```
@no-dig/plugin-example/
├── package.json
├── src/
│   ├── index.ts        # Main plugin entry point
│   ├── hooks/          # Hook implementations
│   ├── utils/          # Utility functions
│   └── types.ts        # TypeScript type definitions
├── tests/              # Plugin tests
└── README.md           # Plugin documentation
```

### Plugin Registration

Plugins are registered in the NO-DIG configuration file:

```javascript
// no-dig.config.js
module.exports = {
  plugins: [
    '@no-dig/plugins/seo',
    '@no-dig/plugins/sitemap',
    ['@no-dig/plugins/images', { quality: 80, formats: ['webp', 'avif'] }],
    './local-plugin.js'
  ]
};
```

Plugins can be specified as:
- Package name strings (for npm packages)
- Arrays with configuration options `[pluginName, options]`
- Relative paths to local plugin files

## 11ty Plugin Registration Flow

NO-DIG adapters (such as @no-dig/adapter-11ty) support dynamic plugin registration via the plugin host. The `.eleventy.js` config attempts to load plugins from a generated `plugins.js` file (created by the CLI or build process), and registers them using the `registerNoDigPluginsWithEleventy` utility. This ensures all plugins are initialized and configured according to the NO-DIG plugin API, and allows for robust, cross-environment plugin integration.

If no plugins are found, the adapter falls back to registering the core wikilinks/interlinker plugin for compatibility.

### Wikilink URL Slugification

The wikilinks plugin ensures all generated URLs are slugified according to the NO-DIG spec: lowercase, spaces to dashes, special characters removed (except dashes/underscores), and no double or trailing slashes. This guarantees consistent, SEO-friendly URLs across all output and live preview environments.

## Plugin Lifecycle Hooks

Plugins interact with NO-DIG through a series of lifecycle hooks that are called at specific points during the build process.

### Available Hooks

| Hook | Description | Arguments | Return |
|------|-------------|-----------|--------|
| `initialize` | Called when the plugin is first loaded | `{ config, logger }` | `void` |
| `beforeBuild` | Called before the build process starts | `{ vault, config, logger }` | `void` |
| `beforeContentProcessing` | Called before each content file is processed | `{ content, metadata, filepath, logger }` | `{ content, metadata }` |
| `afterContentProcessing` | Called after each content file is processed | `{ content, metadata, filepath, logger }` | `{ content, metadata }` |
| `beforeTemplateApplication` | Called before templates are applied to content | `{ content, template, data, logger }` | `{ content, template, data }` |
| `afterTemplateApplication` | Called after templates are applied to content | `{ renderedContent, data, filepath, logger }` | `{ renderedContent }` |
| `beforeAssetProcessing` | Called before each asset is processed | `{ asset, filepath, logger }` | `{ asset }` |
| `afterAssetProcessing` | Called after each asset is processed | `{ asset, filepath, logger }` | `{ asset }` |
| `beforeOutput` | Called before files are written to the output directory | `{ files, outputDir, logger }` | `{ files }` |
| `afterBuild` | Called after the build process completes | `{ stats, outputDir, logger }` | `void` |
| `onError` | Called when an error occurs during the build | `{ error, phase, filepath, logger }` | `void` |

### Hook Execution Order

Hooks are executed in the following order:

1. `initialize` (once per plugin)
2. `beforeBuild` (once per build)
3. For each content file:
   - `beforeContentProcessing`
   - `afterContentProcessing`
4. For each template:
   - `beforeTemplateApplication`
   - `afterTemplateApplication`
5. For each asset:
   - `beforeAssetProcessing`
   - `afterAssetProcessing`
6. `beforeOutput` (once per build)
7. `afterBuild` (once per build)

If an error occurs at any point, the `onError` hook is called.

## Plugin API Reference

### Plugin Definition

A NO-DIG plugin is defined as a function that returns an object with hook implementations:

```typescript
interface NoDigPlugin {
  name: string;
  version?: string;
  description?: string;
  initialize?: (context: InitializeContext) => void | Promise<void>;
  beforeBuild?: (context: BeforeBuildContext) => void | Promise<void>;
  beforeContentProcessing?: (context: ContentContext) => ContentResult | Promise<ContentResult>;
  afterContentProcessing?: (context: ContentContext) => ContentResult | Promise<ContentResult>;
  beforeTemplateApplication?: (context: TemplateContext) => TemplateResult | Promise<TemplateResult>;
  afterTemplateApplication?: (context: RenderedContext) => RenderedResult | Promise<RenderedResult>;
  beforeAssetProcessing?: (context: AssetContext) => AssetResult | Promise<AssetResult>;
  afterAssetProcessing?: (context: AssetContext) => AssetResult | Promise<AssetResult>;
  beforeOutput?: (context: OutputContext) => OutputResult | Promise<OutputResult>;
  afterBuild?: (context: AfterBuildContext) => void | Promise<void>;
  onError?: (context: ErrorContext) => void | Promise<void>;
}
```

### Context Objects

Each hook receives a context object with relevant information:

```typescript
interface InitializeContext {
  config: NoDigConfig;
  logger: Logger;
}

interface BeforeBuildContext {
  vault: VaultData;
  config: NoDigConfig;
  logger: Logger;
}

interface ContentContext {
  content: string;
  metadata: Record<string, any>;
  filepath: string;
  logger: Logger;
}

interface TemplateContext {
  content: string;
  template: string;
  data: Record<string, any>;
  logger: Logger;
}

interface RenderedContext {
  renderedContent: string;
  data: Record<string, any>;
  filepath: string;
  logger: Logger;
}

interface AssetContext {
  asset: Buffer;
  filepath: string;
  logger: Logger;
}

interface OutputContext {
  files: Map<string, string | Buffer>;
  outputDir: string;
  logger: Logger;
}

interface AfterBuildContext {
  stats: BuildStats;
  outputDir: string;
  logger: Logger;
}

interface ErrorContext {
  error: Error;
  phase: string;
  filepath?: string;
  logger: Logger;
}
```

### Result Objects

Hooks that modify content or data return result objects:

```typescript
interface ContentResult {
  content: string;
  metadata: Record<string, any>;
}

interface TemplateResult {
  content: string;
  template: string;
  data: Record<string, any>;
}

interface RenderedResult {
  renderedContent: string;
}

interface AssetResult {
  asset: Buffer;
}

interface OutputResult {
  files: Map<string, string | Buffer>;
}
```

## Plugin Configuration

Plugins can receive configuration options when registered:

```javascript
// no-dig.config.js
module.exports = {
  plugins: [
    ['@no-dig/plugins/images', {
      quality: 80,
      formats: ['webp', 'avif'],
      sizes: [640, 1024, 1920],
      lazy: true
    }]
  ]
};
```

These options are accessible in the plugin's hooks through the `config` object:

```javascript
// Inside a plugin
module.exports = function imagePlugin(options = {}) {
  return {
    name: 'image-plugin',
    
    initialize({ config, logger }) {
      // Access plugin options
      const quality = options.quality || 70;
      const formats = options.formats || ['webp'];
      
      logger.info(`Initializing image plugin with quality: ${quality}`);
    }
  };
};
```

## Plugin Development Best Practices

### 1. Follow the Single Responsibility Principle

Each plugin should focus on a specific feature or functionality. If a plugin is doing too many things, consider splitting it into multiple plugins.

### 2. Use Asynchronous Code Properly

Many plugin operations are asynchronous. Always return Promises from hooks that perform async operations:

```javascript
beforeContentProcessing: async ({ content, metadata, filepath, logger }) => {
  const processedContent = await someAsyncOperation(content);
  return { content: processedContent, metadata };
}
```

### 3. Handle Errors Gracefully

Use try/catch blocks in your hooks and provide meaningful error messages:

```javascript
beforeContentProcessing: async ({ content, metadata, filepath, logger }) => {
  try {
    const processedContent = await someAsyncOperation(content);
    return { content: processedContent, metadata };
  } catch (error) {
    logger.error(`Error processing ${filepath}: ${error.message}`);
    throw error; // or return original content to continue the build
  }
}
```

### 4. Document Your Plugin

Provide clear documentation for your plugin, including:
- Purpose and features
- Configuration options
- Examples
- Requirements and dependencies

### 5. Write Tests

Test your plugin thoroughly, including:
- Unit tests for utility functions
- Integration tests with the NO-DIG core
- Edge cases and error handling

## Example Plugin: Table of Contents

Here's a complete example of a plugin that generates a table of contents for markdown content:

```javascript
// toc-plugin.js
const slugify = require('slugify');

module.exports = function tocPlugin(options = {}) {
  const defaultOptions = {
    selector: 'h2, h3, h4',
    className: 'table-of-contents',
    listType: 'ul',
    includeLevel: [2, 3, 4],
    containerClass: 'toc-container',
    slugifyOptions: { lower: true, strict: true }
  };
  
  const pluginOptions = { ...defaultOptions, ...options };
  
  return {
    name: 'toc-plugin',
    version: '1.0.0',
    description: 'Generates a table of contents for markdown content',
    
    beforeContentProcessing: async ({ content, metadata, filepath, logger }) => {
      // Only process markdown files
      if (!filepath.endsWith('.md')) {
        return { content, metadata };
      }
      
      // Skip if frontmatter has toc: false
      if (metadata.toc === false) {
        return { content, metadata };
      }
      
      try {
        // Extract headings
        const headingRegex = /^(#{2,4})\s+(.+)$/gm;
        const headings = [];
        let match;
        
        while ((match = headingRegex.exec(content)) !== null) {
          const level = match[1].length;
          const text = match[2].trim();
          
          // Skip if level is not included
          if (!pluginOptions.includeLevel.includes(level)) {
            continue;
          }
          
          const slug = slugify(text, pluginOptions.slugifyOptions);
          
          headings.push({
            level,
            text,
            slug
          });
        }
        
        // Generate TOC HTML
        if (headings.length > 0) {
          let tocHtml = `<div class="${pluginOptions.containerClass}">\n`;
          tocHtml += `<${pluginOptions.listType} class="${pluginOptions.className}">\n`;
          
          let prevLevel = 0;
          
          headings.forEach(heading => {
            if (heading.level > prevLevel) {
              // Start a new nested list
              tocHtml += `<${pluginOptions.listType}>\n`;
            } else if (heading.level < prevLevel) {
              // Close nested lists
              const levelDiff = prevLevel - heading.level;
              for (let i = 0; i < levelDiff; i++) {
                tocHtml += `</${pluginOptions.listType}>\n</li>\n`;
              }
            } else if (prevLevel !== 0) {
              // Close previous item
              tocHtml += '</li>\n';
            }
            
            tocHtml += `<li><a href="#${heading.slug}">${heading.text}</a>`;
            
            prevLevel = heading.level;
          });
          
          // Close any remaining lists
          for (let i = 0; i < prevLevel; i++) {
            tocHtml += `</li>\n</${pluginOptions.listType}>\n`;
          }
          
          tocHtml += `</${pluginOptions.listType}>\n</div>\n\n`;
          
          // Add TOC to content
          const tocMarker = '<!-- TOC -->';
          if (content.includes(tocMarker)) {
            content = content.replace(tocMarker, tocHtml);
          } else {
            // Add after first heading or at the beginning
            const firstHeadingRegex = /^#\s+.+$/m;
            const firstHeadingMatch = firstHeadingRegex.exec(content);
            
            if (firstHeadingMatch) {
              const index = firstHeadingMatch.index + firstHeadingMatch[0].length;
              content = content.slice(0, index) + '\n\n' + tocHtml + content.slice(index);
            } else {
              content = tocHtml + content;
            }
          }
          
          // Add IDs to headings
          headings.forEach(heading => {
            const headingRegex = new RegExp(`^(#{${heading.level}})\\s+(${heading.text})$`, 'm');
            content = content.replace(
              headingRegex,
              `$1 $2 {#${heading.slug}}`
            );
          });
        }
        
        return { content, metadata };
      } catch (error) {
        logger.error(`Error generating TOC for ${filepath}: ${error.message}`);
        return { content, metadata };
      }
    }
  };
};
```

### Using the Example Plugin

```javascript
// no-dig.config.js
module.exports = {
  plugins: [
    ['./toc-plugin.js', {
      includeLevel: [2, 3], // Only include h2 and h3
      containerClass: 'my-toc-container'
    }]
  ]
};
```

## Creating Official Plugins

To create an official NO-DIG plugin:

1. Follow the naming convention: `@no-dig/plugins/[feature]`
2. Use TypeScript for type safety
3. Include comprehensive tests
4. Provide detailed documentation
5. Follow the NO-DIG code style and best practices

## Third-Party Plugin Development

Third-party plugins can be published to npm with the recommended naming convention:

```
no-dig-plugin-[feature]
```

For example:
- `no-dig-plugin-algolia`
- `no-dig-plugin-netlify-cms`
- `no-dig-plugin-social-share`

## Conclusion

The NO-DIG Plugin API provides a powerful and flexible way to extend the functionality of the static site generator. By following the guidelines and best practices outlined in this document, developers can create plugins that seamlessly integrate with the NO-DIG ecosystem and enhance the capabilities of business websites built with NO-DIG.
