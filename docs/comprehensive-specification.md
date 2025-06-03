# Comprehensive Specification

This document provides a comprehensive overview of the NO-DIG package ecosystem, integrating all aspects of the architecture, features, and implementation details.

## 1. Package Ecosystem Architecture

NO-DIG is built as a modular package ecosystem rather than a monolithic application. This architecture provides flexibility, maintainability, and extensibility through clearly defined package boundaries and responsibilities.

### 1.1 Package Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      @no-dig/cli                            │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  init   │  │  build  │  │  serve  │  │  other commands │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      @no-dig/core                           │
│                                                             │
│  ┌─────────────┐  ┌───────────┐  ┌───────────────────────┐  │
│  │ Vault Parser│  │Plugin Host│  │Content Transformation │  │
│  └─────────────┘  └───────────┘  └───────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   @no-dig/adapter-11ty                      │
│                                                             │
│  ┌─────────────┐  ┌───────────┐  ┌───────────────────────┐  │
│  │11ty Config  │  │Templates  │  │  Build Optimization   │  │
│  └─────────────┘  └───────────┘  └───────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    @no-dig/plugins/*                        │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────┐ │
│  │   SEO   │  │ Sitemap │  │ Images  │  │ Schema  │  │... │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └────┘ │
└─────────────────────────────────────────────────────────────┘
```

For detailed information on the architecture, see [[architecture-and-features]].

### 1.2 Package Responsibilities

| Package | Responsibility | Key Components |
|---------|----------------|----------------|
| **@no-dig/cli** | User interface and workflow | Project initialization, build process, development server |
| **@no-dig/core** | Core functionality | Vault parsing, plugin host, content transformation |
| **@no-dig/adapter-11ty** | 11ty integration | Template handling, data cascade, build optimization |
| **@no-dig/plugins/*** | Feature extensions | SEO, images, schema, forms, analytics, i18n |

### 1.3 Why Packages?

The package-based architecture provides several advantages:

1. **Modularity**: Users install only what they need
2. **Independent Versioning**: Each package evolves at its own pace
3. **Separation of Concerns**: Clear boundaries between components
4. **Easier Maintenance**: Contributors can focus on specific areas
5. **Future Extensibility**: Simple to add new adapters or plugins

For more on the rationale behind this architecture, see the "Why Packages?" section in [[architecture-and-features]].

## 2. Core Features

### 2.1 Business-Focused Website Generation

Unlike "digital garden" tools that focus on personal knowledge bases, NO-DIG is specifically designed for professional business websites:

- **Conversion-Optimized Templates**: Layouts designed for business goals
- **Call-to-Action Components**: Pre-built components for effective CTAs
- **Business Schema Support**: Structured data for LocalBusiness, Organization, and Product
- **Professional Navigation**: Business-appropriate navigation patterns
- **Contact and Lead Generation**: Forms and lead capture capabilities

### 2.2 SEO-First Architecture

Every aspect of NO-DIG is designed with search engine optimization as a primary consideration:

- **Structured Data Generation**: Automatic schema.org markup based on content type
- **Technical SEO Elements**: Canonical URLs, hreflang, meta tags, and more
- **Performance Optimization**: Core Web Vitals focus for better rankings
- **Content Structure**: SEO-optimized HTML structure and heading hierarchy
- **Internal Linking**: Semantic internal linking for better crawlability

For detailed SEO implementation, see [[seo-implementation-roadmap]] and [[structured-data-strategy]].

### 2.3 Obsidian as a CMS

NO-DIG leverages Obsidian as a powerful content management system:

- **Full Wikilink Support**: Proper handling of all Obsidian wikilink formats
- **Vault Structure Preservation**: URL structure mirrors Obsidian organization
- **Templater Integration**: Compatible with Obsidian Templater for content creation
- **Metadata Extraction**: Frontmatter parsing for SEO and configuration
- **Media Management**: Proper handling of embedded images and media

For Obsidian compatibility details, see [[obsidian-compatibility-matrix]] and [[obsidian-wikilink-guide]].

### 2.4 Performance Optimization

NO-DIG implements comprehensive performance optimizations:

- **Image Processing Pipeline**: WebP/AVIF conversion and responsive images
- **CSS Optimization**: Critical CSS extraction and minimal footprint
- **JavaScript Efficiency**: Minimal JS with proper loading strategies
- **Font Optimization**: WOFF2 with subsetting and proper loading
- **Caching Strategy**: Optimal cache headers and asset versioning

For image optimization details, see [[image-optimization-strategy]].

### 2.5 Developer Experience

NO-DIG prioritizes developer experience:

- **Intuitive CLI**: Simple commands for common operations
- **Clear Documentation**: Comprehensive guides and references
- **Type Safety**: TypeScript throughout for better tooling
- **Plugin Architecture**: Extensible system for customization
- **Local Development**: Fast development server with hot reloading

For developer workflows, see [[developer-and-editor-user-flows]].

### 2.6 Privacy and Compliance

NO-DIG is built with privacy and compliance in mind:

- **GDPR Compliance**: Privacy-first approach to data collection
- **Cookie Consent**: Built-in cookie consent management
- **Analytics Options**: Privacy-focused analytics integration
- **Data Minimization**: Only essential data collection by default
- **Transparency**: Clear documentation of data practices

For privacy implementation details, see [[privacy-and-compliance]].

## 3. Plugin API

NO-DIG provides a powerful Plugin API that allows developers to extend functionality at various stages of the build process.

### 3.1 Plugin Lifecycle Hooks

Plugins can hook into the following lifecycle events:

- `initialize`: When the plugin is first loaded
- `beforeBuild`: Before the build process starts
- `beforeContentProcessing`: Before each content file is processed
- `afterContentProcessing`: After each content file is processed
- `beforeTemplateApplication`: Before templates are applied
- `afterTemplateApplication`: After templates are applied
- `beforeAssetProcessing`: Before each asset is processed
- `afterAssetProcessing`: After each asset is processed
- `beforeOutput`: Before files are written to output
- `afterBuild`: After the build process completes
- `onError`: When an error occurs during the build

### 3.2 Plugin Configuration

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

### 3.3 Creating Plugins

Developers can create custom plugins to extend NO-DIG's functionality:

```javascript
// example-plugin.js
module.exports = function(options = {}) {
  return {
    name: 'example-plugin',
    
    beforeContentProcessing: async ({ content, metadata, filepath, logger }) => {
      // Transform content here
      return { content, metadata };
    }
  };
};
```

For complete Plugin API documentation, see [[plugin-api]].

## 4. User Flows

### 4.1 Developer Flow (CLI-First)

NO-DIG prioritizes a command-line interface (CLI) workflow for developers:

1. **Installation**: `npm install -g @no-dig/cli`
2. **Project Initialization**: `no-dig init my-new-site`
3. **Configuration**: Edit `no-dig.config.js`
4. **Plugin Installation**: `npm install @no-dig/plugins/seo @no-dig/plugins/images`
5. **Local Development**: `no-dig serve`
6. **Build for Production**: `no-dig build`
7. **Deployment**: Deploy the generated static files

### 4.2 Content Editor Flow (Obsidian-Based)

Content editors work primarily within Obsidian:

1. **Setup Obsidian Vault**: Open the project's `content/` directory as a vault
2. **Content Creation**: Create markdown files with Obsidian
3. **Metadata Management**: Add YAML frontmatter for SEO and configuration
4. **Media Management**: Embed images and other media using Obsidian syntax
5. **Linking Content**: Use `[[wikilinks]]` for internal linking
6. **Previewing Content**: Use Obsidian preview or the development server
7. **Publication**: Commit changes to trigger automated build and deployment

For detailed user flows, see [[developer-and-editor-user-flows]] and [[user-flows-and-personas]].

## 5. Testing Strategy

NO-DIG implements a comprehensive testing strategy across all packages:

### 5.1 Package-Level Testing

- **Core Package**: Testing vault parsing, plugin host, and content transformation
- **CLI Package**: Testing command execution, project scaffolding, and error handling
- **Adapter Package**: Testing SSG integration, template rendering, and output generation
- **Plugin Packages**: Testing hook implementation, configuration, and integration

### 5.2 Integration Testing

- **Plugin Hook Testing**: Verifying hook execution order and data flow
- **Cross-Package Integration**: Testing interactions between packages
- **Adapter Output Testing**: Comparing generated output to expected snapshots

### 5.3 End-to-End Testing

- **Complete Build Process**: Testing the entire pipeline from vault to site
- **Content Transformation**: Verifying correct transformation of content
- **Link Resolution**: Testing wikilink resolution across the site
- **Asset Processing**: Verifying image and media handling

For the complete testing strategy, see [[testing-and-automation-strategy]].

## 11. Lessons Learned: Test Configuration, Duplication, and Plugin Strategy (2025-06-03)

### 11.1 Robust Test Configuration

- **Jest Test Scope**: Ensure Jest is configured to only run tests from `src/` directories, not from compiled `dist/` output. This avoids duplicate/conflicting test runs and ensures only source-of-truth tests are executed.
- **testMatch Example**:
  ```js
  // jest.config.js
  module.exports = {
    testMatch: ['**/src/**/*.test.ts'],
    // ...other config
  };
  ```
- **Per-Package Jest Config**: Each package can have its own Jest config, but the root config should not include both `src/` and `dist/` patterns.
- **TypeScript Interop**: When mixing ESM and CommonJS, prefer using `require('./index').default || require('./index').provideContentTo11ty` in tests to ensure compatibility with both module systems.

### 11.2 Avoiding Duplication of Responsibilities

- **Leverage Existing 11ty Plugins**: Before implementing custom logic (e.g., for wikilinks, SEO, images), check for mature 11ty plugins or npm packages. Integrate them via the plugin system rather than duplicating their functionality.
- **Plugin Boundaries**: Core should only provide plugin hooks and orchestration. All content transformation (wikilinks, embeds, SEO, etc.) should be implemented as plugins, not in the core or adapter.
- **Adapter Role**: The 11ty adapter should focus on template integration, data cascade, and build optimization. Avoid embedding business logic that belongs in plugins.
- **CLI Role**: The CLI should only orchestrate workflows and not duplicate logic from core, adapter, or plugins.

### 11.3 Test Failures and Debugging

- **Current Known Issue**: The 11ty adapter test suite has a persistent interop issue (`provideContentTo11ty is not a function`). This is due to TypeScript/ESM/CommonJS export differences. The recommended workaround is to use the robust require pattern above.
- **Test Cleanup**: Always clean up temporary files and directories in tests to avoid race conditions and file lock issues, especially on Windows.
- **Debug Output**: Use debug printouts in tests and implementation to confirm directory state and output paths during test runs.

### 11.4 General Code Review Against Spec & Roadmap

- **Responsibility Separation**: Review all packages to ensure they do not duplicate logic available in 11ty plugins or npm. For example, use `eleventy-plugin-interlinker` for wikilinks, and established SEO/image plugins where possible.
- **Plugin-First Approach**: All content and output transformations should be implemented as plugins, not hardcoded in core or adapters.
- **Test-Driven Development**: Tests should define the contract. Do not "hack" tests to pass; implementation must satisfy the test contract as written.
- **Documentation**: Document all configuration, plugin usage, and test setup in the main docs for future maintainers.

For more details, see the updated [[testing-and-automation-strategy]] and [[plugin-api]].

---

## 6. Deployment and Release Strategy

### 6.1 Package Release Workflow

NO-DIG packages are released using semantic-release via GitHub Actions:

- **@no-dig/cli**: Command-line interface package
- **@no-dig/core**: Core functionality package
- **@no-dig/adapter-11ty**: 11ty adapter package
- **@no-dig/plugins/*** : Official plugin packages

### 6.2 Semantic Versioning

All packages follow semantic versioning:

- **Major Version (X.0.0)**: Breaking changes
- **Minor Version (0.X.0)**: New features (backward-compatible)
- **Patch Version (0.0.X)**: Bug fixes and minor improvements

### 6.3 Website Deployment Options

NO-DIG supports multiple deployment targets:

- **Netlify**: Native 11ty support, form handling, branch deployments
- **Vercel**: Excellent performance, global edge network, advanced analytics
- **GitHub Pages**: Free for public repositories, simple workflow
- **Cloudflare Pages**: Unlimited bandwidth, global CDN, Workers integration
- **Self-Hosted Options**: Digital Ocean, AWS Amplify, Azure Static Web Apps

For detailed deployment information, see [[deployment-and-delivery-strategy]].

## 7. Implementation Roadmap

The implementation of NO-DIG follows a phased approach:

### 7.1 Phase 0: Foundation

- Package structure setup
- Core architecture implementation
- Basic CLI functionality
- Initial 11ty adapter

### 7.2 Phase 1: Core Features

- Obsidian vault parsing
- Wikilink processing
- Basic SEO features
- Template system

### 7.3 Phase 2: Advanced Features

- Plugin system
- Advanced SEO features
- Performance optimization
- Form handling

### 7.4 Phase 3: Polish and Extensions

- Additional plugins
- Documentation
- Examples and templates
- Community features

For the complete implementation roadmap, see [[roadmap/development-roadmap]].

## 8. Internationalization and Localization

NO-DIG supports internationalization and localization:

- **Multi-language Content**: Support for content in multiple languages
- **URL Structure**: Language-specific URL patterns
- **Metadata Localization**: Language-specific metadata
- **RTL Support**: Right-to-left language support
- **Translation Workflow**: Process for managing translations

For detailed i18n information, see [[internationalization-localization]].

## 9. Scalability Strategy

NO-DIG is designed to handle large content repositories:

- **Incremental Builds**: Only rebuild changed content
- **Caching Mechanisms**: Intelligent caching for faster builds
- **Parallel Processing**: Multi-threaded content processing
- **Memory Optimization**: Efficient memory usage for large vaults
- **Performance Monitoring**: Build performance tracking and optimization

For scalability details, see [[scalability-strategy]].

## 10. Conclusion

NO-DIG provides a comprehensive, modular solution for transforming Obsidian vaults into professional, SEO-optimized business websites. With its package-based architecture, powerful plugin system, and focus on developer experience, NO-DIG offers a flexible and maintainable approach to static site generation.

The combination of Obsidian as a content management system and NO-DIG's business-focused features creates a unique solution in the static site generator ecosystem that prioritizes SEO, performance, and user experience.

For implementation guidance, see the [[roadmap/development-roadmap]] and [[roadmap/github-issues]].
