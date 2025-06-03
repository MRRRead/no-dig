# README.md

# NO-DIG
> **SEO-First Business Websites from Obsidian**  
> _Not a Digital Garden._ 🚀

**NO-DIG** is an open-source static site generator that transforms your structured **Obsidian vault** into a fast, SEO-optimized, business-ready website.

## ✨ Features

✅ SEO-first architecture (Core Web Vitals, structured data, sitemaps)  
✅ Built for **business websites**, not "digital gardens"  
✅ Clean, production-grade HTML (accessible, semantic, performant)  
✅ Privacy-friendly (no vendor lock-in, GDPR-first)  
✅ Headless CMS flexibility with **Obsidian as content source**  
✅ Works with 11ty (Eleventy) — ultra-fast builds  
✅ Internationalization (i18n) ready  
✅ CI/CD and Jamstack friendly  
✅ Developer-friendly CLI and plugin architecture  

## 🚀 Quick Start

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
```

## 📋 Project Status

- **Phase 1 (MVP Content Pipeline) is ~90% complete.**
- **Phase 2.1 (Structured Data & SEO) is in progress.**
- All core features (content pipeline, parser, wikilinks, embeds, tags, plugin system, CLI, 11ty adapter, layouts, navigation, backlinking) are implemented and tested.
- **Known Issue:** The 11ty build output does not yet render Obsidian-style wikilinks as HTML links due to a plugin resolution issue with @photogabble/eleventy-plugin-interlinker in the monorepo/Windows environment. This is the last blocker for full Phase 1 completion. See [Development Roadmap](docs/roadmap/development-roadmap.md) for details and next steps.
- Live preview (11ty dev server) is enabled for the adapter-11ty package.

## ❗ Known Issues / Blockers

- **Wikilink HTML output in 11ty:** Wikilinks are correctly processed in the core pipeline and plugin tests, but the actual 11ty build output does not render them as HTML links. This is due to unresolved plugin resolution issues with @photogabble/eleventy-plugin-interlinker in a monorepo/Windows context. See roadmap for workaround attempts and next steps.

## ❗ Multi-Site Management

NO-DIG currently supports **one site per project directory**. Multi-site management (generating and managing multiple independent sites from a single CLI instance or monorepo) is **not yet implemented or specced**. To manage multiple sites, create a separate project directory for each site (e.g., `no-dig init site-1`, `no-dig init site-2`).

## 🏗️ CLI as the Root Site Generator

The NO-DIG CLI is the primary entry point for generating, managing, and updating sites. The adapter (e.g., adapter-11ty) is responsible for integrating with a specific static site generator (like 11ty) and providing live preview/dev server functionality. All core site management should be performed via the CLI.

## 📁 Repository Structure

```
/
├── docs/                  # Comprehensive specification documents
│   ├── document-index.md  # Central navigation hub for all documents
│   ├── specification.md   # Main specification document
│   ├── architecture-and-features.md
│   ├── roadmap/           # Development roadmap and planning
│   └── ...
├── packages/              # Monorepo packages
│   ├── core/              # Core transformation logic
│   ├── cli/               # Command-line interface
│   ├── adapter-11ty/      # 11ty integration
│   └── ...
├── site/                  # Documentation site
├── .github/               # GitHub configuration
│   ├── workflows/         # CI/CD workflows
│   └── ISSUE_TEMPLATE/    # Issue templates
└── README.md              # Project overview (this file)
```

## 🚀 Development Roadmap

The project is organized into seven distinct phases:

0. **Project Scaffold & Tooling** (1-2 weeks)
1. **MVP Content Pipeline** (2-3 weeks)
2. **SEO & Performance Hardening** (2-3 weeks)
3. **Feature Completeness** (2-3 weeks)
4. **Scalability & UX Enhancements** (3-4 weeks)
5. **Pre-Release Polishing & Observability** (2-3 weeks)
6. **Maintenance & Iteration** (Continuous)

See the [Development Roadmap](docs/roadmap/development-roadmap.md) for detailed implementation plans.

## 🧠 AI-First Development

This project follows an AI-first development approach, with specific guidance for using AI tools effectively throughout the development process. See the [AI Prompting Guide](docs/roadmap/ai-prompting-guide.md) for detailed instructions.

## 🛠️ Development

- Monorepo managed with npm workspaces (see `packages/`)
- Tooling: TypeScript, ESLint, Prettier, Jest, GitHub Actions CI
- See [docs/document-index.md](docs/document-index.md) for all documentation.
- **Development tasks and progress are tracked in [GitHub Issues](https://github.com/MRRRead/no-dig/issues).**

### Local Setup

```bash
npm install
npm run lint
npm run build
npm test
```

## 11ty & Tailwind CSS

- 11ty is installed and configured in `packages/adapter-11ty`.
- Tailwind CSS and PostCSS are set up for CSS processing.
- See `packages/adapter-11ty/.eleventy.js` and `src/input.css` for configuration.

## 🧩 Plugin System & API

NO-DIG features a robust plugin system for extensibility. Plugins can hook into the content pipeline and build process, enabling custom transformations, integrations, and automation.

- See [docs/plugin-api.md](docs/plugin-api.md) for the full Plugin API, lifecycle hooks, and best practices.
- Plugins can implement lifecycle hooks such as `beforeBuild`, `transformContent`, and `afterBuild`.
- Example plugin registration:

```js
// no-dig.config.js
module.exports = {
  plugins: [
    '@no-dig/plugins/seo',
    ['./my-local-plugin.js', { option: true }]
  ]
};
```

- Plugins can be official (`@no-dig/plugins/*`) or third-party (`no-dig-plugin-*`).
- See the [Plugin API documentation](docs/plugin-api.md) for hook signatures and usage examples.

## Plugin Ecosystem

NO-DIG leverages the best existing 11ty plugins while providing a consistent, business-focused API. The plugin system wraps high-quality community plugins with sensible defaults for business websites.

Key integrations include:
- Wikilinks and backlinking (via eleventy-plugin-interlinker)
- Structured data (via eleventy-plugin-schema)
- Image optimization (via @11ty/eleventy-img)
- And more...

See the [Plugin API documentation](docs/plugin-api.md) for details.

## 📚 Documentation

All project documentation is available in the `docs/` directory. Start with the [Document Index](docs/document-index.md) for a complete overview of all specification documents.

## 🤝 Contributing

This project is currently in the specification phase. Contribution guidelines will be added once implementation begins.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
