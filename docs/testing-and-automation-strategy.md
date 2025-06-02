# Testing and Automation Strategy

This document outlines the comprehensive testing and automation strategy for NO-DIG, ensuring high-quality code, reliable performance, and consistent user experience across the entire package ecosystem.

## Testing Philosophy

NO-DIG follows a test-driven development approach with comprehensive test coverage across all packages and integration points. The testing strategy is designed to:

1. **Ensure Correctness**: Verify that all features work as specified
2. **Maintain Quality**: Prevent regressions and ensure consistent behavior
3. **Document Behavior**: Tests serve as executable documentation
4. **Enable Refactoring**: Support continuous improvement without breaking functionality
5. **Validate Performance**: Ensure the system meets performance targets

## Package-Level Testing Strategy

Each package in the NO-DIG ecosystem requires specific testing approaches:

### Core Package Testing (`@no-dig/core`)

The core package testing focuses on:

- **Vault Parser**: Testing accurate parsing of Obsidian vault structures
- **Plugin Host**: Verifying plugin hook execution and error handling
- **Content Transformation**: Ensuring correct markdown and wikilink processing
- **API Stability**: Validating public API contracts

**Implementation:**
```javascript
// Example core package test
describe('@no-dig/core/VaultParser', () => {
  test('correctly parses nested vault structure', async () => {
    const vaultParser = new VaultParser();
    const result = await vaultParser.parse('./test-fixtures/sample-vault');
    
    expect(result.files).toHaveLength(5);
    expect(result.folders).toHaveLength(2);
    expect(result.files[0].path).toBe('index.md');
  });
  
  test('extracts frontmatter from markdown files', async () => {
    const vaultParser = new VaultParser();
    const result = await vaultParser.parseFile('./test-fixtures/sample-vault/index.md');
    
    expect(result.frontmatter).toHaveProperty('title');
    expect(result.frontmatter.title).toBe('Home Page');
  });
});
```

### CLI Package Testing (`@no-dig/cli`)

The CLI package testing focuses on:

- **Command Execution**: Verifying each command works correctly
- **Project Scaffolding**: Testing initialization templates
- **Error Handling**: Ensuring user-friendly error messages
- **Configuration Validation**: Testing config loading and validation

**Implementation:**
```javascript
// Example CLI package test
describe('@no-dig/cli/commands/init', () => {
  beforeEach(() => {
    // Set up temporary directory for testing
    fs.mkdirSync('./tmp-test-dir', { recursive: true });
  });
  
  afterEach(() => {
    // Clean up temporary directory
    fs.rmSync('./tmp-test-dir', { recursive: true, force: true });
  });
  
  test('creates project structure with correct files', async () => {
    const initCommand = new InitCommand();
    await initCommand.execute('./tmp-test-dir', { template: 'default' });
    
    expect(fs.existsSync('./tmp-test-dir/no-dig.config.js')).toBe(true);
    expect(fs.existsSync('./tmp-test-dir/content')).toBe(true);
    expect(fs.existsSync('./tmp-test-dir/package.json')).toBe(true);
  });
  
  test('configures package.json with correct dependencies', async () => {
    const initCommand = new InitCommand();
    await initCommand.execute('./tmp-test-dir', { template: 'default' });
    
    const packageJson = JSON.parse(fs.readFileSync('./tmp-test-dir/package.json', 'utf8'));
    
    expect(packageJson.dependencies).toHaveProperty('@no-dig/core');
    expect(packageJson.dependencies).toHaveProperty('@no-dig/adapter-11ty');
  });
});
```

### Adapter Testing (`@no-dig/adapter-11ty`)

The adapter testing focuses on:

- **Integration with SSG**: Testing correct integration with 11ty
- **Template Rendering**: Verifying template application
- **Data Cascade**: Testing data flow through the adapter
- **Output Generation**: Validating generated HTML and assets

