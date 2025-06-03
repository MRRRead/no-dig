# 11ty Plugin Integration Strategy for NO-DIG

## Overview

This document outlines the strategy for integrating existing 11ty plugins and npm packages into the NO-DIG package ecosystem. It provides a comprehensive analysis of recommended plugins, their integration points within the modular architecture, and customization requirements to align with NO-DIG's business-focused, SEO-first approach.

## Integration Philosophy

NO-DIG follows these principles when integrating external plugins:

1. **Wrap, Don't Fork**: Whenever possible, wrap existing plugins rather than forking them
2. **Consistent API**: Provide a consistent API regardless of underlying implementation
3. **Sensible Defaults**: Configure plugins with business-focused defaults
4. **Extensibility**: Ensure all integrations remain extensible by end users
5. **Versioning Alignment**: Maintain compatibility with specific versions of underlying plugins

## Recommended Plugin Integrations

### 1. Wikilinks and Backlinking

#### Primary: photogabble/eleventy-plugin-interlinker

**Repository**: [https://github.com/photogabble/eleventy-plugin-interlinker](https://github.com/photogabble/eleventy-plugin-interlinker)

**Integration Strategy**:
- Wrap in `@no-dig/plugin-wikilinks` package
- Extend with business-specific link processing
- Add SEO-optimized URL generation
- Implement custom resolver for business hierarchies

```javascript
// Example integration in @no-dig/plugin-wikilinks
import interlinker from 'eleventy-plugin-interlinker';

export default function(options = {}) {
  return {
    name: 'wikilinks',
    
    initialize({ config }) {
      // Configure interlinker with NO-DIG defaults
      const interlinkerOptions = {
        baseDir: options.baseDir || 'content',
        titleAttr: options.titleAttr !== false,
        ...options.interlinker
      };
      
      // Apply the plugin to 11ty
      config.addPlugin(interlinker, interlinkerOptions);
      
      // Add NO-DIG specific extensions
      config.addFilter('seoWikilinkUrl', (url) => {
        // Transform to SEO-friendly URL
        return url.toLowerCase().replace(/\s+/g, '-');
      });
    }
  };
}
```

### 2. Structured Data

#### Primary: quasibit/eleventy-plugin-schema

**Repository**: [https://github.com/quasibit/eleventy-plugin-schema](https://github.com/quasibit/eleventy-plugin-schema)

**Integration Strategy**:
- Wrap in `@no-dig/plugin-schema` package
- Add business-specific schema types (LocalBusiness, Product, Service)
- Implement content-driven schema generation
- Add schema validation

```javascript
// Example integration in @no-dig/plugin-schema
import schema from '@quasibit/eleventy-plugin-schema';

export default function(options = {}) {
  return {
    name: 'schema',
    
    initialize({ config }) {
      // Configure schema with NO-DIG defaults
      const schemaOptions = {
        typeDefault: 'WebPage',
        ...options
      };
      
      // Apply the plugin to 11ty
      config.addPlugin(schema, schemaOptions);
      
      // Add business-specific schema types
      config.addShortcode('localBusinessSchema', function(data) {
        // Generate LocalBusiness schema
        const localBusinessData = {
          '@type': 'LocalBusiness',
          name: data.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address.street,
            addressLocality: data.address.city,
            addressRegion: data.address.region,
            postalCode: data.address.postalCode,
            addressCountry: data.address.country
          },
          telephone: data.telephone,
          openingHours: data.openingHours
        };
        
        return JSON.stringify(localBusinessData);
      });
    }
  };
}
```

### 3. Image Optimization

#### Primary: @11ty/eleventy-img

**Repository**: [https://github.com/11ty/eleventy-img](https://github.com/11ty/eleventy-img)

**Integration Strategy**:
- Wrap in `@no-dig/plugin-images` package
- Configure for business-optimized defaults (WebP, AVIF)
- Add automatic alt text generation
- Implement lazy loading by default
- Add image SEO enhancements (EXIF preservation, caption extraction)

```javascript
// Example integration in @no-dig/plugin-images
import Image from '@11ty/eleventy-img';

export default function(options = {}) {
  return {
    name: 'images',
    
    initialize({ config }) {
      // Configure with NO-DIG defaults
      const defaultOptions = {
        widths: [320, 640, 960, 1280, 1600, 2000],
        formats: ['avif', 'webp', 'jpeg'],
        urlPath: '/assets/images/',
        outputDir: './dist/assets/images/',
        ...options
      };
      
      // Add responsive image shortcode
      config.addShortcode('image', async function(src, alt, sizes = '100vw') {
        if (!alt) {
          // Generate alt text from filename if not provided
          alt = src.split('/').pop().split('.')[0]
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        }
        
        let metadata = await Image(src, defaultOptions);
        
        return Image.generateHTML(metadata, {
          alt,
          sizes,
          loading: 'lazy',
          decoding: 'async'
        });
      });
    }
  };
}
```

### 4. Contact Forms

#### Primary: Formspree (platform-agnostic)

**Integration Strategy**:
- Create `@no-dig/plugin-forms` package
- Implement shortcodes for common form patterns
- Add GDPR-compliant data collection
- Include spam protection
- Support multiple backends (Formspree, Netlify, custom)

```javascript
// Example integration in @no-dig/plugin-forms
export default function(options = {}) {
  return {
    name: 'forms',
    
    initialize({ config }) {
      // Configure with NO-DIG defaults
      const defaultOptions = {
        provider: 'formspree',
        formspreeEndpoint: options.formspreeEndpoint,
        recaptcha: options.recaptcha !== false,
        ...options
      };
      
      // Add contact form shortcode
      config.addPairedShortcode('contactForm', function(content, formId) {
        const endpoint = defaultOptions.provider === 'formspree' 
          ? `https://formspree.io/f/${defaultOptions.formspreeEndpoint}`
          : '/api/contact';
          
        return `
          <form action="${endpoint}" method="POST" class="contact-form" id="${formId || 'contact-form'}">
            <input type="hidden" name="_subject" value="New contact form submission">
            ${defaultOptions.recaptcha ? '<div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>' : ''}
            ${content}
            <button type="submit">Send</button>
          </form>
        `;
      });
    }
  };
}
```

### 5. SEO Optimization

#### Primary: @quasibit/eleventy-plugin-sitemap + Custom Implementation

**Repository**: [https://github.com/quasibit/eleventy-plugin-sitemap](https://github.com/quasibit/eleventy-plugin-sitemap)

**Integration Strategy**:
- Create `@no-dig/plugin-seo` package
- Integrate sitemap generation
- Add meta tag management
- Implement canonical URL handling
- Add OpenGraph and Twitter card support
- Include robots.txt generation

```javascript
// Example integration in @no-dig/plugin-seo
import sitemap from '@quasibit/eleventy-plugin-sitemap';

