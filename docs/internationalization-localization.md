# Internationalization and Localization Strategy for NO-DIG

## 1. Introduction

This document outlines the internationalization (i18n) and localization (l10n) strategy for NO-DIG. Implementing proper i18n and l10n support is essential for creating globally accessible business websites that can reach audiences in their native languages while maintaining SEO benefits across multiple markets.

The strategy covers both technical implementation details and content workflow considerations, with a focus on creating a seamless experience for content creators working with multilingual content in Obsidian while ensuring the generated static sites follow best practices for internationalized web content.

## 2. Core Concepts and Terminology

### 2.1 Definitions

| Term | Definition | Relevance to Project |
|------|------------|----------------------|
| **Internationalization (i18n)** | The process of designing software to support multiple languages and regions | Framework for supporting multiple languages in the NO-DIG build system |
| **Localization (l10n)** | The process of adapting content for a specific locale or market | Workflow for creating and managing translated content |
| **Locale** | A set of parameters that defines language, region, and formatting preferences | Used to determine language-specific rendering and formatting |
| **Language Code** | ISO code representing a language (e.g., 'en', 'es', 'ja') | Used in URL structures and content organization |
| **Region Code** | ISO code representing a geographic region (e.g., 'US', 'GB', 'JP') | Used for region-specific formatting and content variations |
| **RTL Support** | Support for right-to-left text direction (e.g., Arabic, Hebrew) | Affects layout, CSS, and content flow |
| **Translation Memory** | Database of previously translated content | Improves consistency and efficiency in translation workflow |
| **String Externalization** | Process of separating translatable text from code | Enables easier translation of UI elements |

### 2.2 Key Principles

1. **Content-First Approach**: Prioritize content translation workflow over technical complexity
2. **Progressive Enhancement**: Start with basic language support and add features incrementally
3. **Separation of Concerns**: Keep content, presentation, and localization logic separate
4. **Flexibility**: Support multiple i18n approaches to accommodate different site requirements
5. **SEO Optimization**: Ensure all localized content follows SEO best practices
6. **Performance**: Minimize performance impact of i18n implementation
7. **Maintainability**: Create sustainable translation workflows for content creators

## 3. Technical Architecture

### 3.1 Directory Structure

The i18n implementation will support two primary approaches to content organization:

#### 3.1.1 Directory-Based Approach

```
content/
├── en/
│   ├── about.md
│   ├── blog/
│   │   ├── post-1.md
│   │   └── post-2.md
│   └── contact.md
├── es/
│   ├── about.md
│   ├── blog/
│   │   ├── post-1.md
│   │   └── post-2.md
│   └── contact.md
└── fr/
    ├── about.md
    ├── blog/
    │   ├── post-1.md
    │   └── post-2.md
    └── contact.md
```

#### 3.1.2 File-Based Approach

```
content/
├── about.md
├── about.es.md
├── about.fr.md
├── blog/
│   ├── post-1.md
│   ├── post-1.es.md
│   ├── post-1.fr.md
│   ├── post-2.md
│   ├── post-2.es.md
│   └── post-2.fr.md
├── contact.md
├── contact.es.md
└── contact.fr.md
```

#### 3.1.3 Hybrid Approach (For Complex Sites)

```
content/
├── _shared/
│   ├── components/
│   │   ├── header.md
│   │   ├── header.es.md
│   │   └── header.fr.md
│   └── images/
├── en/
│   ├── about.md
│   ├── blog/
│   │   ├── post-1.md
│   │   └── post-2.md
│   └── contact.md
├── es/
│   ├── about.md
│   ├── blog/
│   │   ├── post-1.md
│   │   └── post-2.md
│   └── contact.md
└── fr/
    ├── about.md
    ├── blog/
    │   ├── post-1.md
    │   └── post-2.md
    └── contact.md
```

### 3.2 URL Structure

The i18n implementation will support multiple URL structuring options:

#### 3.2.1 Language Subdirectory

```
https://example.com/en/about/
https://example.com/es/about/
https://example.com/fr/about/
```

#### 3.2.2 Language Subdomain

```
https://en.example.com/about/
https://es.example.com/about/
https://fr.example.com/about/
```

#### 3.2.3 Top-Level Domain

