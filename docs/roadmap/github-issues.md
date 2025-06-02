# GitHub Issues JSON

This document contains ready-to-import GitHub issues for each phase of the development roadmap. These issues can be imported into your GitHub repository to create a structured project board.

## Phase 0: Project Scaffold & Tooling

```json
[
  {
    "title": "Initialize repository structure",
    "body": "Create the initial repository structure with appropriate directories for source files, templates, layouts, includes, data, and assets. Set up README.md with project overview and development instructions.",
    "labels": ["phase-0", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Install and configure 11ty",
    "body": "Install 11ty and create basic configuration file (.eleventy.js) with initial settings for input/output directories, passthrough file copy, and watch targets.",
    "labels": ["phase-0", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Integrate Tailwind CSS",
    "body": "Install Tailwind CSS and configure it for use with 11ty. Set up PostCSS processing pipeline and ensure CSS is properly built and included in the site output.",
    "labels": ["phase-0", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Set up development workflow",
    "body": "Configure development server with hot reloading. Create npm scripts for common development tasks (build, dev, clean). Document the development workflow in README.md.",
    "labels": ["phase-0", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Configure CI/CD skeleton",
    "body": "Set up GitHub Actions workflow for basic CI/CD pipeline. Include steps for installing dependencies, linting, building, and basic testing.",
    "labels": ["phase-0", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Implement linting and formatting",
    "body": "Install and configure ESLint and Prettier. Create configuration files with appropriate rules. Add npm scripts for linting and formatting. Configure pre-commit hooks for automatic formatting.",
    "labels": ["phase-0", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Set up AI-first development environment",
    "body": "Create documentation for AI-first development workflow. Include templates for AI prompts, guidelines for code review, and best practices for working with AI-generated code.",
    "labels": ["phase-0", "ai-generated", "needs-human-review"]
  }
]
```

## Phase 1: MVP Content Pipeline

```json
[
  {
    "title": "Implement Obsidian vault reading",
    "body": "Create functionality to read and process Markdown files from an Obsidian vault directory. Handle file discovery, metadata extraction, and content preparation for 11ty processing.",
    "labels": ["phase-1", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Implement wikilink parsing and transformation",
    "body": "Create a parser for Obsidian-style wikilinks ([[Page Name]]) and transform them into appropriate HTML links. Support various wikilink formats including aliases ([[Page Name|Display Text]]) and section links ([[Page Name#Section]]).",
    "labels": ["phase-1", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Implement backlinking functionality",
    "body": "Create a system to track and generate backlinks between pages. Store backlink information during the build process and make it available to templates for display.",
    "labels": ["phase-1", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Create base layout and templates",
    "body": "Design and implement base layout and templates for the site. Include header, footer, main content area, and sidebar. Ensure templates are modular and reusable.",
    "labels": ["phase-1", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Implement navigation structure",
    "body": "Create a system for generating navigation menus based on the content structure. Support hierarchical navigation that reflects the folder structure of the Obsidian vault.",
    "labels": ["phase-1", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Support page metadata via frontmatter",
    "body": "Implement frontmatter parsing and usage for page metadata. Support common metadata fields (title, description, date) and make them available to templates.",
    "labels": ["phase-1", "ai-generated", "needs-human-review"]
  }
]
```

## Phase 2: SEO & Performance Hardening

```json
[
  {
    "title": "Implement structured data generation",
    "body": "Create a system for generating structured data (JSON-LD) based on page content and frontmatter. Support common schema types (Article, FAQPage, WebPage) with appropriate properties.",
    "labels": ["phase-2", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Implement image optimization pipeline",
    "body": "Create an image optimization pipeline that processes images during build. Generate multiple sizes and formats (WebP, AVIF) for responsive images. Implement lazy loading and proper image attributes.",
    "labels": ["phase-2", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Enhance accessibility",
    "body": "Improve accessibility by adding appropriate ARIA attributes, ensuring proper heading structure, providing alt text for images, and implementing keyboard navigation. Test with accessibility tools.",
    "labels": ["phase-2", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Improve overall performance",
    "body": "Optimize performance by implementing code splitting, lazy loading, CSS optimization, and other performance best practices. Measure performance with Lighthouse and other tools.",
    "labels": ["phase-2", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Implement SEO best practices",
    "body": "Implement SEO best practices including meta tags, canonical URLs, XML sitemap, robots.txt, and proper heading structure. Ensure all pages have appropriate title and description metadata.",
    "labels": ["phase-2", "ai-generated", "needs-human-review"]
  }
]
```