export default function(options = {}) {
  return {
    name: 'seo',
    
    initialize({ config }) {
      // Configure sitemap with NO-DIG defaults
      const sitemapOptions = {
        sitemap: {
          hostname: options.hostname || 'https://example.com'
        },
        ...options.sitemap
      };
      
      // Apply the sitemap plugin to 11ty
      config.addPlugin(sitemap, sitemapOptions);
      
      // Add SEO shortcode
      config.addShortcode('seoMeta', function(data) {
        const seo = {
          title: data.title || data.site.title,
          description: data.description || data.site.description,
          url: new URL(data.page.url, data.site.url).href,
          image: data.image || data.site.image,
          ...data.seo
        };
        
        return `
          <title>${seo.title}</title>
          <meta name="description" content="${seo.description}">
          <link rel="canonical" href="${seo.url}">
          
          <!-- Open Graph -->
          <meta property="og:title" content="${seo.title}">
          <meta property="og:description" content="${seo.description}">
          <meta property="og:url" content="${seo.url}">
          <meta property="og:image" content="${seo.image}">
          <meta property="og:type" content="${seo.type || 'website'}">
          
          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${seo.title}">
          <meta name="twitter:description" content="${seo.description}">
          <meta name="twitter:image" content="${seo.image}">
        `;
      });
      
      // Add robots.txt generation
      config.addPassthroughCopy({
        'src/robots.txt': '/robots.txt'
      });
    }
  };
}
```

### 6. Component System

#### Primary: WebC + Native 11ty Shortcodes

**Repository**: [https://github.com/11ty/webc](https://github.com/11ty/webc)

**Integration Strategy**:
- Create `@no-dig/plugin-components` package
- Integrate WebC for complex components
- Provide business-focused component library
- Implement shortcodes for common patterns
- Add Obsidian-compatible component syntax

```javascript
// Example integration in @no-dig/plugin-components
import { WebC } from '@11ty/webc';