```
https://example.com/about/     (Default language)
https://example.es/about/
https://example.fr/about/
```

#### 3.2.4 URL Parameter (Not recommended for SEO)

```
https://example.com/about/?lang=en
https://example.com/about/?lang=es
https://example.com/about/?lang=fr
```

### 3.3 Implementation Approach

The i18n implementation will be based on the following components:

#### 3.3.1 Core i18n Plugin

```javascript
// packages/core/src/plugins/i18n.js
const i18n = (eleventyConfig, options = {}) => {
  const {
    defaultLanguage = 'en',
    supportedLanguages = ['en'],
    directoryStructure = 'directory', // 'directory', 'file', or 'hybrid'
    urlStructure = 'subdirectory', // 'subdirectory', 'subdomain', 'tld', or 'parameter'
    localeData = {},
    fallbackLanguage = 'en',
    markdownItPlugins = true,
    generateLanguageSwitcher = true
  } = options;
  
  // Register template collections for each language
  supportedLanguages.forEach(lang => {
    eleventyConfig.addCollection(`i18n_${lang}`, collection => {
      // Filter content by language based on directory structure
      if (directoryStructure === 'directory') {
        return collection.getFilteredByGlob(`content/${lang}/**/*.md`);
      } else if (directoryStructure === 'file') {
        if (lang === defaultLanguage) {
          return collection.getFilteredByGlob([
            'content/**/*.md',
            `!content/**/*.*.md` // Exclude files with language suffix
          ]);
        } else {
          return collection.getFilteredByGlob(`content/**/*.${lang}.md`);
        }
      } else if (directoryStructure === 'hybrid') {
        const items = [];
        
        // Add language-specific content
        items.push(...collection.getFilteredByGlob(`content/${lang}/**/*.md`));
        
        // Add shared content with language suffix
        items.push(...collection.getFilteredByGlob(`content/_shared/**/*.${lang}.md`));
        
        // Add shared content without language suffix (default language)
        if (lang === defaultLanguage) {
          items.push(...collection.getFilteredByGlob([
            'content/_shared/**/*.md',
            `!content/_shared/**/*.*.md` // Exclude files with language suffix
          ]));
        }
        
        return items;
      }
    });
  });
  
  // Add shortcode for language switcher
  if (generateLanguageSwitcher) {
    eleventyConfig.addShortcode('languageSwitcher', function(currentPage) {
      const currentLang = currentPage.lang || defaultLanguage;
      const currentPath = currentPage.url;
      
      let switcherHtml = '<ul class="language-switcher">';
      
      supportedLanguages.forEach(lang => {
        const isActive = lang === currentLang;
        const langUrl = getLocalizedUrl(currentPath, currentLang, lang, urlStructure);
        
        switcherHtml += `
          <li class="language-switcher__item${isActive ? ' language-switcher__item--active' : ''}">
            <a href="${langUrl}" lang="${lang}" hreflang="${lang}" class="language-switcher__link">
              ${localeData[lang]?.nativeName || lang.toUpperCase()}
            </a>
          </li>
        `;
      });
      
      switcherHtml += '</ul>';
      
      return switcherHtml;
    });
  }
  
  // Add filter for localizing URLs
  eleventyConfig.addFilter('localize', function(url, targetLang) {
    const currentLang = this.page?.lang || defaultLanguage;
    return getLocalizedUrl(url, currentLang, targetLang, urlStructure);
  });
  
  // Add filter for localizing dates
  eleventyConfig.addFilter('localizeDate', function(date, format = {}) {
    const lang = this.page?.lang || defaultLanguage;
    
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    try {
      return new Intl.DateTimeFormat(lang, format).format(dateObj);
    } catch (e) {
      console.error(`Error formatting date for locale ${lang}:`, e);
      return dateObj.toISOString().split('T')[0];
    }
  });
  
  // Add filter for localizing numbers
  eleventyConfig.addFilter('localizeNumber', function(num, options = {}) {
    const lang = this.page?.lang || defaultLanguage;
    
    if (num === undefined || num === null) return '';
    
    try {
      return new Intl.NumberFormat(lang, options).format(num);
    } catch (e) {
      console.error(`Error formatting number for locale ${lang}:`, e);
      return num.toString();
    }
  });
  
  // Add markdown-it plugins for i18n if enabled
  if (markdownItPlugins) {
    eleventyConfig.amendLibrary("md", mdLib => {
      mdLib.use(require('markdown-it-attrs'));
      
      // Custom plugin for inline language annotations
      mdLib.use(md => {
        const defaultRender = md.renderer.rules.text;
        
        md.renderer.rules.text = function(tokens, idx, options, env, self) {
          const token = tokens[idx];
          const text = token.content;
          
          // Match patterns like {lang=fr}Text in French{/lang}
          const langPattern = /\{lang=([a-z-]+)\}(.*?)\{\/lang\}/g;
          
          if (langPattern.test(text)) {
            return text.replace(langPattern, (match, lang, content) => {
              return `<span lang="${lang}">${content}</span>`;
            });
          }
          
          return defaultRender ? defaultRender(tokens, idx, options, env, self) : text;
        };
      });
    });
  }
  
  // Helper function to generate localized URLs
  function getLocalizedUrl(url, currentLang, targetLang, urlStructure) {
    if (currentLang === targetLang) return url;
    
    switch (urlStructure) {
      case 'subdirectory':
        if (currentLang === defaultLanguage) {
          // From default to specific language
          return `/${targetLang}${url}`;
        } else if (targetLang === defaultLanguage) {
          // From specific language to default
          return url.replace(new RegExp(`^/${currentLang}`), '');
        } else {
          // From one non-default language to another
          return url.replace(new RegExp(`^/${currentLang}`), `/${targetLang}`);
        }
      
      case 'subdomain':
        // Implementation depends on deployment configuration
        return url;
        
      case 'tld':
        // Implementation depends on deployment configuration
        return url;
        
      case 'parameter':
        const urlObj = new URL(url, 'https://example.com');
        urlObj.searchParams.set('lang', targetLang);
        return `${urlObj.pathname}${urlObj.search}`;
        
      default:
        return url;
    }
  }
  
  // Return configuration object for use in templates
  return {
    defaultLanguage,
    supportedLanguages,
    directoryStructure,
    urlStructure,
    localeData,
    fallbackLanguage
  };
};

module.exports = i18n;
```

