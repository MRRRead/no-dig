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

This project is currently in the specification and planning phase. The repository contains comprehensive documentation and development roadmap.

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
- **Development tasks and progress are tracked in [GitHub Issues](https://github.com/your-org/no-dig/issues).**

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

## 📚 Documentation

All project documentation is available in the `docs/` directory. Start with the [Document Index](docs/document-index.md) for a complete overview of all specification documents.

## 🤝 Contributing

This project is currently in the specification phase. Contribution guidelines will be added once implementation begins.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
