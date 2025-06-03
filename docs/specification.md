# NO-DIG Specification

> **SEO-First Business Websites from Obsidian**  
> _Not a Digital Garden._ 🚀

## Overview

NO-DIG is an open-source static site generator that transforms structured Obsidian vaults into fast, SEO-optimized, business-ready websites. Unlike "digital garden" tools, NO-DIG is specifically designed for professional business websites with a focus on search engine optimization, performance, and conversion.

## Core Principles

1. **SEO-First Architecture**: Every aspect of NO-DIG is designed with search engine optimization as a primary consideration.
2. **Business-Focused**: Built for commercial websites, not personal knowledge bases or digital gardens.
3. **Performance-Optimized**: Targeting perfect PageSpeed scores and Core Web Vitals metrics.
4. **Clean Code**: Following Uncle Bob's SOLID principles and DRY methodology throughout.
5. **Privacy-Friendly**: GDPR-compliant by default with no vendor lock-in.
6. **Developer Experience**: Intuitive CLI and plugin architecture for efficient workflows.

## Architecture

NO-DIG uses a modular, monorepo architecture with three core packages:

1. **Core Package**: Handles Obsidian vault parsing, content transformation, and SEO optimization.
2. **CLI Package**: Provides command-line interface for project initialization, building, and deployment.
3. **Adapter-11ty Package**: Integrates with 11ty (Eleventy) for static site generation.

This architecture allows for:
- Clear separation of concerns
- Extensibility through additional adapters
- Maintainable, testable code
- Focused functionality in each package

## Key Features

### Obsidian Compatibility

- **Wikilink Processing**: Full support for Obsidian-style wikilinks with proper alias handling
- **Vault Structure Preservation**: URL structure follows Obsidian folder organization
- **Metadata Extraction**: Frontmatter parsing for SEO and content configuration
- **Embedded Content**: Support for embedded notes, images, and other media
- **Tag Management**: Automatic tag page generation and cross-referencing

### SEO Optimization

- **Structured Data**: Automatic generation of schema.org markup based on content type
- **Metadata Management**: Smart defaults with manual override capabilities
- **Technical SEO**: Canonical URLs, hreflang, robots.txt, and other technical elements
- **Sitemap Generation**: Automatic XML sitemap creation with priority and change frequency
- **Performance Optimization**: Core Web Vitals optimization for better search rankings

### Content Management

- **Component System**: Reusable content blocks through shortcodes or components
- **Navigation Management**: Automatic and manual navigation structure generation
- **Breadcrumb Generation**: Context-aware breadcrumb trails for improved UX and SEO
- **Pagination**: Smart pagination for large content collections
- **Internationalization**: Multi-language support with proper URL structure

### Performance

- **Image Optimization**: Automatic WebP/AVIF conversion and responsive image generation
- **CSS Optimization**: Critical CSS extraction and deferred loading
- **JavaScript Optimization**: Code splitting, tree shaking, and lazy loading
- **Font Optimization**: WOFF2 conversion and font subsetting
- **Caching Strategy**: Optimal cache headers and versioning

### Business Features

- **Contact Forms**: Flexible form handling with multiple provider support
- **Analytics Integration**: Privacy-focused analytics with cookie consent
- **Conversion Optimization**: A/B testing capabilities and conversion tracking
- **E-commerce Readiness**: Structured data for products and integration points for e-commerce
- **Accessibility**: WCAG compliance for inclusive user experience

## Technical Implementation

### Content Processing Pipeline

1. **Vault Parsing**: Read and parse Obsidian vault structure
2. **Markdown Transformation**: Convert Obsidian-flavored markdown to HTML
3. **Wikilink Processing**: Transform wikilinks to proper HTML links
4. **Metadata Extraction**: Parse frontmatter for SEO and configuration
5. **SEO Enhancement**: Add structured data, canonical URLs, and other SEO elements
6. **Template Application**: Apply templates based on content type
7. **Asset Optimization**: Process and optimize images, CSS, and JavaScript
8. **Output Generation**: Generate final HTML, CSS, JavaScript, and assets

**Current Status (June 2025):**
- Steps 1-7 are implemented and tested in the core pipeline and plugin system.
- **Step 3 (Wikilink Processing) is only partially complete:** Wikilinks are correctly processed in the core/plugin pipeline, but the final 11ty build output does not render them as HTML links due to a plugin resolution issue. This is the last blocker for full Phase 1 completion.

### Next Steps
- Resolve 11ty plugin resolution so that wikilinks are rendered as HTML links in the built site.
- Update integration tests to check the actual HTML output from 11ty, not just the core/plugin transform.

### CLI Workflow

```bash
# Install CLI
npm install -g no-dig

# Initialize project
no-dig init my-business-site

# Build the site
cd my-business-site
npm run build

# Serve locally
npm run preview

# Deploy (with adapter support)
no-dig deploy --adapter=netlify
```

### Configuration

NO-DIG uses a configuration file (`no-dig.config.js`) for project-wide settings:

```javascript
module.exports = {
  // Source Obsidian vault
  vault: './content',
  
  // Output directory
  output: './dist',
  
  // Site metadata
  site: {
    title: 'My Business Site',
    description: 'Professional business website',
    url: 'https://example.com',
    lang: 'en',
    locale: 'en_US'
  },
  
  // SEO configuration
  seo: {
    defaultSchemaType: 'WebSite',
    generateSitemap: true,
    generateRobotsTxt: true
  },
  
  // Performance optimization
  performance: {
    images: {
      formats: ['webp', 'avif', 'original'],
      sizes: [640, 1024, 1600]
    },
    fonts: {
      display: 'swap',
      preload: true
    }
  },
  
  // Plugins
  plugins: [
    // Plugin configuration
  ]
}
```

### Frontmatter

NO-DIG uses frontmatter for page-specific configuration:

```yaml
---
title: "Product Page"
description: "Our flagship product details"
schemaType: "Product"
product:
  name: "Premium Widget"
  price: 99.99
  currency: "USD"
  availability: "InStock"
image: "product-hero.jpg"
noIndex: false
canonical: "https://example.com/products/premium-widget"
---
```

## Plugin System

NO-DIG includes a plugin system for extending functionality:

```javascript
// Example plugin
module.exports = function(options) {
  return {
    name: 'my-plugin',
    
    // Hook into the build process
    beforeBuild(vault, config) {
      // Pre-processing logic
    },
    
    // Transform content
    transformContent(content, metadata) {
      // Content transformation logic
      return transformedContent;
    },
    
    // Post-processing
    afterBuild(output, stats) {
      // Post-processing logic
    }
  };
};
```

## Deployment

NO-DIG supports multiple deployment targets through adapters:

- Netlify
- Vercel
- GitHub Pages
- AWS S3/CloudFront
- Custom FTP/SFTP

## Development Roadmap

See the [[roadmap/development-roadmap]] for a detailed implementation plan.

## Conclusion

NO-DIG provides a comprehensive solution for transforming Obsidian vaults into professional, SEO-optimized business websites. With its focus on search engine optimization, performance, and business features, NO-DIG fills a gap in the static site generator ecosystem for business-focused websites that leverage the power of Obsidian for content management.