#### 3.3.2 String Translation System

```javascript
// packages/core/src/utils/translator.js
class Translator {
  constructor(options = {}) {
    this.defaultLanguage = options.defaultLanguage || 'en';
    this.currentLanguage = options.currentLanguage || this.defaultLanguage;
    this.translations = options.translations || {};
    this.fallbackLanguage = options.fallbackLanguage || this.defaultLanguage;
  }
  
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
    } else {
      console.warn(`Translation for language ${lang} not found, using ${this.fallbackLanguage}`);
      this.currentLanguage = this.fallbackLanguage;
    }
    
    return this;
  }
  
  translate(key, replacements = {}) {
    // Try to find translation in current language
    let translation = this.getNestedTranslation(this.translations[this.currentLanguage], key);
    
    // Fall back to fallback language if not found
    if (translation === undefined && this.fallbackLanguage !== this.currentLanguage) {
      translation = this.getNestedTranslation(this.translations[this.fallbackLanguage], key);
    }
    
    // Fall back to key if still not found
    if (translation === undefined) {
      console.warn(`Translation key "${key}" not found in ${this.currentLanguage} or ${this.fallbackLanguage}`);
      return key;
    }
    
    // Replace placeholders
    return this.replacePlaceholders(translation, replacements);
  }
  
  getNestedTranslation(translations, key) {
    if (!translations) return undefined;
    
    const parts = key.split('.');
    let result = translations;
    
    for (const part of parts) {
      if (result === undefined || result === null) return undefined;
      result = result[part];
    }
    
    return result;
  }
  
  replacePlaceholders(text, replacements) {
    return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
      return replacements[key] !== undefined ? replacements[key] : match;
    });
  }
  
  // Helper for pluralization
  plural(key, count, replacements = {}) {
    const pluralForms = {
      zero: `${key}.zero`,
      one: `${key}.one`,
      other: `${key}.other`
    };
    
    let pluralForm;
    
    if (count === 0 && this.getNestedTranslation(this.translations[this.currentLanguage], pluralForms.zero)) {
      pluralForm = pluralForms.zero;
    } else if (count === 1) {
      pluralForm = pluralForms.one;
    } else {
      pluralForm = pluralForms.other;
    }
    
    return this.translate(pluralForm, { ...replacements, count });
  }
}

module.exports = Translator;
```