export default function(options = {}) {
  return {
    name: 'components',
    
    initialize({ config }) {
      // Configure WebC with NO-DIG defaults
      const webcOptions = {
        components: ['src/components/**/*.webc'],
        ...options.webc
      };
      
      // Apply WebC to 11ty
      config.addPlugin(WebC, webcOptions);
      
      // Add business component shortcodes
      config.addShortcode('cta', function(text, url, type = 'primary') {
        return `<a href="${url}" class="cta cta-${type}">${text}</a>`;
      });
      
      config.addPairedShortcode('testimonial', function(content, author, company) {
        return `
          <blockquote class="testimonial">
            ${content}
            <footer>
              <cite>${author}${company ? `, ${company}` : ''}</cite>
            </footer>
          </blockquote>
        `;
      });
    }
  };
}
```

### 7. Analytics Integration

#### Primary: Custom Implementation

**Integration Strategy**:
- Create `@no-dig/plugin-analytics` package
- Support multiple providers (Google Analytics, Plausible, Fathom)
- Implement privacy-first approach
- Add cookie consent integration
- Include data layer management for GTM

```javascript
// Example integration in @no-dig/plugin-analytics
export default function(options = {}) {
  return {
    name: 'analytics',
    
    initialize({ config }) {
      // Configure with NO-DIG defaults
      const defaultOptions = {
        provider: options.provider || 'google',
        id: options.id,
        cookieConsent: options.cookieConsent !== false,
        anonymizeIp: options.anonymizeIp !== false,
        ...options
      };
      
      // Add analytics shortcode
      config.addShortcode('analytics', function() {
        if (defaultOptions.provider === 'google') {
          return `
            <!-- Google Analytics -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=${defaultOptions.id}"></script>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${defaultOptions.id}', {
                'anonymize_ip': ${defaultOptions.anonymizeIp}
              });
            </script>
          `;
        } else if (defaultOptions.provider === 'plausible') {
          return `
            <!-- Plausible Analytics -->
            <script async defer data-domain="${defaultOptions.domain}" src="https://plausible.io/js/plausible.js"></script>
          `;
        }
        
        return '';
      });
    }
  };
}
```

## Integration with NO-DIG Architecture

### Package Structure

The plugin integrations will be organized as separate packages within the NO-DIG monorepo:

```
packages/
  core/
  cli/
  adapter-11ty/
  plugins/
    wikilinks/
    schema/
    images/
    forms/
    seo/
    components/
    analytics/
```

### Integration Points

Each plugin package will integrate with the NO-DIG architecture at these points:

1. **Core Plugin System**: Register with the core plugin host
2. **11ty Adapter**: Apply 11ty-specific configuration
3. **CLI**: Add plugin-specific commands where needed

```javascript
// Example integration in @no-dig/adapter-11ty
import { PluginHost } from '@no-dig/core';

export function configureEleventy(eleventyConfig, options = {}) {
  // Get registered plugins from PluginHost
  const plugins = PluginHost.getPlugins();
  
  // Initialize each plugin with 11ty config
  plugins.forEach(plugin => {
    if (typeof plugin.initialize === 'function') {
      plugin.initialize({ 
        config: eleventyConfig,
        options: options.plugins?.[plugin.name] || {}
      });
    }
  });
  
  // Additional 11ty configuration
  // ...
}
```

## Plugin Development Guidelines

When developing or extending plugins for NO-DIG, follow these guidelines:

1. **Consistent Interface**: All plugins should implement the same interface
   ```typescript
   interface NoDigPlugin {
     name: string;
     initialize: (context: { config: any, options: any }) => void;
     transformContent?: (content: string, metadata: Record<string, any>) => string;
     beforeBuild?: (context: any) => void;
     afterBuild?: (context: any) => void;
   }
   ```

2. **Versioning**: Follow semantic versioning aligned with the core packages

3. **Documentation**: Include comprehensive documentation with examples

4. **Testing**: Implement thorough testing, including integration tests with 11ty

5. **Performance**: Optimize for build performance, especially for large sites

## Conclusion

This integration strategy allows NO-DIG to leverage the best existing 11ty plugins while providing a consistent, business-focused API. By wrapping rather than forking plugins, NO-DIG can benefit from ongoing maintenance and updates to the underlying packages while adding value through business-specific defaults and extensions.

The modular architecture ensures that users can opt-in to specific functionality while maintaining a cohesive developer experience across all plugins.
