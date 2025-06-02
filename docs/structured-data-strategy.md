# Structured Data Strategy for NO-DIG

## Overview

This document outlines the approach to implementing structured data in NO-DIG. The strategy focuses on simplicity, automation, and content-driven schema generation to maximize SEO benefits for business websites.

## Key Principles

1. **Minimal Frontmatter**: Require only essential schema information in frontmatter
2. **Content-Driven**: Derive schema properties from existing content where possible
3. **Smart Defaults**: Provide sensible defaults based on content type
4. **Flexible Override**: Allow granular overrides when needed

## Implementation Strategy

### 1. Schema Type Selection

Instead of requiring detailed structured data in frontmatter, users simply specify a schema type:

```yaml
---
title: "How to Optimize Your Business Website"
date: 2025-01-15
author: "Jane Doe"
schemaType: "Article"
---
```

### 2. Automatic Property Mapping

The system automatically maps common frontmatter fields to schema properties:

| Frontmatter Field | Schema Properties |
|-------------------|-------------------|
| `title` | `name`, `headline` |
| `description` | `description` |
| `date` | `datePublished` |
| `lastModified` | `dateModified` |
| `author` | `author.name` |
| `image` | `image` |
| `tags` | `keywords` |

### 3. Content-Driven Schema Generation

For specific schema types, the system can parse content structure:

#### FAQPage Schema

```yaml
---
title: "Frequently Asked Questions"
schemaType: "FAQPage"
---

## What is NO-DIG?
NO-DIG is an SEO-first static site generator that transforms Obsidian vaults into business-ready websites.

## How do I install it?
You can install it using npm with the command `npm install -g no-dig`.
```

The system automatically generates:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is NO-DIG?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "NO-DIG is an SEO-first static site generator that transforms Obsidian vaults into business-ready websites."
      }
    },
    {
      "@type": "Question",
      "name": "How do I install it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can install it using npm with the command `npm install -g no-dig`."
      }
    }
  ]
}
```

#### HowTo Schema

```yaml
---
title: "How to Build a Business Website with NO-DIG"
schemaType: "HowTo"
---

# How to Build a Business Website with NO-DIG

Tools needed:
- Node.js
- npm
- Obsidian
- Text editor

## Step 1: Install NO-DIG
First, install NO-DIG using npm with `npm install -g no-dig`.

## Step 2: Initialize your project
Run `no-dig init my-business-site` to create a new project.
```

The system automatically generates:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Build a Business Website with NO-DIG",
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Node.js"
    },
    {
      "@type": "HowToTool",
      "name": "npm"
    },
    {
      "@type": "HowToTool",
      "name": "Obsidian"
    },
    {
      "@type": "HowToTool",
      "name": "Text editor"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Install NO-DIG",
      "text": "First, install NO-DIG using npm with `npm install -g no-dig`."
    },
    {
      "@type": "HowToStep",
      "name": "Initialize your project",
      "text": "Run `no-dig init my-business-site` to create a new project."
    }
  ]
}
```

### 4. Schema-Specific Frontmatter Extensions

For schema types that need additional properties, specific frontmatter extensions can be used:

```yaml
---
title: "Local Business Example"
schemaType: "LocalBusiness"
business:
  type: "Restaurant"
  priceRange: "$$"
  telephone: "+1-123-456-7890"
  address:
    street: "123 Main St"
    city: "Anytown"
    state: "CA"
    postalCode: "12345"
    country: "US"
---
```

### 5. Implementation Code

#### Schema Generator Function

```javascript
// packages/core/src/schema/schema-generator.js
function generateSchema(page, site) {
  // Get schema type from frontmatter or default to WebPage
  const schemaType = page.data.schemaType || "WebPage";
  
  // Create base schema object
  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": page.data.title,
    "description": page.data.description || extractDescription(page.content),
    "url": new URL(page.url, site.url).toString()
  };
  
  // Add common properties based on frontmatter
  if (page.data.date) {
    schema.datePublished = formatDate(page.data.date);
  }
  
  if (page.data.lastModified) {
    schema.dateModified = formatDate(page.data.lastModified);
  } else if (page.data.date) {
    schema.dateModified = formatDate(page.data.date);
  }
  
  if (page.data.author) {
    schema.author = {
      "@type": "Person",
      "name": page.data.author
    };
  }
  
  if (page.data.image) {
    schema.image = new URL(page.data.image, site.url).toString();
  }
  
  if (page.data.tags && Array.isArray(page.data.tags)) {
    schema.keywords = page.data.tags.join(", ");
  }
  
  // Add schema-specific properties
  switch (schemaType) {
    case "Article":
    case "BlogPosting":
      // Add article-specific properties
      break;
      
    case "LocalBusiness":
      if (page.data.business) {
        Object.assign(schema, mapBusinessData(page.data.business));
      }
      break;
      
    case "FAQPage":
      schema.mainEntity = extractFAQs(page.content);
      break;
      
    case "HowTo":
      schema.step = extractHowToSteps(page.content);
      if (page.data.tools) {
        schema.tool = page.data.tools.map(tool => ({
          "@type": "HowToTool",
          "name": tool
        }));
      }
      break;
  }
  
  return schema;
}
```