#### 3.3.3 Translation File Structure

```javascript
// packages/adapter-11ty/src/i18n/en.js
module.exports = {
  site: {
    title: "My Business Website",
    description: "A business website built with NO-DIG"
  },
  nav: {
    home: "Home",
    about: "About",
    blog: "Blog",
    contact: "Contact"
  },
  blog: {
    readMore: "Read more",
    publishedOn: "Published on {{date}}",
    relatedPosts: "Related posts",
    comments: {
      one: "{{count}} comment",
      other: "{{count}} comments",
      zero: "No comments"
    }
  },
  // ...more translations
};

// packages/adapter-11ty/src/i18n/es.js
module.exports = {
  site: {
    title: "Mi Sitio Web de Negocios",
    description: "Un sitio web de negocios construido con NO-DIG"
  },
  nav: {
    home: "Inicio",
    about: "Acerca de",
    blog: "Blog",
    contact: "Contacto"
  },
  blog: {
    readMore: "Leer más",
    publishedOn: "Publicado el {{date}}",
    relatedPosts: "Publicaciones relacionadas",
    comments: {
      one: "{{count}} comentario",
      other: "{{count}} comentarios",
      zero: "Sin comentarios"
    }
  },
  // ...more translations
};
```

### 3.4 Frontmatter Schema

The i18n implementation will use the following frontmatter schema for multilingual content:

```yaml
---
title: "Page Title in English"
description: "Page description in English"
lang: "en"
translations:
  es: "/es/about/"
  fr: "/fr/about/"
alternateSlug: "alternative-url-slug"  # Optional, for URL variations across languages
translationKey: "about-page"  # Used to link translations without explicit URLs
isTranslated: true  # Flag to indicate if content is fully translated
translationStatus: "complete"  # complete, partial, machine, needs-review
translationDate: "2023-05-15"  # When translation was last updated
---
```

## 4. Content Creation Workflow

### 4.1 Obsidian Integration

The i18n implementation will integrate with Obsidian through the following features:

#### 4.1.1 Translation Status Tracking

```yaml
---
title: "About Us"
translationKey: "about-page"
translations:
  es: 
    status: "complete"
    lastUpdated: "2023-05-15"
  fr: 
    status: "needs-review"
    lastUpdated: "2023-04-10"
  de: 
    status: "machine"
    lastUpdated: "2023-03-22"
  ja: 
    status: "not-started"
---
```

#### 4.1.2 Translation Templates

Obsidian Templater templates for creating new translations:

```markdown
<%*
// Translation template
const sourceFile = tp.file.selection();
const sourceFrontmatter = app.metadataCache.getFileCache(sourceFile).frontmatter;
const targetLang = await tp.system.prompt("Target language code", "es");

// Create new file name
let newFileName;
if (sourceFile.path.includes('/')) {
  // Directory-based approach
  const pathParts = sourceFile.path.split('/');
  pathParts[0] = targetLang;
  newFileName = pathParts.join('/');
} else {
  // File-based approach
  newFileName = sourceFile.basename + '.' + targetLang + '.md';
}

// Create new frontmatter
const newFrontmatter = {
  title: sourceFrontmatter.title + " [" + targetLang.toUpperCase() + "]",
  description: sourceFrontmatter.description,
  lang: targetLang,
  translationKey: sourceFrontmatter.translationKey || sourceFile.basename,
  translationStatus: "needs-translation",
  translationDate: tp.date.now("YYYY-MM-DD")
};

// Create new file content
const sourceContent = await app.vault.read(sourceFile);
const frontmatterRegex = /---\n([\s\S]*?)\n---/;
const contentWithoutFrontmatter = sourceContent.replace(frontmatterRegex, '');

let newContent = "---\n";
for (const [key, value] of Object.entries(newFrontmatter)) {
  if (typeof value === 'string') {
    newContent += `${key}: "${value}"\n`;
  } else {
    newContent += `${key}: ${value}\n`;
  }
}
newContent += "---\n\n";
newContent += "<!-- Translation needed -->\n";
newContent += contentWithoutFrontmatter;

// Create the new file
await app.vault.create(newFileName, newContent);
tR = "Translation file created: " + newFileName;
%>
```

