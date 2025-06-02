# Developer and Editor User Flows

This document outlines the primary user flows for developers and content editors interacting with the NO-DIG static site generator.

## Developer User Flow (CLI-First)

NO-DIG prioritizes a command-line interface (CLI) workflow for developers, providing a streamlined experience for project setup, development, and deployment.

### 1. Installation

Install the NO-DIG CLI globally using npm:

```bash
npm install -g @no-dig/cli
```

### 2. Project Initialization

Create a new NO-DIG project using the `init` command:

```bash
no-dig init my-new-site
cd my-new-site
```

This command scaffolds a new project directory with:
- Basic configuration (`no-dig.config.js`)
- Sample Obsidian vault structure (`content/`)
- Core dependencies (`package.json`)
- Recommended `.gitignore`

### 3. Configuration

Edit the `no-dig.config.js` file to configure the project:

- **Site Metadata**: Title, description, URL, etc.
- **Plugin Selection**: Add and configure necessary plugins (e.g., SEO, images, sitemap).
- **Adapter Settings**: Configure the 11ty adapter or other adapters.
- **Content Paths**: Specify input and output directories.

See the [[configuration]] documentation for detailed options.

### 4. Plugin Installation

Install required plugin packages:

```bash
npm install @no-dig/plugins/seo @no-dig/plugins/images
```

### 5. Local Development

Start the local development server:

```bash
no-dig serve
```

This command:
- Starts a local server with hot reloading.
- Watches the content directory for changes.
- Rebuilds the site incrementally on updates.

Developers can now work on templates, styles, and custom components while previewing changes live.

### 6. Build for Production

Generate the production-ready static site:

```bash
no-dig build
```

This command:
- Performs a full build of the site.
- Applies all production optimizations (minification, image processing, etc.).
- Outputs the static files to the configured output directory (e.g., `dist/`).

### 7. Deployment

Deploy the generated static files to the chosen hosting platform (e.g., Netlify, Vercel, Cloudflare Pages).

Refer to the [[deployment-and-delivery-strategy]] for detailed deployment instructions and CI/CD integration.

## Content Editor User Flow (Obsidian-Based)

NO-DIG leverages Obsidian as the primary content management system (CMS), providing a familiar and powerful environment for content creators.

### 1. Setup Obsidian Vault

- Open the project's `content/` directory as an Obsidian vault.
- Install recommended Obsidian plugins (e.g., Templater, Dataview) if needed.

### 2. Content Creation

- Create new markdown files (`.md`) within the vault structure.
- Use standard Obsidian markdown syntax, including [[wikilinks]] for internal linking.
- Utilize [[obsidian-templater-templates]] for consistent content structure (e.g., blog posts, product pages).

### 3. Metadata Management

- Add YAML frontmatter to each file to specify:
  - `title`
  - `description`
  - `lang` (for i18n)
  - `layout` (if overriding default)
  - Plugin-specific configuration (e.g., SEO keywords, schema details)

### 4. Media Management

- Embed images and other media using standard Obsidian syntax (`![[image.png]]`).
- Store media files within the Obsidian vault (e.g., in an `assets/` subfolder).
- NO-DIG will automatically process and optimize these assets during the build. See [[image-optimization-strategy]].

### 5. Linking Content

- Use `[[wikilinks]]` to link between pages within the vault.
- NO-DIG automatically resolves these links to correct HTML URLs during the build. See [[obsidian-wikilink-guide]].

### 6. Previewing Content

- **Obsidian Preview**: Use Obsidian's built-in preview mode for immediate feedback on markdown rendering.
- **Local Development Server**: Run `no-dig serve` (typically managed by a developer) to preview the fully rendered site in a browser.

### 7. Collaboration (Optional)

- Use Git or Obsidian Sync to collaborate with other editors or developers on the vault content.

### 8. Publication

- Once content is ready, commit changes to the Git repository.
- The CI/CD pipeline (configured by developers) will automatically trigger a new build and deploy the updated site. See [[deployment-and-delivery-strategy]].

## Integration Between Flows

- Developers set up the initial project structure, configuration, and templates.
- Content editors work primarily within the Obsidian vault, creating and managing content.
- Changes made by editors in the vault trigger automated builds and deployments managed by the developer's setup.
- The CLI provides tools for developers to manage the build process, while Obsidian provides the interface for editors.

This separation allows each role to focus on their area of expertise while contributing to the same final website.
