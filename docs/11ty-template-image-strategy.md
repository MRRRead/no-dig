# Image Optimization Strategy for NO-DIG

## Overview

This document outlines the comprehensive image optimization strategy for NO-DIG, focusing on next-generation formats (WebP, AVIF), vector graphics (SVG), and responsive image delivery to ensure optimal performance for business websites.

## Core Principles

1. **Format Optimization**: Automatically convert images to the most efficient formats
2. **Size Optimization**: Generate responsive variants for different viewport sizes
3. **Loading Optimization**: Implement lazy loading and progressive loading techniques
4. **Compatibility**: Ensure cross-browser support with appropriate fallbacks
5. **Automation**: Handle all optimizations during the build process

## Implementation Strategy

### 1. Image Format Conversion

#### 1.1 Vector Graphics (SVG)

- Preserve SVG format for all vector graphics
- Apply SVGO optimization during build
- Inline critical SVGs in HTML for faster rendering
- External SVGs for larger or reused graphics

**Implementation Example:**

```javascript
// SVG optimization in core package
const svgo = require('svgo');

function optimizeSVG(content) {
  const result = svgo.optimize(content, {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            // other SVGO options
          },
        },
      },
    ],
  });
  return result.data;
}
```

#### 1.2 Raster Images (WebP/AVIF)

- Convert all JPG/PNG images to WebP format by default
- Generate AVIF versions for browsers with support
- Maintain original format as fallback for older browsers
- Apply appropriate compression levels based on image content

**Implementation Example:**

```javascript
// Image conversion in core package
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convertImage(inputPath, outputDir) {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const imageBuffer = fs.readFileSync(inputPath);
  
  // Generate WebP
  await sharp(imageBuffer)
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, `${baseName}.webp`));
    
  // Generate AVIF
  try {
    await sharp(imageBuffer)
      .avif({ quality: 65 })
      .toFile(path.join(outputDir, `${baseName}.avif`));
  } catch (e) {
    console.log('AVIF conversion failed, skipping');
  }
  
  // Copy original as fallback
  fs.copyFileSync(inputPath, path.join(outputDir, path.basename(inputPath)));
}
```

### 2. Responsive Image Generation

- Generate multiple size variants for each image
- Use standard breakpoints for consistency
- Apply appropriate compression for each size
- Create both WebP and fallback formats for each size

**Implementation Example:**