#### 4.1.3 Translation Dashboard

Custom Obsidian view for managing translations:

```javascript
// Translation Dashboard Plugin for Obsidian
class TranslationDashboardView extends ItemView {
  constructor(leaf) {
    super(leaf);
    this.translations = {};
    this.languages = [];
  }

  getViewType() {
    return "translation-dashboard";
  }

  getDisplayText() {
    return "Translation Dashboard";
  }

  async onOpen() {
    await this.refreshTranslations();
    this.render();
  }

  async refreshTranslations() {
    this.translations = {};
    this.languages = [];
    
    // Get all markdown files
    const files = this.app.vault.getMarkdownFiles();
    
    // Process each file
    for (const file of files) {
      const metadata = this.app.metadataCache.getFileCache(file)?.frontmatter;
      
      if (!metadata || !metadata.lang) continue;
      
      const lang = metadata.lang;
      const translationKey = metadata.translationKey;
      
      if (!translationKey) continue;
      
      // Add language to list if not already included
      if (!this.languages.includes(lang)) {
        this.languages.push(lang);
      }
      
      // Add translation to map
      if (!this.translations[translationKey]) {
        this.translations[translationKey] = {};
      }
      
      this.translations[translationKey][lang] = {
        file: file,
        title: metadata.title,
        status: metadata.translationStatus || "unknown",
        date: metadata.translationDate
      };
    }
  }

  render() {
    const container = this.containerEl.children[1];
    container.empty();
    
    // Create header
    const header = container.createEl("div", { cls: "translation-dashboard-header" });
    header.createEl("h2", { text: "Translation Dashboard" });
    
    const refreshButton = header.createEl("button", { text: "Refresh" });
    refreshButton.addEventListener("click", async () => {
      await this.refreshTranslations();
      this.render();
    });
    
    // Create table
    const table = container.createEl("table", { cls: "translation-dashboard-table" });
    
    // Create table header
    const thead = table.createEl("thead");
    const headerRow = thead.createEl("tr");
    headerRow.createEl("th", { text: "Translation Key" });
    
    // Add language columns
    this.languages.sort().forEach(lang => {
      headerRow.createEl("th", { text: lang.toUpperCase() });
    });
    
    // Create table body
    const tbody = table.createEl("tbody");
    
    // Add rows for each translation key
    Object.entries(this.translations).forEach(([key, langs]) => {
      const row = tbody.createEl("tr");
      row.createEl("td", { text: key });
      
      // Add cells for each language
      this.languages.forEach(lang => {
        const cell = row.createEl("td");
        
        if (langs[lang]) {
          const translation = langs[lang];
          const status = translation.status;
          
          const link = cell.createEl("a", { 
            cls: `translation-status translation-status-${status}`,
            text: status.charAt(0).toUpperCase() + status.slice(1)
          });
          
          link.addEventListener("click", () => {
            this.app.workspace.activeLeaf.openFile(translation.file);
          });
          
          if (translation.date) {
            cell.createEl("div", { 
              cls: "translation-date",
              text: translation.date
            });
          }
        } else {
          const button = cell.createEl("button", { 
            cls: "translation-create-button",
            text: "Create"
          });
          
          button.addEventListener("click", async () => {
            // Find source file (prefer default language)
            const defaultLang = this.languages[0];
            const sourceFile = langs[defaultLang]?.file || Object.values(langs)[0].file;
            
            // Create new translation file
            await this.createTranslation(sourceFile, lang, key);
            
            // Refresh and render
            await this.refreshTranslations();
            this.render();
          });
        }
      });
    });
  }

  async createTranslation(sourceFile, targetLang, translationKey) {
    // Read source file
    const sourceContent = await this.app.vault.read(sourceFile);
    const sourceFrontmatter = this.app.metadataCache.getFileCache(sourceFile).frontmatter;
    
    // Create new file path
    let newFilePath;
    if (sourceFile.path.includes('/')) {
      // Directory-based approach
      const pathParts = sourceFile.path.split('/');
      pathParts[0] = targetLang;
      newFilePath = pathParts.join('/');
    } else {
      // File-based approach
      newFilePath = sourceFile.basename + '.' + targetLang + '.md';
    }
    
    // Create new frontmatter
    const newFrontmatter = {
      title: sourceFrontmatter.title + " [" + targetLang.toUpperCase() + "]",
      description: sourceFrontmatter.description,
      lang: targetLang,
      translationKey: translationKey,
      translationStatus: "needs-translation",
      translationDate: new Date().toISOString().split('T')[0]
    };
    
    // Create new file content
    const frontmatterRegex = /---\n([\s\S]*?)\n---/;
    const contentWithoutFrontmatter = sourceContent.replace(frontmatterRegex, '');
    
    let newContent = "---\n";
    for (const [key, value] of Object.entries(newFrontmatter)) {
      if (typeof value === 'string') {
        newContent += `${key}: "${value}"\n`;
      } else {
        newContent += `${key}: ${value}\n`;
      }
    }
    newContent += "---\n\n";
    newContent += "<!-- Translation needed -->\n";
    newContent += contentWithoutFrontmatter;
    
    // Create the new file
    await this.app.vault.create(newFilePath, newContent);
  }
}
```