## Phase 3: Feature Completeness (Forms, Analytics, Privacy)

```json
[
  {
    "title": "Implement contact form functionality",
    "body": "Create a flexible contact form system that works with static hosting. Support multiple form providers (Netlify Forms, Formspree) with a consistent API. Implement form validation and error handling.",
    "labels": ["phase-3", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Add spam protection",
    "body": "Implement spam protection for forms using techniques like honeypot fields, CAPTCHA, or integration with spam filtering services. Ensure protection doesn't impact legitimate users.",
    "labels": ["phase-3", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Integrate analytics with privacy considerations",
    "body": "Implement analytics integration (Google Analytics, Plausible, etc.) with privacy-focused configuration. Support multiple analytics providers with a consistent API. Ensure analytics respects user privacy preferences.",
    "labels": ["phase-3", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Implement cookie consent mechanism",
    "body": "Create a cookie consent system that allows users to control tracking and non-essential cookies. Implement cookie categories and preference management. Ensure consent is properly recorded and respected.",
    "labels": ["phase-3", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Ensure GDPR/CCPA compliance",
    "body": "Review and implement necessary features for GDPR/CCPA compliance. Include privacy policy generation, data access/deletion mechanisms, and documentation of data processing activities.",
    "labels": ["phase-3", "ai-generated", "needs-human-review"]
  }
]
```

## Phase 4: Scalability & UX Enhancements

```json
[
  {
    "title": "Implement pagination for large content collections",
    "body": "Create a pagination system for large content collections. Support customizable page size, navigation controls, and URL structure. Ensure pagination works with filtered collections (tags, categories).",
    "labels": ["phase-4", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Add tag and category pages",
    "body": "Implement automatic generation of tag and category pages. Create templates for tag/category listings with appropriate metadata. Support hierarchical categories if needed.",
    "labels": ["phase-4", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Implement search functionality",
    "body": "Create a search system that works with static sites. Options include pre-built search index, client-side search, or integration with external search services. Implement search UI with results highlighting.",
    "labels": ["phase-4", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Add internationalization support",
    "body": "Implement internationalization (i18n) support for multi-language content. Support language-specific URLs, content, and templates. Implement language switching and detection.",
    "labels": ["phase-4", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Enhance user experience",
    "body": "Improve overall user experience with enhancements like dark mode support, print styles, reading progress indicator, table of contents generation, and other UX improvements.",
    "labels": ["phase-4", "ai-generated", "needs-human-review"]
  }
]
```

## Phase 5: Pre-Release Polishing & Observability

```json
[
  {
    "title": "Implement observability features",
    "body": "Add observability features including error tracking, performance monitoring, and usage analytics. Implement logging and monitoring for build process and runtime errors.",
    "labels": ["phase-5", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Conduct final accessibility audit",
    "body": "Perform comprehensive accessibility audit using automated tools and manual testing. Address any issues found to ensure WCAG 2.1 AA compliance at minimum.",
    "labels": ["phase-5", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Perform final SEO audit",
    "body": "Conduct thorough SEO audit using tools like Lighthouse, SEO checkers, and structured data validators. Address any issues found to ensure optimal search engine visibility.",
    "labels": ["phase-5", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Fine-tune performance",
    "body": "Analyze and optimize performance using tools like Lighthouse and WebPageTest. Address any performance bottlenecks found in JavaScript, CSS, images, or server configuration.",
    "labels": ["phase-5", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Prepare for release",
    "body": "Finalize documentation, create release notes, and prepare deployment instructions. Ensure all known issues are documented and prioritized for future releases.",
    "labels": ["phase-5", "ai-generated", "needs-human-review"]
  }
]
```

## Phase 6: Maintenance & Iteration

```json
[
  {
    "title": "Provide ongoing maintenance",
    "body": "Address bugs and issues as they are reported. Keep dependencies updated and secure. Monitor performance and stability in production.",
    "labels": ["phase-6", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Address user feedback",
    "body": "Collect and analyze user feedback. Prioritize and implement improvements based on feedback. Communicate changes to users.",
    "labels": ["phase-6", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Implement minor enhancements",
    "body": "Identify and implement small enhancements that improve the user experience or add minor features. Ensure changes don't break existing functionality.",
    "labels": ["phase-6", "ai-generated", "needs-human-review"]
  },
  {
    "title": "Plan for future major versions",
    "body": "Begin planning for future major versions based on user feedback, technological advancements, and strategic goals. Create roadmap for version 2.0.",
    "labels": ["phase-6", "ai-generated", "needs-human-review"]
  }
]
```