**Implementation:**
```javascript
// Example adapter test
describe('@no-dig/adapter-11ty', () => {
  test('correctly configures 11ty instance', () => {
    const adapter = new EleventyAdapter();
    const eleventyConfig = {};
    
    adapter.configure(eleventyConfig);
    
    expect(eleventyConfig.dataTemplateEngine).toBe('njk');
    expect(eleventyConfig.markdownTemplateEngine).toBe('njk');
    expect(eleventyConfig.htmlTemplateEngine).toBe('njk');
  });
  
  test('processes wikilinks in content', async () => {
    const adapter = new EleventyAdapter();
    const content = 'This is a [[Test Page]]';
    
    const result = await adapter.processContent(content);
    
    expect(result).toContain('<a href="/test-page">Test Page</a>');
  });
  
  test('generates correct output structure', async () => {
    const adapter = new EleventyAdapter();
    await adapter.build({
      inputDir: './test-fixtures/sample-vault',
      outputDir: './tmp-output'
    });
    
    expect(fs.existsSync('./tmp-output/index.html')).toBe(true);
    expect(fs.existsSync('./tmp-output/test-page/index.html')).toBe(true);
  });
});
```

### Plugin Testing (`@no-dig/plugins/*`)

Plugin testing focuses on:

- **Hook Implementation**: Testing each hook's functionality
- **Configuration Options**: Verifying config handling
- **Integration with Core**: Testing interaction with core package
- **Error Handling**: Ensuring graceful error handling

**Implementation:**
```javascript
// Example plugin test
describe('@no-dig/plugins/seo', () => {
  test('adds meta tags to HTML content', async () => {
    const seoPlugin = createSeoPlugin({
      defaultTitle: 'Test Site',
      defaultDescription: 'Test Description'
    });
    
    const result = await seoPlugin.afterContentProcessing({
      content: '<html><head></head><body>Test</body></html>',
      metadata: { title: 'Page Title' },
      filepath: 'test.md',
      logger: console
    });
    
    expect(result.content).toContain('<title>Page Title | Test Site</title>');
    expect(result.content).toContain('<meta name="description" content="Test Description">');
  });
  
  test('generates structured data from frontmatter', async () => {
    const seoPlugin = createSeoPlugin();
    
    const result = await seoPlugin.afterContentProcessing({
      content: '<html><head></head><body>Test</body></html>',
      metadata: {
        title: 'Product Page',
        schema: {
          type: 'Product',
          name: 'Test Product',
          price: '99.99'
        }
      },
      filepath: 'product.md',
      logger: console
    });
    
    expect(result.content).toContain('<script type="application/ld+json">');
    expect(result.content).toContain('"@type":"Product"');
    expect(result.content).toContain('"name":"Test Product"');
  });
});
```

### Plugin Hook Testing

Testing plugin hooks across the ecosystem:

- **Hook Execution Order**: Verifying hooks execute in correct sequence
- **Data Flow**: Testing data passing between hooks
- **Error Propagation**: Ensuring errors are properly handled

**Implementation:**
```javascript
// Example plugin hook test
describe('Plugin Hook System', () => {
  test('executes hooks in correct order', async () => {
    const executionOrder = [];
    
    const testPlugin1 = {
      name: 'test-plugin-1',
      beforeBuild: () => { executionOrder.push('plugin1:beforeBuild'); },
      afterBuild: () => { executionOrder.push('plugin1:afterBuild'); }
    };
    
    const testPlugin2 = {
      name: 'test-plugin-2',
      beforeBuild: () => { executionOrder.push('plugin2:beforeBuild'); },
      afterBuild: () => { executionOrder.push('plugin2:afterBuild'); }
    };
    
    const pluginHost = new PluginHost([testPlugin1, testPlugin2]);
    await pluginHost.runHook('beforeBuild', {});
    await pluginHost.runHook('afterBuild', {});
    
    expect(executionOrder).toEqual([
      'plugin1:beforeBuild',
      'plugin2:beforeBuild',
      'plugin1:afterBuild',
      'plugin2:afterBuild'
    ]);
  });
  
  test('passes data between hooks', async () => {
    const testPlugin1 = {
      name: 'test-plugin-1',
      beforeContentProcessing: ({ content }) => {
        return { content: content + ' (modified by plugin1)', metadata: {} };
      }
    };
    
    const testPlugin2 = {
      name: 'test-plugin-2',
      beforeContentProcessing: ({ content }) => {
        return { content: content + ' (modified by plugin2)', metadata: {} };
      }
    };
    
    const pluginHost = new PluginHost([testPlugin1, testPlugin2]);
    const result = await pluginHost.runHook('beforeContentProcessing', {
      content: 'Original content',
      metadata: {}
    });
    
    expect(result.content).toBe('Original content (modified by plugin1) (modified by plugin2)');
  });
});
```

