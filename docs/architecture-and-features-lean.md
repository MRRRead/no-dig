
# Architecture and Features — Lean Architecture (June 2025)

## NO-DIG Package Ecosystem Architecture

NO-DIG provides a lean, maintainable, and extensible architecture to convert **Obsidian vault content into 11ty-friendly data**, enabling fully SEO-optimized, business-first websites using 11ty’s powerful rendering engine and plugin ecosystem.

NO-DIG does **NOT** duplicate existing 11ty functionality such as:
- SEO meta tags
- Structured data
- Sitemaps
- Performance optimizations
- Privacy banners

These are implemented using **standard 11ty plugins and templates**.

### Package Ecosystem Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      @no-dig/cli                            │
│                                                             │
│  ┌─────────┐  ┌─────────┐                                   │
│  │  init   │  │  build  │                                   │
└───────────┘  └─────────┘                                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      @no-dig/core                           │
│                                                             │
│  ┌─────────────┐  ┌───────────┐                             │
│  │ Vault Parser│  │ Preprocessors│                          │
└─────────────┘  └───────────┘                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   @no-dig/adapter-11ty                      │
│                                                             │
│  ┌─────────────┐  ┌───────────┐  ┌───────────────────────┐  │
│  │Prepare Data │  │11ty Config│  │ Invoke Eleventy CLI   │  │
└─────────────┘  └───────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Core Package (`@no-dig/core`)

Responsible for:
- **Obsidian Vault Parsing**
- **Preprocessors** (wikilink resolution, frontmatter normalization)
- **Exposing structured content to 11ty**

NOT responsible for:
- HTML rendering
- SEO/meta/schema/sitemap logic

### CLI Package (`@no-dig/cli`)

Provides:
- **Project scaffolding** → `no-dig init`
- **Build orchestration** → `no-dig build`

### Adapter-11ty Package (`@no-dig/adapter-11ty`)

Responsible for:
- Preparing 11ty data layer from parsed vault content
- Managing 11ty config
- Invoking Eleventy programmatically

NOT responsible for rendering or injecting SEO/schema/meta.

## Package Interaction Flow

```txt
1️⃣ User runs `no-dig build`
2️⃣ Core parses vault → structured data
3️⃣ Preprocessors apply vault-level transforms
4️⃣ Adapter prepares 11ty data → invokes 11ty
5️⃣ 11ty plugins & templates generate final site
```

## Key Features

- **Obsidian-first workflow** → business-ready website output
- **Business-optimized templates** via 11ty
- **SEO-first architecture** → via 11ty plugins + templates
- **Wikilink resolution**
- **Frontmatter normalization**
- **Performance optimized** → via 11ty ecosystem

## Why Packages?

- Modularity
- Clear separation of concerns
- Ability to swap adapters
- Minimal maintenance burden

## Versioning Policy

Semantic versioning.

## Conclusion

NO-DIG is a **lean, business-focused Obsidian-to-11ty bridge**.  
It complements 11ty — it does not replace it or duplicate its ecosystem.
