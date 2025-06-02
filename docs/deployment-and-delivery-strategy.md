# Deployment and Delivery Strategy

This document outlines the comprehensive deployment and delivery strategy for NO-DIG, covering hosting platforms, CI/CD pipelines, caching mechanisms, CDN integration, and npm package release workflows.

## 1. Package Release Strategy

### 1.1 Package Ecosystem

NO-DIG follows a modular package-based architecture with independent versioning and release cycles:

| Package | Description | Release Cadence |
|---------|-------------|-----------------|
| **@no-dig/cli** | Command-line interface | As needed for new features/fixes |
| **@no-dig/core** | Core vault parsing and plugin host | Conservative, stability-focused |
| **@no-dig/adapter-11ty** | 11ty integration adapter | Aligned with 11ty releases |
| **@no-dig/plugins/*** | Official plugins | Feature-driven, independent cycles |

### 1.2 Semantic Versioning

All NO-DIG packages follow semantic versioning (SemVer):

- **Major Version (X.0.0)**: Breaking changes that require user action
- **Minor Version (0.X.0)**: New features in a backward-compatible manner
- **Patch Version (0.0.X)**: Bug fixes and minor improvements

### 1.3 Release Automation with semantic-release

NO-DIG uses semantic-release to automate the package release workflow:

```yaml
# .github/workflows/release-core.yml
name: Release Core Package

on:
  push:
    branches:
      - main
    paths:
      - 'packages/core/**'
      - '.github/workflows/release-core.yml'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build package
        run: npm run build:core
      
      - name: Run tests
        run: npm run test:core
      
      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release --extends ./packages/core/release.config.js
```

Similar workflows exist for each package in the ecosystem.

### 1.4 Release Configuration

Each package has its own release configuration:

```javascript
// packages/core/release.config.js
module.exports = {
  branches: ['main'],
  pkgRoot: 'packages/core',
  tagFormat: 'core-v${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'packages/core/CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['packages/core/CHANGELOG.md', 'packages/core/package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
```

### 1.5 Monorepo Release Coordination

For coordinated releases across multiple packages:

```yaml
# .github/workflows/release-all.yml
name: Release All Packages

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to release (major, minor, patch)'
        required: true
        default: 'patch'

jobs:
  release-packages:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: [core, cli, adapter-11ty, plugins]
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build package
        run: npm run build:${{ matrix.package }}
      
      - name: Run tests
        run: npm run test:${{ matrix.package }}
      
      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          RELEASE_TYPE: ${{ github.event.inputs.version }}
        run: |
          npx semantic-release --extends ./packages/${{ matrix.package }}/release.config.js
```

### 1.6 Package Interdependency Management

NO-DIG manages package interdependencies through:

- **Peer Dependencies**: For adapter and plugin dependencies on core
- **Version Ranges**: Using caret ranges (`^x.y.z`) for flexibility
- **Lockstep Updates**: Coordinated updates for breaking changes

Example package.json:

```json
{
  "name": "@no-dig/adapter-11ty",
  "version": "1.0.0",
  "peerDependencies": {
    "@no-dig/core": "^1.0.0"
  },
  "devDependencies": {
    "@no-dig/core": "^1.0.0"
  }
}
```

## 2. Hosting Platforms

### 2.1 Recommended Hosting Options

#### 2.1.1 Primary Recommendations

| Platform | Strengths | Considerations | Best For |
|----------|-----------|----------------|----------|
| **Netlify** | - Native 11ty support<br>- Built-in form handling<br>- Automatic branch deployments<br>- Edge functions | - Higher cost at scale<br>- Limited build minutes on free tier | Sites requiring forms, serverless functions, and branch previews |
| **Vercel** | - Excellent performance<br>- Global edge network<br>- Advanced analytics<br>- Seamless Git integration | - Form handling requires custom solution<br>- Higher cost at scale | Sites prioritizing performance and developer experience |
| **GitHub Pages** | - Free for public repositories<br>- Simple workflow<br>- GitHub Actions integration | - Limited functionality<br>- No server-side features | Simple sites with minimal dynamic requirements |
| **Cloudflare Pages** | - Unlimited bandwidth<br>- Global CDN<br>- Free SSL<br>- Workers integration | - Newer platform<br>- Some features in beta | Sites needing edge computing capabilities and global performance |

#### 2.1.2 Self-Hosted Options

| Platform | Strengths | Considerations | Best For |
|----------|-----------|----------------|----------|
| **Digital Ocean App Platform** | - Predictable pricing<br>- Good performance<br>- Simple scaling | - Manual configuration<br>- Less integrated tooling | Teams with DevOps experience and cost sensitivity |
| **AWS Amplify** | - AWS ecosystem integration<br>- Powerful capabilities<br>- Enterprise-grade | - Steeper learning curve<br>- Complex pricing | Enterprise sites with existing AWS infrastructure |
| **Azure Static Web Apps** | - Microsoft ecosystem integration<br>- Enterprise features<br>- Global distribution | - Newer service<br>- Some limitations compared to competitors | Organizations using Microsoft technologies |

### 2.2 Platform Selection Criteria

When selecting a hosting platform, consider the following factors:

1. **Technical Requirements**
   - Form handling needs
   - Serverless function requirements
   - Authentication needs
   - Build process complexity

2. **Scale and Performance**
   - Expected traffic volume
   - Geographic distribution of users
   - Performance requirements
   - Content update frequency

3. **Budget Considerations**
   - Initial setup costs
   - Ongoing maintenance costs
   - Scaling costs
   - Developer time investment

4. **Team Capabilities**
   - DevOps expertise
   - Familiarity with platforms
   - Maintenance bandwidth
   - Support requirements

### 2.3 Platform-Specific Configurations

#### 2.3.1 Netlify Configuration

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "16"

[context.production]
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  environment = { NODE_ENV = "staging" }

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self'; img-src 'self' data: https:; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://www.google-analytics.com;"
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

#### 2.3.2 Vercel Configuration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      },
      "continue": true
    },
    {
      "src": "/(.*).html",
      "headers": {
        "cache-control": "public, max-age=0, must-revalidate"
      }
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/404.html",
      "status": 404
    }
  ]
}
```

## 3. CI/CD Pipeline

### 3.1 Continuous Integration

#### 3.1.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Test
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Check a11y
        run: npm run test:a11y
        
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist
```

#### 3.1.2 GitLab CI/CD Configuration

```yaml
# .gitlab-ci.yml
stages:
  - install
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "16"

install:
  stage: install
  script:
    - npm ci
  cache:
    paths:
      - node_modules/
  artifacts:
    paths:
      - node_modules/

test:
  stage: test
  script:
    - npm run lint
    - npm test
  dependencies:
    - install

build:
  stage: build
  script:
    - npm run build
  dependencies:
    - install
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - npx netlify-cli deploy --site $NETLIFY_SITE_ID --auth $NETLIFY_AUTH_TOKEN --prod
  dependencies:
    - build
  only:
    - main
```

### 3.2 Continuous Deployment

#### 3.2.1 Environment Strategy

| Environment | Purpose | Trigger | URL Pattern | Notes |
|-------------|---------|---------|-------------|-------|
| **Development** | Local development | Manual | localhost | For individual developer work |
| **Feature Preview** | Testing specific features | PR/MR creation | feature-name.preview.domain.com | Automatic deployment from feature branches |
| **Staging** | Pre-production testing | Merge to develop | staging.domain.com | Full site with staging data |
| **Production** | Live site | Merge to main | domain.com | Requires approval step |

#### 3.2.2 Deployment Workflow

1. **Code Changes**
   - Developer creates feature branch
   - Implements changes with tests
   - Submits pull/merge request

2. **Automated Checks**
   - CI pipeline runs tests
   - Linting and code quality checks
   - Accessibility validation
   - Performance benchmarking

3. **Preview Deployment**
   - Automatic deployment to preview environment
   - Unique URL for review
   - Stakeholder feedback

4. **Review and Approval**
   - Code review by team members
   - QA verification on preview
   - Approval from designated reviewers

5. **Staging Deployment**
   - Merge to develop branch
   - Automatic deployment to staging
   - Integration testing
   - Content team verification

6. **Production Deployment**
   - Merge to main branch
   - Automatic or manual trigger
   - Phased rollout if needed
   - Post-deployment verification

### 3.3 Rollback Strategy

#### 3.3.1 Automated Rollback Triggers

- Failed smoke tests after deployment
- Error rate exceeding threshold
- Performance degradation beyond acceptable limits
- Security vulnerabilities detected

#### 3.3.2 Rollback Process

1. **Immediate Mitigation**
   - Automatic or manual trigger
   - Revert to last known good deployment
   - Notification to team

2. **Investigation**
   - Analysis of failure cause
   - Reproduction in development environment
   - Root cause determination

3. **Resolution**
   - Fix implementation
   - Enhanced testing
   - Deployment through normal pipeline

4. **Prevention**
   - Process improvement
   - Additional automated tests
   - Documentation update

## 4. Caching Strategy

### 4.1 Browser Caching

#### 4.1.1 Cache Headers

| Resource Type | Cache-Control Header | Max Age | Versioning Strategy |
|---------------|----------------------|---------|---------------------|
| HTML | `public, max-age=0, must-revalidate` | None | N/A |
| CSS | `public, max-age=31536000, immutable` | 1 year | Content hash in filename |
| JavaScript | `public, max-age=31536000, immutable` | 1 year | Content hash in filename |
| Images | `public, max-age=31536000, immutable` | 1 year | Content hash in filename |
| Fonts | `public, max-age=31536000, immutable` | 1 year | Content hash in filename |
| Other Assets | `public, max-age=31536000, immutable` | 1 year | Content hash in filename |

#### 4.1.2 Implementation

```javascript
// packages/adapter-11ty/src/asset-caching.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function setupAssetCaching(eleventyConfig) {
  // Hash assets for cache busting
  eleventyConfig.addFilter("assetHash", function(assetPath) {
    const hash = crypto
      .createHash("md5")
      .update(fs.readFileSync(path.join(__dirname, "dist", assetPath)))
      .digest("hex");
    return `/assets/${path.basename(assetPath, path.extname(assetPath))}.${hash}${path.extname(assetPath)}`;
  });
  
  // Generate _headers file for Netlify
  eleventyConfig.addPassthroughCopy("src/_headers");
}

module.exports = { setupAssetCaching };
```

### 4.2 CDN Integration

#### 4.2.1 Recommended CDN Providers

| Provider | Strengths | Considerations | Best For |
|----------|-----------|----------------|----------|
| **Cloudflare** | - Free tier available<br>- Global network<br>- DDoS protection<br>- Edge computing | - Some advanced features require paid plans | Most business sites, especially those needing security features |
| **Netlify Edge** | - Integrated with Netlify hosting<br>- Simple setup<br>- Good performance | - Limited customization compared to dedicated CDNs | Business sites already using Netlify |
| **Vercel Edge Network** | - Integrated with Vercel hosting<br>- Optimized for Next.js<br>- Analytics included | - Tied to Vercel platform | Business sites already using Vercel |
| **AWS CloudFront** | - Highly customizable<br>- Global reach<br>- Integration with AWS services | - Complex setup<br>- Usage-based pricing | Enterprise business sites with specific requirements |

#### 4.2.2 CDN Configuration

**Cloudflare Example:**

```json
// Cloudflare Page Rules
{
  "rules": [
    {
      "targets": [
        "*.domain.com/*"
      ],
      "actions": {
        "cache_level": "aggressive",
        "edge_cache_ttl": {
          "ttl": 2592000
        },
        "browser_cache_ttl": 31536000,
        "cache_key_fields": {
          "header": {
            "exclude": ["cookie"]
          },
          "query_string": {
            "ignore": false
          },
          "user": {
            "lang": false
          },
          "cookie": {
            "include": []
          }
        }
      }
    },
    {
      "targets": [
        "domain.com/*.html"
      ],
      "actions": {
        "cache_level": "standard",
        "edge_cache_ttl": {
          "ttl": 3600
        },
        "browser_cache_ttl": 0
      }
    }
  ]
}
```

### 4.3 Build-Time Optimization

#### 4.3.1 Asset Optimization

- Minification of HTML, CSS, and JavaScript
- Image optimization with WebP and AVIF formats
- SVG optimization
- Critical CSS extraction
- Code splitting for JavaScript

#### 4.3.2 Implementation

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }],
    }),
    require('postcss-critical-split')({
      output: 'critical',
    }),
  ],
};

// webpack.config.js (for JavaScript optimization)
module.exports = {
  // ... other config
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
```

## 5. Performance Monitoring

### 5.1 Real User Monitoring (RUM)

#### 5.1.1 Core Web Vitals Tracking

```javascript
// packages/plugins/analytics/src/web-vitals.js
function setupWebVitalsTracking() {
  if ('PerformanceObserver' in window) {
    // LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      // Report LCP to analytics
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'web-vitals',
        metric: 'LCP',
        value: lastEntry.startTime,
      });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // FID
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        // Report FID to analytics
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'web-vitals',
          metric: 'FID',
          value: entry.processingStart - entry.startTime,
        });
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // CLS
    let clsValue = 0;
    let clsEntries = [];
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });
      // Report CLS to analytics
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'web-vitals',
        metric: 'CLS',
        value: clsValue,
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  }
}

module.exports = { setupWebVitalsTracking };
```

#### 5.1.2 Integration with Analytics

- Google Analytics 4 integration
- Custom events for performance metrics
- User journey correlation
- Device and connection tracking

### 5.2 Synthetic Monitoring

#### 5.2.1 Lighthouse CI Integration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  deployment_status:
    states: [success]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Lighthouse Audit
        uses: treosh/lighthouse-ci-action@v8
        with:
          urls: |
            ${{ github.event.deployment_status.target_url }}
            ${{ github.event.deployment_status.target_url }}/about
            ${{ github.event.deployment_status.target_url }}/blog
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
          temporaryPublicStorage: true
          
      - name: Save results
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-results
          path: .lighthouseci
```

#### 5.2.2 Performance Budgets

```json
// lighthouse-budget.json
{
  "performance": 90,
  "accessibility": 95,
  "best-practices": 95,
  "seo": 95,
  "resource-summary": [
    {
      "resourceType": "document",
      "budget": 20
    },
    {
      "resourceType": "script",
      "budget": 150
    },
    {
      "resourceType": "stylesheet",
      "budget": 50
    },
    {
      "resourceType": "image",
      "budget": 300
    },
    {
      "resourceType": "font",
      "budget": 100
    },
    {
      "resourceType": "total",
      "budget": 600
    }
  ],
  "timing": [
    {
      "metric": "interactive",
      "budget": 3000
    },
    {
      "metric": "first-contentful-paint",
      "budget": 1500
    },
    {
      "metric": "largest-contentful-paint",
      "budget": 2500
    }
  ]
}
```

## 6. Business Website Specific Deployment Considerations

### 6.1 SEO Preservation During Deployment

- Implement proper 301 redirects for URL changes
- Maintain canonical URLs
- Preserve metadata during migrations
- Implement staging environment robots.txt blocking

### 6.2 Downtime Minimization

- Blue-green deployment strategy
- Atomic deployments
- Phased rollout for critical changes
- Maintenance mode page for planned downtime

### 6.3 Business Continuity

- Regular backups of content and configuration
- Disaster recovery plan
- Multi-region deployment for critical sites
- Failover testing

## 7. Package Distribution and Installation

### 7.1 npm Registry

All NO-DIG packages are published to the npm registry:

```bash
# Installing the CLI globally
npm install -g @no-dig/cli

# Installing packages in a project
npm install @no-dig/core @no-dig/adapter-11ty
```

### 7.2 Package Scopes

NO-DIG uses the `@no-dig` scope for all official packages:

- **@no-dig/cli**: Command-line interface
- **@no-dig/core**: Core functionality
- **@no-dig/adapter-11ty**: 11ty adapter
- **@no-dig/plugins/seo**: SEO plugin
- **@no-dig/plugins/images**: Image optimization plugin
- etc.

### 7.3 Package Documentation

Each package includes comprehensive documentation:

- README.md with installation and usage instructions
- API documentation
- Examples
- Changelog

### 7.4 Package Discoverability

To improve discoverability, all packages use consistent:

- Keywords: `no-dig`, `static-site-generator`, `obsidian`, `11ty`, etc.
- Tags: Relevant categories for npm search
- Links: Cross-references to related packages

## 8. Conclusion

This comprehensive deployment and delivery strategy ensures that NO-DIG packages can be reliably published, distributed, and used to build business websites. The package-based architecture allows for flexible deployment options while maintaining high quality and performance standards.

For more information on the package ecosystem architecture, see [[architecture-and-features]].
For details on the plugin API, see [[plugin-api]].
For information on testing strategies, see [[testing-and-automation-strategy]].