### Adapter Output Snapshot Testing

Verifying adapter output consistency:

- **HTML Output**: Comparing generated HTML to expected snapshots
- **Asset Generation**: Verifying asset processing and optimization
- **URL Structure**: Testing URL generation and path handling

**Implementation:**
```javascript
// Example snapshot test
describe('Adapter Output', () => {
  test('generates expected HTML output', async () => {
    const adapter = new EleventyAdapter();
    await adapter.build({
      inputDir: './test-fixtures/snapshot-vault',
      outputDir: './tmp-snapshot-output'
    });
    
    const outputHtml = fs.readFileSync('./tmp-snapshot-output/index.html', 'utf8');
    expect(outputHtml).toMatchSnapshot();
    
    const blogHtml = fs.readFileSync('./tmp-snapshot-output/blog/first-post/index.html', 'utf8');
    expect(blogHtml).toMatchSnapshot();
  });
});
```

### End-to-End Vault to Site Testing

Testing the complete flow from Obsidian vault to generated site:

- **Full Build Process**: Testing the entire build pipeline
- **Content Transformation**: Verifying content is correctly transformed
- **Link Resolution**: Testing wikilink resolution across the site
- **Asset Processing**: Verifying image and media handling

**Implementation:**
```javascript
// Example E2E test
describe('End-to-End Build Process', () => {
  test('builds complete site from vault', async () => {
    // Run the CLI build command
    await execCommand('no-dig build --input=./test-fixtures/e2e-vault --output=./tmp-e2e-output');
    
    // Verify output structure
    expect(fs.existsSync('./tmp-e2e-output/index.html')).toBe(true);
    expect(fs.existsSync('./tmp-e2e-output/blog/index.html')).toBe(true);
    expect(fs.existsSync('./tmp-e2e-output/about/index.html')).toBe(true);
    
    // Verify content transformation
    const indexHtml = fs.readFileSync('./tmp-e2e-output/index.html', 'utf8');
    expect(indexHtml).toContain('<a href="/about">About</a>');
    
    // Verify image processing
    expect(fs.existsSync('./tmp-e2e-output/assets/images/hero.webp')).toBe(true);
  });
});
```

## Testing Pyramid

The testing strategy follows the standard testing pyramid approach, applied across the package ecosystem:

```
    /\
   /  \
  /    \
 / E2E  \
/--------\
/ Integr. \
/----------\
/   Unit    \
/------------\
```

### Unit Tests

Unit tests focus on testing individual functions, classes, and components in isolation.

#### Coverage Areas:
- Core transformation functions
- Utility functions
- Configuration handling
- Data processing
- Template rendering
- Plugin system
- CLI commands

#### Implementation:
- **Framework**: Jest
- **Coverage Target**: 90%+ for core packages, 80%+ for plugins and adapters
- **Mocking**: Jest mocks and manual mocks
- **Running**: Automated on every commit

#### Example Unit Test:

```javascript
// Testing wikilink processing function
describe('processWikilinks', () => {
  test('converts basic wikilinks to HTML links', () => {
    const input = 'This is a [[Page Name]] in text.';
    const expected = 'This is a <a href="/page-name">Page Name</a> in text.';
    expect(processWikilinks(input)).toBe(expected);
  });

  test('handles wikilinks with aliases', () => {
    const input = 'This is a [[Page Name|Custom Text]] in text.';
    const expected = 'This is a <a href="/page-name">Custom Text</a> in text.';
    expect(processWikilinks(input)).toBe(expected);
  });

  test('handles special characters in wikilinks', () => {
    const input = 'This is a [[Page with & special characters]] in text.';
    const expected = 'This is a <a href="/page-with-special-characters">Page with & special characters</a> in text.';
    expect(processWikilinks(input)).toBe(expected);
  });
});
```

### Integration Tests

Integration tests verify that different parts of the system work together correctly.

#### Coverage Areas:
- Content pipeline integration
- Plugin interactions
- Template system integration
- Build process
- CLI commands
- Configuration system
- Cross-package integration

#### Implementation:
- **Framework**: Jest with custom test environment
- **Coverage Target**: 80%+ for integration points
- **Approach**: Mock external dependencies, test real interactions between components
- **Running**: Automated on every pull request

#### Example Integration Test:

```javascript
// Testing content pipeline integration
describe('Content Pipeline', () => {
  let pipeline;
  
  beforeEach(() => {
    pipeline = new ContentPipeline({
      plugins: [new WikilinkPlugin(), new FrontmatterPlugin()]
    });
  });

  test('processes content through multiple plugins', async () => {
    const input = `---
title: Test Page
---
This is a [[Linked Page]] with frontmatter.`;

    const result = await pipeline.process(input, 'test-page.md');
    
    expect(result.metadata.title).toBe('Test Page');
    expect(result.content).toContain('<a href="/linked-page">Linked Page</a>');
  });
});
```

### End-to-End Tests

E2E tests verify the entire system works correctly from user input to final output.

#### Coverage Areas:
- Complete build process
- Generated site functionality
- SEO features
- Performance metrics
- Cross-browser compatibility
- Responsive design
- CLI workflow

#### Implementation:
- **Framework**: Playwright
- **Coverage**: Key user flows and critical paths
- **Browsers**: Chrome, Firefox, Safari
- **Devices**: Desktop, tablet, mobile viewports
- **Running**: Scheduled daily and on release branches

#### Example E2E Test:

```javascript
// Testing complete build process and output
test('builds a site with proper navigation and links', async ({ page }) => {
  // Run the build process
  await runCommand('no-dig build --input=./test-vault --output=./test-dist');
  
  // Start a local server
  const server = await startServer('./test-dist');
  
  // Visit the home page
  await page.goto('http://localhost:3000');
  
  // Check navigation
  await expect(page.locator('nav')).toBeVisible();
  
  // Check for wikilinks
  await page.click('a:text("Linked Page")');
  
  // Verify navigation worked
  await expect(page).toHaveURL('http://localhost:3000/linked-page');
  
  // Clean up
  await server.stop();
});
```

## Specialized Testing

### Accessibility Testing

Ensuring WCAG compliance and accessibility for all users.

#### Implementation:
- **Automated**: axe-core integration with Playwright
- **Manual**: Screen reader testing and keyboard navigation
- **Standards**: WCAG 2.1 AA compliance
- **Running**: Automated on pull requests, manual before releases

#### Example Accessibility Test:

```javascript
// Testing accessibility compliance
test('pages meet accessibility standards', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Run axe accessibility tests
  const violations = await runAxe(page);
  
  // Should have no accessibility violations
  expect(violations.length).toBe(0);
});
```

### Performance Testing

Verifying the system meets performance targets.

#### Implementation:
- **Tools**: Lighthouse CI, WebPageTest API
- **Metrics**: Core Web Vitals, PageSpeed score
- **Thresholds**: 90+ on all Lighthouse categories
- **Running**: Automated on release branches

#### Example Performance Test:

```javascript
// Testing performance metrics
test('meets performance targets', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Run Lighthouse performance audit
  const metrics = await runLighthouse(page);
  
  // Check Core Web Vitals
  expect(metrics.LCP).toBeLessThan(2500); // Largest Contentful Paint
  expect(metrics.FID).toBeLessThan(100);  // First Input Delay
  expect(metrics.CLS).toBeLessThan(0.1);  // Cumulative Layout Shift
  
  // Check overall score
  expect(metrics.performance).toBeGreaterThan(90);
});
```

### SEO Testing

Verifying SEO features and compliance.

#### Implementation:
- **Tools**: Custom SEO validator, structured data testing
- **Checks**: Meta tags, structured data, sitemaps
- **Standards**: Schema.org validation
- **Running**: Automated on release branches

#### Example SEO Test:

```javascript
// Testing SEO features
test('implements proper SEO features', async ({ page }) => {
  await page.goto('http://localhost:3000/product-page');
  
  // Check meta tags
  await expect(page.locator('meta[name="description"]')).toBeVisible();
  
  // Check structured data
  const structuredData = await page.evaluate(() => {
    return JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  });
  
  expect(structuredData['@type']).toBe('Product');
  expect(structuredData.name).toBeDefined();
  expect(structuredData.price).toBeDefined();
});
```

### Visual Regression Testing

Ensuring UI consistency across changes.

#### Implementation:
- **Tools**: Playwright with visual comparisons
- **Coverage**: Key pages and components
- **Thresholds**: Pixel difference tolerance of 0.5%
- **Running**: Automated on pull requests

#### Example Visual Regression Test:

```javascript
// Testing visual consistency
test('maintains visual consistency', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Take a screenshot and compare to baseline
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixelRatio: 0.005
  });
});
```