### 4.2 Translation Workflow

The i18n implementation will support the following translation workflows:

#### 4.2.1 Manual Translation Workflow

1. **Content Creation**: Author creates content in primary language
2. **Translation Preparation**: Author marks content for translation using frontmatter
3. **Translation**: Translator creates translated version using Obsidian templates
4. **Review**: Content is reviewed for accuracy and completeness
5. **Publication**: All language versions are published simultaneously

#### 4.2.2 Machine Translation Workflow

1. **Content Creation**: Author creates content in primary language
2. **Automatic Translation**: Machine translation is applied via API
3. **Post-Editing**: Translator reviews and corrects machine translation
4. **Quality Assurance**: Final review for accuracy and completeness
5. **Publication**: All language versions are published simultaneously

#### 4.2.3 Translation Management

```javascript
// packages/cli/src/commands/translate.js
const { Translator } = require('../../core/src/utils/translator');
const { GoogleTranslate } = require('@google-cloud/translate').v2;
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

async function translateContent(options = {}) {
  const {
    sourcePath,
    targetLang,
    sourceLanguage = 'en',
    apiKey = process.env.GOOGLE_TRANSLATE_API_KEY,
    outputDir = null,
    directoryStructure = 'directory'
  } = options;
  
  // Initialize Google Translate
  const translate = new GoogleTranslate({ key: apiKey });
  
  // Read source file
  const sourceContent = fs.readFileSync(sourcePath, 'utf8');
  const { data: frontmatter, content } = matter(sourceContent);
  
  // Determine output path
  let outputPath;
  if (directoryStructure === 'directory') {
    const relativePath = path.relative(path.join('content', sourceLanguage), sourcePath);
    outputPath = path.join(outputDir || 'content', targetLang, relativePath);
  } else {
    const dir = path.dirname(sourcePath);
    const basename = path.basename(sourcePath, path.extname(sourcePath));
    outputPath = path.join(dir, `${basename}.${targetLang}${path.extname(sourcePath)}`);
  }
  
  // Create directory if it doesn't exist
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Translate frontmatter
  const translatedFrontmatter = { ...frontmatter };
  
  if (frontmatter.title) {
    const [translatedTitle] = await translate.translate(frontmatter.title, targetLang);
    translatedFrontmatter.title = translatedTitle;
  }
  
  if (frontmatter.description) {
    const [translatedDescription] = await translate.translate(frontmatter.description, targetLang);
    translatedFrontmatter.description = translatedDescription;
  }
  
  // Update language-specific frontmatter
  translatedFrontmatter.lang = targetLang;
  translatedFrontmatter.translationKey = frontmatter.translationKey || path.basename(sourcePath, path.extname(sourcePath));
  translatedFrontmatter.translationStatus = 'machine';
  translatedFrontmatter.translationDate = new Date().toISOString().split('T')[0];
  
  // Translate content
  const [translatedContent] = await translate.translate(content, targetLang);
  
  // Write translated file
  const outputContent = matter.stringify(translatedContent, translatedFrontmatter);
  fs.writeFileSync(outputPath, outputContent);
  
  return {
    sourcePath,
    outputPath,
    translationKey: translatedFrontmatter.translationKey
  };
}

module.exports = { translateContent };
```

