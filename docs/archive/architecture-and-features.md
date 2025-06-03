NO-DIG Package Ecosystem Architecture
NO-DIG employs a modular, package-based architecture designed for maintainability, extensibility, and performance — while remaining fully compatible with 11ty as the underlying renderer.

The system is organized into independent but interconnected packages that work together to provide an Obsidian-to-11ty pipeline and a business-focused plugin layer.

Package Ecosystem Overview
less
Copy
Edit
┌─────────────────────────────────────────────────────────────┐
│                      @no-dig/cli                            │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  init   │  │  build  │  │  serve  │  │  other commands │ │
└───────────┘  └─────────┘  └─────────┘  └─────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      @no-dig/core                           │
│                                                             │
│  ┌─────────────┐  ┌───────────┐  ┌───────────────────────┐  │
│  │ Vault Parser│  │Plugin Host│  │Metadata Transformation│  │
└─────────────┘  └───────────┘  └───────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   @no-dig/adapter-11ty                      │
│                                                             │
│  ┌─────────────┐  ┌───────────┐  ┌───────────────────────┐  │
│  │Prepare Data │  │11ty Config│  │ Invoke Eleventy CLI   │  │
└─────────────┘  └───────────┘  └───────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    @no-dig/plugins/*                        │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────┐ │
│  │   SEO   │  │ Sitemap │  │ Schema  │  │ Privacy │  │... │ │
└─────────┘  └─────────┘  └─────────┘  └─────────┘  └────┘ │
└─────────────────────────────────────────────────────────────┘
Core Package (@no-dig/core)
The Core package is responsible for:

Obsidian Vault Parsing: Reading and interpreting Obsidian vault structure and content

Plugin Host System: Providing infrastructure for business-focused plugins to hook into the parsing and metadata enrichment process

Metadata Transformation: Applying transformations for SEO, structured data, and privacy before data is handed to 11ty

Lifecycle Management: Executing lifecycle hooks for plugins during the parsing/build process

NOT responsible for HTML rendering — this is 11ty's domain.

CLI Package (@no-dig/cli)
The CLI package provides:

Command Line Interface: User-friendly commands for project management

Project Scaffolding: no-dig init

Build Pipeline Management: no-dig build orchestrates core + adapter

Development Server: (planned) no-dig serve for previewing via 11ty

Plugin Management: For managing installed plugins

Deployment Utilities: For preparing sites for hosting

Adapter-11ty Package (@no-dig/adapter-11ty)
The Adapter-11ty package:

Prepares 11ty Data: Converts core's parsed vault → 11ty global data files

Manages 11ty Configuration: Sets up 11ty config compatible with NO-DIG plugin data

Invokes Eleventy Programmatically: Triggers Eleventy CLI or programmatic API

Does NOT render HTML directly — all rendering remains the responsibility of Eleventy

Plugin Packages (@no-dig/plugins/*)
Plugins extend functionality and focus on business-first transformations:

@no-dig/plugins/seo: SEO metadata generation

@no-dig/plugins/sitemap: Sitemap generation

@no-dig/plugins/schema: Structured data for rich results

@no-dig/plugins/privacy: Privacy controls and compliance metadata

@no-dig/plugins/analytics: Privacy-friendly analytics hooks

@no-dig/plugins/i18n: Internationalization helpers

Plugins operate before Eleventy renders the site — they enrich data, not HTML.

Package Interaction Flow
txt
Copy
Edit
1️⃣ User runs CLI → `no-dig build`
2️⃣ CLI loads config
3️⃣ Core parses vault → produces structured data
4️⃣ Plugins enrich metadata
5️⃣ Adapter prepares 11ty data → invokes 11ty build
6️⃣ 11ty generates final site
Key Features
Business-Focused Website Generation
Conversion-optimized templates (via 11ty)

SEO-first defaults

Business schema support

Forms and lead generation

Professional navigation patterns

SEO-First Architecture
Structured Data

Meta tags

Canonical URLs

Hreflang

Core Web Vitals optimized output (via 11ty + templates)

Obsidian as a CMS
Full Wikilink Support

Vault structure mapped to URL structure

Frontmatter extracted for SEO

Media and asset handling

Performance Optimization
Image pipeline (via 11ty plugins)

CSS/JS optimization (via 11ty templates + plugins)

Optimized caching (CDN friendly)

Minimal client-side JS

Developer Experience
CLI-first workflow

Plugin architecture

Fast iteration

Type-safe (planned TypeScript)

Extensive documentation

Privacy and Compliance
GDPR-first design

Cookie consent

Privacy-first analytics

Minimal data collection

Transparency

Why Packages?
1️⃣ Modularity and Flexibility
Users can install only what they need.

2️⃣ Independent Versioning
Each package evolves independently.

3️⃣ Clearer Separation of Concerns
Core: vault parsing + plugin host

Adapter: 11ty bridge

Plugins: business logic

CLI: orchestration

4️⃣ Easier Maintenance and Contribution
Lower barriers to entry for contributors.

5️⃣ Future Extensibility
Future adapters possible:

@no-dig/adapter-astro

@no-dig/adapter-next

Versioning Policy
Follows semantic versioning (SemVer):

Major: Breaking

Minor: New features

Patch: Fixes

Conclusion
NO-DIG is an Obsidian-to-11ty bridge + business-first plugin host.
It is not a new static site generator.
It complements Eleventy by adding SEO-first business-focused functionality — without duplicating Eleventy’s rendering responsibilities.