## Continuous Integration

NO-DIG uses GitHub Actions for continuous integration, with the following workflow:

### On Every Commit:
- Lint code
- Run unit tests
- Check type definitions

### On Pull Requests:
- Run all unit tests
- Run integration tests
- Run accessibility tests
- Run visual regression tests
- Check code coverage
- Perform static analysis

### On Release Branches:
- Run all tests (unit, integration, E2E)
- Run performance tests
- Run SEO tests
- Build example sites
- Generate documentation

## Package-Level CI Workflows

Each package in the NO-DIG ecosystem has its own CI workflow:

### Core Package CI:
```yaml
# .github/workflows/core-package.yml
name: Core Package CI

on:
  push:
    paths:
      - 'packages/core/**'
      - '.github/workflows/core-package.yml'
  pull_request:
    paths:
      - 'packages/core/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:core
      - run: npm run lint:core
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          flags: core
```

### CLI Package CI:
```yaml
# .github/workflows/cli-package.yml
name: CLI Package CI

on:
  push:
    paths:
      - 'packages/cli/**'
      - '.github/workflows/cli-package.yml'
  pull_request:
    paths:
      - 'packages/cli/**'

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:cli
      - run: npm run lint:cli
```

### Adapter Package CI:
```yaml
# .github/workflows/adapter-11ty-package.yml
name: Adapter 11ty Package CI

on:
  push:
    paths:
      - 'packages/adapter-11ty/**'
      - '.github/workflows/adapter-11ty-package.yml'
  pull_request:
    paths:
      - 'packages/adapter-11ty/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:adapter-11ty
      - run: npm run lint:adapter-11ty
```

### Plugin Packages CI:
```yaml
# .github/workflows/plugins-package.yml
name: Plugins Package CI

on:
  push:
    paths:
      - 'packages/plugins/**'
      - '.github/workflows/plugins-package.yml'
  pull_request:
    paths:
      - 'packages/plugins/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:plugins
      - run: npm run lint:plugins
```

## Automation Tools

### Code Quality
- **ESLint**: Static code analysis
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **SonarQube**: Code quality and security analysis

### Testing
- **Jest**: Unit and integration testing
- **Playwright**: E2E and visual testing
- **axe-core**: Accessibility testing
- **Lighthouse CI**: Performance testing

### CI/CD
- **GitHub Actions**: Workflow automation
- **Dependabot**: Dependency updates
- **CodeQL**: Security scanning
- **Release Drafter**: Release notes generation

## Test Data Management

NO-DIG uses a combination of approaches for test data:

1. **Fixture Files**: Static test data for predictable tests
2. **Factories**: Dynamically generated test data
3. **Snapshots**: Saved expected outputs for comparison
4. **Test Vault**: Complete Obsidian vault for E2E testing

Example test vault structure:
```
test-vault/
├── Home.md
├── Products/
│   ├── Product A.md
│   └── Product B.md
├── Services/
│   ├── Service X.md
│   └── Service Y.md
└── About.md
```

## Reporting and Monitoring

### Test Reporting
- **JUnit XML**: Standard test results format
- **HTML Reports**: Human-readable test reports
- **Coverage Reports**: Code coverage visualization
- **Performance Dashboards**: Lighthouse and Core Web Vitals tracking

### Monitoring
- **Error Tracking**: Integration with error tracking services
- **Performance Monitoring**: Real User Monitoring (RUM)
- **Build Monitoring**: Build time and success rate tracking
- **Dependency Monitoring**: Security and update notifications

## Package Release Testing

Before releasing new versions of packages, additional testing is performed:

1. **Version Compatibility**: Testing with different versions of dependent packages
2. **Upgrade Path**: Testing upgrade from previous versions
3. **API Stability**: Verifying public API contracts
4. **Documentation Accuracy**: Ensuring documentation matches implementation

## Conclusion

This comprehensive testing and automation strategy ensures that NO-DIG maintains high quality, performance, and reliability throughout its development lifecycle. By following test-driven development practices and implementing thorough automated testing across all packages, the project can evolve with confidence while maintaining its commitment to excellence.

For more information on the package ecosystem architecture, see [[architecture-and-features]].
For details on the plugin API and how to test plugins, see [[plugin-api]].
For information on the deployment and release process, see [[deployment-and-delivery-strategy]].
