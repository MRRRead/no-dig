# Architecture and Features

## NO-DIG Package Ecosystem Architecture

NO-DIG employs a modular, package-based architecture designed for maintainability, extensibility, and performance. The system is organized into a set of independent but interconnected packages that work together to provide a complete static site generation solution.

### Package Ecosystem Overview

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

### Core Package (`@no-dig/core`)

The Core package is responsible for:

- **Obsidian Vault Parsing**: Reading and interpreting Obsidian vault structure and content
- **Plugin Host System**: Providing the infrastructure for plugins to hook into the build process
- **Markdown Processing**: Transforming Obsidian-flavored markdown to HTML
- **Wikilink Resolution**: Converting Obsidian wikilinks to proper HTML links
- **Metadata Management**: Extracting and processing frontmatter for SEO and configuration
- **Content Transformation**: Applying transformations for SEO and optimization

This package has no dependencies on specific static site generators, making it adaptable to different output targets through adapter packages.

### CLI Package (`@no-dig/cli`)

The CLI package provides:

- **Command Line Interface**: User-friendly commands for project management
- **Project Scaffolding**: Templates and initialization for new projects (`no-dig init`)
- **Build Process Management**: Orchestration of the build pipeline (`no-dig build`)
- **Development Server**: Local preview capabilities (`no-dig serve`)
- **Plugin Management**: Commands for adding and configuring plugins
- **Deployment Utilities**: Integration with various deployment targets

The CLI is designed to be intuitive for developers while providing powerful capabilities for advanced users, serving as the primary entry point for NO-DIG usage.

### Adapter-11ty Package (`@no-dig/adapter-11ty`)

The Adapter-11ty package:

- **Integrates with 11ty**: Connects NO-DIG core to 11ty static site generator
- **Template Management**: Handles 11ty templates and layouts
- **Data Cascade**: Manages the 11ty data cascade for configuration
- **Plugin Integration**: Connects with 11ty plugins for extended functionality
- **Build Optimization**: Implements 11ty-specific optimizations

This adapter architecture allows for potential future adapters for other static site generators (e.g., `@no-dig/adapter-astro`, `@no-dig/adapter-next`).

### Plugin Packages (`@no-dig/plugins/*`)

NO-DIG's functionality is extended through a series of official plugins:

- **@no-dig/plugins/seo**: SEO optimization features
- **@no-dig/plugins/sitemap**: Sitemap generation
- **@no-dig/plugins/images**: Advanced image optimization
- **@no-dig/plugins/schema**: Structured data generation
- **@no-dig/plugins/forms**: Contact form handling
- **@no-dig/plugins/analytics**: Privacy-focused analytics
- **@no-dig/plugins/i18n**: Internationalization support

Each plugin is independently versioned and can be installed as needed, allowing for a customized build process tailored to specific project requirements.

## Package Interaction Flow

The typical flow of data through the NO-DIG package ecosystem:

1. **User Invokes CLI**: `no-dig build` command is executed
2. **CLI Loads Configuration**: Project configuration is loaded
3. **Core Processes Vault**: Obsidian vault is parsed and processed
4. **Plugins Apply Transformations**: Each plugin hooks into the build process
5. **Adapter Generates Output**: The adapter (e.g., 11ty) produces the final output
6. **CLI Handles Output**: Results are written to the output directory

This modular approach allows for:
- Independent development and versioning of components
- Customizable feature sets through plugin selection
- Flexibility to adapt to different static site generators
- Clearer separation of concerns

## Key Features

### Business-Focused Website Generation

Unlike "digital garden" tools that focus on personal knowledge bases, NO-DIG is specifically designed for professional business websites:

- **Conversion-Optimized Templates**: Layouts designed for business goals and conversions
- **Call-to-Action Components**: Pre-built components for effective CTAs
- **Business Schema Support**: Structured data for LocalBusiness, Organization, and Product
- **Professional Navigation**: Business-appropriate navigation patterns
- **Contact and Lead Generation**: Forms and lead capture capabilities