```javascript
// Responsive image generation in core package
async function generateResponsiveImages(inputPath, outputDir) {
  const sizes = [320, 640, 960, 1280, 1920];
  const formats = ['webp', 'avif', 'original'];
  const results = [];
  
  const imageBuffer = fs.readFileSync(inputPath);
  const originalFormat = path.extname(inputPath).substring(1);
  
  for (const size of sizes) {
    // Base image processing
    const resizedImage = sharp(imageBuffer).resize(size);
    
    // WebP version
    await resizedImage
      .clone()
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${path.basename(inputPath, path.extname(inputPath))}-${size}.webp`));
    
    // AVIF version
    try {
      await resizedImage
        .clone()
        .avif({ quality: 65 })
        .toFile(path.join(outputDir, `${path.basename(inputPath, path.extname(inputPath))}-${size}.avif`));
    } catch (e) {
      console.log(`AVIF conversion failed for size ${size}, skipping`);
    }
    
    // Original format version
    await resizedImage
      .toFormat(originalFormat)
      .toFile(path.join(outputDir, `${path.basename(inputPath, path.extname(inputPath))}-${size}${path.extname(inputPath)}`));
  }
  
  return results;
}
```

### 3. Picture Element Generation

- Automatically generate `<picture>` elements with appropriate `srcset`
- Include WebP/AVIF as primary sources with fallbacks
- Add appropriate `sizes` attributes for responsive behavior
- Implement lazy loading by default

**Implementation Example:**

```javascript
// Picture element generation in adapter-11ty package
function generatePictureElement(src, alt, sizes = "100vw", className = "") {
  // Get base name and extension
  const baseName = path.basename(src, path.extname(src));
  const baseDir = path.dirname(src);
  
  // Build srcset strings
  const sizesArray = [320, 640, 960, 1280, 1920];
  
  const avifSrcset = sizesArray.map(size => 
    `${baseDir}/${baseName}-${size}.avif ${size}w`
  ).join(', ');
  
  const webpSrcset = sizesArray.map(size => 
    `${baseDir}/${baseName}-${size}.webp ${size}w`
  ).join(', ');
  
  const fallbackSrcset = sizesArray.map(size => 
    `${baseDir}/${baseName}-${size}${path.extname(src)} ${size}w`
  ).join(', ');
  
  // Build picture element
  return `<picture>
    <source type="image/avif" srcset="${avifSrcset}" sizes="${sizes}">
    <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">
    <source srcset="${fallbackSrcset}" sizes="${sizes}">
    <img src="${baseDir}/${baseName}-640${path.extname(src)}" alt="${alt}" class="${className}" loading="lazy" decoding="async">
  </picture>`;
}
```

### 4. SVG Handling

- Provide shortcodes for inline SVG inclusion
- Support external SVG with proper accessibility attributes
- Enable CSS styling of SVG elements
- Optimize SVG for animation when needed

**Implementation Example:**

```javascript
// SVG handling in adapter-11ty package
function inlineSVG(src, className = "", ariaLabel = "") {
  const svgContent = fs.readFileSync(path.join('./src', src), 'utf8');
  const optimizedSVG = optimizeSVG(svgContent);
  
  // Add class and aria attributes if provided
  let result = optimizedSVG;
  if (className) {
    result = result.replace('<svg', `<svg class="${className}"`);
  }
  if (ariaLabel) {
    result = result.replace('<svg', `<svg aria-label="${ariaLabel}" role="img"`);
  }
  
  return result;
}
```

### 5. Image Processing Pipeline

The complete image processing pipeline includes:

1. **Discovery**: Find all images in the content and assets directories
2. **Analysis**: Determine image type, dimensions, and optimization strategy
3. **Conversion**: Transform to optimal formats (WebP/AVIF for raster, optimized SVG for vector)
4. **Resizing**: Generate responsive variants for different viewport sizes
5. **Optimization**: Apply format-specific optimizations (compression, metadata stripping)
6. **Output**: Save optimized images to the build directory
7. **Markup Generation**: Create appropriate HTML markup with `<picture>` elements

**Implementation Example:**

```javascript
// Image processing pipeline in core package
async function processImages(inputDir, outputDir, options = {}) {
  // Find all images
  const images = await glob(`${inputDir}/**/*.{jpg,jpeg,png,gif,svg}`);
  
  for (const image of images) {
    const ext = path.extname(image).toLowerCase();
    const relativePath = path.relative(inputDir, image);
    const outputPath = path.join(outputDir, relativePath);
    
    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    
    if (ext === '.svg') {
      // Process SVG
      const svgContent = fs.readFileSync(image, 'utf8');
      const optimizedSVG = optimizeSVG(svgContent);
      fs.writeFileSync(outputPath, optimizedSVG);
    } else {
      // Process raster image
      await generateResponsiveImages(image, path.dirname(outputPath));
    }
  }
}
```

## Integration with NO-DIG

### 1. Configuration

```javascript
// no-dig.config.js
module.exports = {
  // ... other configuration
  
  // Image optimization configuration
  images: {
    inputDir: './src/assets/images',
    outputDir: './dist/assets/images',
    sizes: [320, 640, 960, 1280, 1920],
    formats: ['webp', 'avif', 'original'],
    quality: {
      webp: 80,
      avif: 65,
      jpg: 85,
      png: 90
    },
    svgo: {
      // SVGO options
    }
  }
};
```

### 2. Template Usage

```html
<!-- Using the responsive image shortcode in adapter-11ty package -->
{% respImage "assets/images/hero.jpg", "Hero image description", "(min-width: 1280px) 1280px, 100vw", "hero-image" %}