#### Content Parsers

```javascript
// Extract FAQs from content
function extractFAQs(content) {
  const faqs = [];
  const regex = /## (.+?)\n([\s\S]+?)(?=## |$)/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim();
    
    faqs.push({
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    });
  }
  
  return faqs;
}

// Extract HowTo steps from content
function extractHowToSteps(content) {
  const steps = [];
  const regex = /## Step \d+: (.+?)\n([\s\S]+?)(?=## |$)/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const name = match[1].trim();
    const text = match[2].trim();
    
    steps.push({
      "@type": "HowToStep",
      "name": name,
      "text": text
    });
  }
  
  return steps;
}
```

### 6. Template Integration

```html
<!-- Template integration in adapter-11ty package -->
<script type="application/ld+json">
  {{ generateSchema(page, site) | safe }}
</script>
```

## Supported Schema Types

NO-DIG provides optimized support for these schema types:

1. **WebPage** (default)
2. **Article** / **BlogPosting**
3. **FAQPage**
4. **HowTo**
5. **LocalBusiness**
6. **Product**
7. **Event**
8. **Person**
9. **Organization**
10. **BreadcrumbList** (automatically generated for all pages)

## Configuration Options

### Global Schema Settings

```javascript
// no-dig.config.js
module.exports = {
  // Site configuration
  site: {
    title: "My Business Site",
    url: "https://example.com"
  },
  
  // SEO configuration
  seo: {
    schema: {
      defaultType: "WebPage",
      siteSchema: {
        "@type": "WebSite",
        "name": "My Business Site",
        "url": "https://example.com"
      },
      organizationSchema: {
        "@type": "Organization",
        "name": "My Organization",
        "logo": "https://example.com/logo.png"
      },
      defaultAuthor: {
        "@type": "Person",
        "name": "Default Author",
        "url": "https://example.com/about"
      }
    }
  }
};
```

### Custom Schema Definitions

Users can define custom schema mappings:

```javascript
// no-dig.config.js
module.exports = {
  // ... other configuration
  
  // Custom schema mappings
  plugins: [
    {
      name: "custom-schema",
      options: {
        schemaMappings: {
          Recipe: {
            frontmatterMapping: {
              cookTime: "cookTime",
              prepTime: "prepTime",
              totalTime: "totalTime",
              recipeYield: "recipeYield",
              recipeCategory: "recipeCategory"
            },
            contentMapping: {
              ingredients: {
                selector: "h2:contains('Ingredients') + ul li",
                property: "recipeIngredient",
                isArray: true
              },
              instructions: {
                selector: "h2:contains('Instructions') + ol li",
                property: "recipeInstructions",
                isArray: true,
                transform: (items) => items.map((item, index) => ({
                  "@type": "HowToStep",
                  "position": index + 1,
                  "text": item
                }))
              }
            }
          }
        }
      }
    }
  ]
};
```

## Business-Specific Schema Types

NO-DIG provides enhanced support for business-specific schema types:

### Product Schema

```yaml
---
title: "Premium Widget"
schemaType: "Product"
product:
  price: 99.99
  priceCurrency: "USD"
  availability: "InStock"
  brand: "WidgetCo"
  sku: "WDG-001"
  reviewCount: 42
  ratingValue: 4.5
---
```

### Service Schema

```yaml
---
title: "Consulting Services"
schemaType: "Service"
service:
  serviceType: "Business Consulting"
  provider: "ConsultCo"
  areaServed: "United States"
  availableChannel: "Online"
  price: "Starting at $199"
---
```

### Event Schema

```yaml
---
title: "Annual Business Conference"
schemaType: "Event"
event:
  startDate: "2025-06-15T09:00"
  endDate: "2025-06-17T17:00"
  location: "Convention Center, New York"
  price: 299
  priceCurrency: "USD"
  availability: "LimitedAvailability"
  performer: "Various Industry Experts"
  organizer: "Business Events Inc."
---
```

## Benefits of This Approach

1. **Simplicity**: Users only need to specify a schema type, not all properties
2. **Automation**: Most schema properties are derived from existing content
3. **Flexibility**: Custom schema types and mappings can be defined
4. **Content-Driven**: Schema generation follows content structure
5. **Maintainability**: Schema logic is centralized and consistent
6. **Business-Focused**: Enhanced support for business-specific schema types

## Conclusion

This structured data strategy provides an intuitive and efficient approach to implementing schema.org markup in NO-DIG. By focusing on content-driven schema generation with minimal frontmatter requirements, it simplifies the content creation process while ensuring comprehensive structured data support for business websites.