### SEO-First Architecture

Every aspect of NO-DIG is designed with search engine optimization as a primary consideration:

- **Structured Data Generation**: Automatic schema.org markup based on content type
- **Technical SEO Elements**: Canonical URLs, hreflang, meta tags, and more
- **Performance Optimization**: Core Web Vitals focus for better rankings
- **Content Structure**: SEO-optimized HTML structure and heading hierarchy
- **Internal Linking**: Semantic internal linking for better crawlability

### Obsidian as a CMS

NO-DIG leverages Obsidian as a powerful content management system:

- **Full Wikilink Support**: Proper handling of all Obsidian wikilink formats
- **Vault Structure Preservation**: URL structure mirrors Obsidian organization
- **Templater Integration**: Compatible with Obsidian Templater for content creation
- **Metadata Extraction**: Frontmatter parsing for SEO and configuration
- **Media Management**: Proper handling of embedded images and media

### Performance Optimization

NO-DIG implements comprehensive performance optimizations:

- **Image Processing Pipeline**: WebP/AVIF conversion and responsive images
- **CSS Optimization**: Critical CSS extraction and minimal footprint
- **JavaScript Efficiency**: Minimal JS with proper loading strategies
- **Font Optimization**: WOFF2 with subsetting and proper loading
- **Caching Strategy**: Optimal cache headers and asset versioning

### Developer Experience

NO-DIG prioritizes developer experience:

- **Intuitive CLI**: Simple commands for common operations
- **Clear Documentation**: Comprehensive guides and references
- **Type Safety**: TypeScript throughout for better tooling
- **Plugin Architecture**: Extensible system for customization
- **Local Development**: Fast development server with hot reloading

### Privacy and Compliance

NO-DIG is built with privacy and compliance in mind:

- **GDPR Compliance**: Privacy-first approach to data collection
- **Cookie Consent**: Built-in cookie consent management
- **Analytics Options**: Privacy-focused analytics integration
- **Data Minimization**: Only essential data collection by default
- **Transparency**: Clear documentation of data practices

## Why Packages?

NO-DIG has adopted a package-based architecture for several compelling reasons:

### 1. Modularity and Flexibility

The package ecosystem allows users to install only what they need. A simple blog might use just the core and SEO plugins, while a complex business site could utilize the full suite of plugins.

### 2. Independent Versioning

Each package can evolve at its own pace with semantic versioning, allowing for:
- Bug fixes without disrupting the entire ecosystem
- Feature additions in specific areas
- Breaking changes that only affect relevant components

### 3. Clearer Separation of Concerns

Each package has a well-defined responsibility:
- Core handles fundamental parsing and transformation
- Adapters handle specific static site generator integration
- Plugins handle specific feature domains
- CLI provides the user interface

### 4. Easier Maintenance and Contribution

Contributors can focus on specific packages without needing to understand the entire codebase, lowering the barrier to contribution.

### 5. Future Extensibility

The package architecture makes it easier to:
- Add new adapters for different static site generators
- Develop third-party plugins
- Create specialized versions for specific industries or use cases

## Versioning Policy

NO-DIG follows semantic versioning (SemVer) for all packages:

- **Major Version (X.0.0)**: Breaking changes that require user action
- **Minor Version (0.X.0)**: New features in a backward-compatible manner
- **Patch Version (0.0.X)**: Bug fixes and minor improvements

Packages are versioned independently, but major releases are typically coordinated across the ecosystem to ensure compatibility.

## Conclusion

NO-DIG's package-based architecture and features are designed to create a powerful, SEO-optimized static site generator specifically for business websites. By leveraging Obsidian as a content source and implementing best practices for performance, SEO, and developer experience, NO-DIG provides a unique solution in the static site generator ecosystem that is both modular and extensible.