## 5. SEO Considerations

### 5.1 Hreflang Implementation

The i18n implementation will include proper hreflang tags for SEO:

```html
<!-- packages/adapter-11ty/src/includes/head.njk -->
{% if page.translations %}
  <!-- Hreflang tags for language alternatives -->
  <link rel="alternate" hreflang="{{ page.lang }}" href="{{ site.url }}{{ page.url }}">
  
  {% for lang, url in page.translations %}
    <link rel="alternate" hreflang="{{ lang }}" href="{{ site.url }}{{ url }}">
  {% endfor %}
  
  <!-- x-default hreflang for search engines -->
  <link rel="alternate" hreflang="x-default" href="{{ site.url }}{{ page.url | localize(site.defaultLanguage) }}">
{% endif %}
```

### 5.2 Language-Specific Metadata

The i18n implementation will support language-specific metadata:

```html
<!-- packages/adapter-11ty/src/includes/head.njk -->
<title>{{ page.title }} | {{ site.title }}</title>
<meta name="description" content="{{ page.description }}">

<!-- Language-specific metadata -->
<meta property="og:locale" content="{{ page.lang }}">
{% if page.translations %}
  {% for lang, url in page.translations %}
    <meta property="og:locale:alternate" content="{{ lang }}">
  {% endfor %}
{% endif %}
```

### 5.3 Structured Data for Multilingual Content

The i18n implementation will include language-specific structured data:

```html
<!-- packages/adapter-11ty/src/includes/structured-data.njk -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": "{{ site.url }}{{ page.url }}",
  "name": "{{ page.title }}",
  "description": "{{ page.description }}",
  "inLanguage": "{{ page.lang }}",
  {% if page.translations %}
  "potentialAction": {
    "@type": "ReadAction",
    "target": [
      {% for lang, url in page.translations %}
      {
        "@type": "EntryPoint",
        "urlTemplate": "{{ site.url }}{{ url }}",
        "inLanguage": "{{ lang }}"
      }{% if not loop.last %},{% endif %}
      {% endfor %}
    ]
  }
  {% endif %}
}
</script>
```

## 6. Business Website Considerations

### 6.1 Region-Specific Content

The i18n implementation will support region-specific content variations:

```yaml
---
title: "Product Pricing"
lang: "en"
regions:
  US:
    currency: "USD"
    taxRate: 0.0725
    shipping: "Free shipping on orders over $50"
  CA:
    currency: "CAD"
    taxRate: 0.13
    shipping: "Free shipping on orders over $75"
  UK:
    currency: "GBP"
    taxRate: 0.20
    shipping: "Free shipping on orders over £40"
---

# Product Pricing

{% if region %}
  <div class="region-specific">
    <p>Prices shown in {{ regions[region].currency }}</p>
    <p>{{ regions[region].shipping }}</p>
    <p>Tax rate: {{ regions[region].taxRate | multiply(100) }}%</p>
  </div>
{% endif %}

## Product List

{% for product in products %}
  <div class="product">
    <h3>{{ product.name }}</h3>
    <p class="price">
      {% if region and regions[region].currency %}
        {{ product.prices[regions[region].currency] | formatCurrency(regions[region].currency) }}
      {% else %}
        {{ product.prices.USD | formatCurrency('USD') }}
      {% endif %}
    </p>
  </div>
{% endfor %}
```

### 6.2 Currency and Number Formatting

The i18n implementation will include currency and number formatting:

```javascript
// packages/core/src/filters/currency.js
function formatCurrency(value, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
}

module.exports = { formatCurrency };
```

### 6.3 Date and Time Formatting

The i18n implementation will include date and time formatting:

```javascript
// packages/core/src/filters/date.js
function formatDate(value, format = {}, locale = 'en-US') {
  const date = new Date(value);
  
  const defaultFormat = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const options = { ...defaultFormat, ...format };
  
  return new Intl.DateTimeFormat(locale, options).format(date);
}

module.exports = { formatDate };
```

## 7. Implementation in NO-DIG

### 7.1 Configuration Options

Internationalization features can be configured in `no-dig.config.js`:

```javascript
module.exports = {
  // ... other configuration
  
  i18n: {
    // Language configuration
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es', 'fr', 'de'],
    fallbackLanguage: 'en',
    
    // Content structure
    directoryStructure: 'directory', // 'directory', 'file', or 'hybrid'
    
    // URL structure
    urlStructure: 'subdirectory', // 'subdirectory', 'subdomain', 'tld', or 'parameter'
    
    // Locale data
    localeData: {
      en: {
        nativeName: 'English',
        dateFormat: 'MM/DD/YYYY',
        currencySymbol: '$'
      },
      es: {
        nativeName: 'Español',
        dateFormat: 'DD/MM/YYYY',
        currencySymbol: '€'
      },
      fr: {
        nativeName: 'Français',
        dateFormat: 'DD/MM/YYYY',
        currencySymbol: '€'
      },
      de: {
        nativeName: 'Deutsch',
        dateFormat: 'DD.MM.YYYY',
        currencySymbol: '€'
      }
    },
    
    // Translation options
    machineTranslation: {
      enabled: false,
      provider: 'google',
      apiKey: process.env.TRANSLATE_API_KEY
    },
    
    // SEO options
    seo: {
      generateHreflang: true,
      defaultHreflang: 'x-default'
    }
  }
};
```

### 7.2 CLI Commands

NO-DIG will include CLI commands for managing translations:

```javascript
// packages/cli/src/commands/i18n.js
const { Command } = require('commander');
const { translateContent } = require('./translate');
const { extractTranslations } = require('./extract');
const { importTranslations } = require('./import');

const i18nCommand = new Command('i18n')
  .description('Internationalization commands');

i18nCommand
  .command('translate')
  .description('Translate content to target language')
  .requiredOption('-s, --source <path>', 'Source file path')
  .requiredOption('-t, --target-lang <code>', 'Target language code')
  .option('-l, --source-lang <code>', 'Source language code', 'en')
  .option('-o, --output-dir <path>', 'Output directory')
  .option('-d, --directory-structure <type>', 'Directory structure type', 'directory')
  .action(async (options) => {
    try {
      const result = await translateContent({
        sourcePath: options.source,
        targetLang: options.targetLang,
        sourceLanguage: options.sourceLang,
        outputDir: options.outputDir,
        directoryStructure: options.directoryStructure
      });
      
      console.log(`Translation created: ${result.outputPath}`);
    } catch (error) {
      console.error('Translation failed:', error);
      process.exit(1);
    }
  });

i18nCommand
  .command('extract')
  .description('Extract translatable strings from content')
  .requiredOption('-s, --source <path>', 'Source directory or file')
  .option('-o, --output <path>', 'Output file for translation strings', 'translations.json')
  .option('-l, --source-lang <code>', 'Source language code', 'en')
  .action(async (options) => {
    try {
      const result = await extractTranslations({
        sourcePath: options.source,
        outputPath: options.output,
        sourceLanguage: options.sourceLang
      });
      
      console.log(`Extracted ${result.count} strings to ${options.output}`);
    } catch (error) {
      console.error('Extraction failed:', error);
      process.exit(1);
    }
  });

i18nCommand
  .command('import')
  .description('Import translations from translation file')
  .requiredOption('-s, --source <path>', 'Source translation file')
  .requiredOption('-t, --target-lang <code>', 'Target language code')
  .option('-o, --output-dir <path>', 'Output directory')
  .option('-d, --directory-structure <type>', 'Directory structure type', 'directory')
  .action(async (options) => {
    try {
      const result = await importTranslations({
        sourcePath: options.source,
        targetLang: options.targetLang,
        outputDir: options.outputDir,
        directoryStructure: options.directoryStructure
      });
      
      console.log(`Imported ${result.count} translations`);
    } catch (error) {
      console.error('Import failed:', error);
      process.exit(1);
    }
  });

module.exports = i18nCommand;
```

## 8. Conclusion

This comprehensive internationalization and localization strategy ensures that business websites built with NO-DIG can effectively reach global audiences in their native languages. By implementing proper i18n and l10n support, NO-DIG enables content creators to manage multilingual content efficiently while ensuring the generated static sites follow best practices for internationalized web content and SEO.