<!-- Using the inline SVG shortcode in adapter-11ty package -->
{% inlineSVG "assets/icons/arrow.svg", "icon-arrow", "Arrow icon" %}
```

### 3. Markdown Transform

For images in Markdown content, automatically transform standard Markdown image syntax to use the responsive image shortcode:

```javascript
// Markdown image transform in adapter-11ty package
function transformMarkdownImages(content, outputPath) {
  if(outputPath && outputPath.endsWith(".html")) {
    // Find Markdown-style images and replace with responsive images
    return content.replace(
      /<p><img src="([^"]+)" alt="([^"]+)"[^>]*><\/p>/g,
      (match, src, alt) => {
        return generatePictureElement(src, alt);
      }
    );
  }
  return content;
}
```

## Business-Specific Optimizations

### 1. Logo Optimization

- Prioritize SVG format for logos
- Provide high-quality raster fallbacks
- Ensure proper rendering at all sizes
- Optimize for fast loading on initial page view

```javascript
// Logo optimization in core package
function optimizeLogo(logoPath, outputDir) {
  const ext = path.extname(logoPath).toLowerCase();
  
  if (ext === '.svg') {
    // Optimize SVG logo
    const svgContent = fs.readFileSync(logoPath, 'utf8');
    const optimizedSVG = optimizeSVG(svgContent);
    fs.writeFileSync(path.join(outputDir, path.basename(logoPath)), optimizedSVG);
  } else {
    // Create responsive versions of raster logo
    generateResponsiveImages(logoPath, outputDir);
  }
}
```

### 2. Product Image Optimization

- Generate multiple sizes for product images
- Create square thumbnails for consistent grids
- Apply higher quality settings for product details
- Implement zoom capability for high-resolution versions

```javascript
// Product image optimization in core package
async function optimizeProductImage(imagePath, outputDir) {
  // Generate standard responsive images
  await generateResponsiveImages(imagePath, outputDir);
  
  // Generate square thumbnails
  const sizes = [100, 200, 400];
  const imageBuffer = fs.readFileSync(imagePath);
  
  for (const size of sizes) {
    await sharp(imageBuffer)
      .resize(size, size, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, `${path.basename(imagePath, path.extname(imagePath))}-thumb-${size}.webp`));
  }
  
  // Generate high-resolution version for zoom
  await sharp(imageBuffer)
    .webp({ quality: 90 })
    .toFile(path.join(outputDir, `${path.basename(imagePath, path.extname(imagePath))}-zoom.webp`));
}
```

### 3. Hero Image Optimization

- Prioritize loading speed for hero images
- Generate art-directed crops for different viewports
- Implement progressive loading techniques
- Optimize for Core Web Vitals (LCP)

```javascript
// Hero image optimization in core package
async function optimizeHeroImage(imagePath, outputDir) {
  const imageBuffer = fs.readFileSync(imagePath);
  
  // Desktop version (landscape)
  await sharp(imageBuffer)
    .resize(1920, 800, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, `${path.basename(imagePath, path.extname(imagePath))}-hero-desktop.webp`));
  
  // Tablet version (square-ish)
  await sharp(imageBuffer)
    .resize(1024, 768, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, `${path.basename(imagePath, path.extname(imagePath))}-hero-tablet.webp`));
  
  // Mobile version (portrait)
  await sharp(imageBuffer)
    .resize(640, 800, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, `${path.basename(imagePath, path.extname(imagePath))}-hero-mobile.webp`));
  
  // Low-quality placeholder
  await sharp(imageBuffer)
    .resize(60, 40)
    .blur(3)
    .webp({ quality: 20 })
    .toFile(path.join(outputDir, `${path.basename(imagePath, path.extname(imagePath))}-hero-placeholder.webp`));
}
```

## Performance Benefits

### 1. File Size Reduction

- WebP typically reduces file size by 25-35% compared to JPEG at equivalent quality
- AVIF can reduce file size by 50% compared to JPEG
- Optimized SVGs can be 50%+ smaller than unoptimized versions

### 2. Loading Speed Improvements

- Smaller file sizes lead to faster downloads
- Responsive images prevent downloading unnecessarily large images
- Lazy loading defers off-screen images until needed

### 3. PageSpeed Score Impact

- Next-gen image formats directly improve Lighthouse performance score
- Properly sized images address the "Properly size images" audit
- Lazy loading improves "Offscreen images" audit

## Browser Compatibility

### 1. Format Support

- **WebP**: Supported in all modern browsers (Chrome, Firefox, Safari 14+, Edge)
- **AVIF**: Growing support (Chrome, Firefox, Opera)
- **SVG**: Universal support in all modern browsers

### 2. Fallback Strategy

- Use `<picture>` element with multiple `<source>` elements
- Provide JPEG/PNG fallbacks for browsers without WebP/AVIF support
- Ensure the final `<img>` element works in all browsers

## Conclusion

This comprehensive image optimization strategy ensures that all images in NO-DIG are automatically converted to the most efficient formats (SVG for vectors, WebP/AVIF for rasters) with appropriate fallbacks. The implementation is fully automated during the build process, requiring no manual intervention from content creators while significantly improving performance and PageSpeed scores for business websites.
