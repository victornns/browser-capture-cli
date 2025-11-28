# Browser Capture CLI - Usage Examples

## Table of Contents
- [Basic Commands](#basic-commands)
- [Advanced Workflows](#advanced-workflows)
- [Configuration Examples](#configuration-examples)
- [Common Use Cases](#common-use-cases)
- [Tips & Tricks](#tips--tricks)

---

## Basic Commands

### 1. Crawl a Website

**Basic crawl:**
```bash
npm run crawl -- example
```

**Crawl with depth limit:**
```bash
npm run crawl -- example --max-depth 3
```

**Custom output location:**
```bash
npm run crawl -- example --output data/my-urls.txt
```

### 2. Capture Screenshots

**Single viewport (desktop):**
```bash
npm run capture -- example
```

**Multiple viewports:**
```bash
npm run capture -- example --viewports desktop,mobile,tablet
```

**From existing URL file:**
```bash
npm run capture -- example --source file --input data/urls.txt
```

**All viewports:**
```bash
npm run capture -- example --viewports desktop,mobile,tablet,4k
```

**Custom output directory:**
```bash
npm run capture -- example --output output/my-screenshots
```

### 3. Record Videos

**Basic recording:**
```bash
npm run record -- example
```

**Custom scroll speed:**
```bash
npm run record -- example --scroll-speed 200
```

**Higher quality (more FPS):**
```bash
npm run record -- example --fps 60
```

**Mobile viewport:**
```bash
npm run record -- example --viewport mobile
```

**From URL file:**
```bash
npm run record -- example --source file --input data/urls.txt
```

### 4. Generate PDFs

**Basic PDF generation:**
```bash
npm run pdf -- example
```

**From URL file:**
```bash
npm run pdf -- example --source file --input data/urls.txt
```

**Custom output directory:**
```bash
npm run pdf -- example --output output/my-pdfs
```

---

## Advanced Workflows

### Workflow 1: Full Site Capture

Capture everything from a site:

```bash
# Step 1: Crawl the site
npm run crawl -- example --max-depth 2 --output data/site-urls.txt

# Step 2: Capture all viewports
npm run capture -- example --source file --input data/site-urls.txt --viewports desktop,mobile,tablet

# Step 3: Generate PDFs for documentation
npm run pdf -- example --source file --input data/site-urls.txt
```

### Workflow 2: Selective Recording

Record only specific pages:

```bash
# Step 1: Crawl to discover all pages
npm run crawl -- example --output data/all-urls.txt

# Step 2: Edit data/all-urls.txt manually to select pages

# Step 3: Record selected pages
npm run record -- example --source file --input data/all-urls.txt --scroll-speed 150 --fps 30
```

### Workflow 3: Multi-Device Testing

Test responsive design:

```bash
# Capture same pages in all viewports
npm run capture -- example --source file --input urls.txt --viewports mobile,tablet,desktop,4k
```

### Workflow 4: Documentation Generation

Create comprehensive documentation:

```bash
# Crawl
npm run crawl -- example --max-depth 3

# Screenshots (desktop only for docs)
npm run capture -- example --source file --input data/urls.txt --viewports desktop

# PDFs for print
npm run pdf -- example --source file --input data/urls.txt
```

---

## Configuration Examples

### Example 1: E-commerce Site

`src/config/sites.ts`:
```typescript
ecommerce: {
  name: 'ecommerce',
  baseUrl: 'https://shop.example.com',
  maxDepth: 3,
  allowedPaths: ['/products', '/categories'],
  excludedPaths: ['/checkout', '/cart', '/account'],
  crawlDelay: 2000, // Be polite, 2 seconds between requests
}
```

Usage:
```bash
npm run crawl -- ecommerce
npm run capture -- ecommerce --viewports mobile,desktop
```

### Example 2: Documentation Site

`src/config/sites.ts`:
```typescript
docs: {
  name: 'docs',
  baseUrl: 'https://docs.example.com',
  maxDepth: 5, // Deep documentation hierarchy
  allowedPaths: ['/docs'],
  excludedPaths: ['/api', '/admin'],
  crawlDelay: 500,
}
```

Usage:
```bash
npm run crawl -- docs --max-depth 5
npm run pdf -- docs --source file --input data/urls.txt
```

### Example 3: Blog

`src/config/sites.ts`:
```typescript
blog: {
  name: 'blog',
  baseUrl: 'https://blog.example.com',
  maxDepth: 2,
  allowedPaths: ['/posts', '/categories'],
  excludedPaths: ['/admin', '/wp-admin'],
  crawlDelay: 1000,
}
```

Usage:
```bash
npm run crawl -- blog
npm run capture -- blog --viewports desktop,mobile
```

---

## Common Use Cases

### Use Case 1: Visual Regression Testing

Compare screenshots before and after changes:

```bash
# Before changes
npm run capture -- example --output output/before --viewports desktop
# Make changes to the site
# After changes
npm run capture -- example --output output/after --viewports desktop
# Compare folders manually or with image diff tool
```

### Use Case 2: Client Presentations

Create demo videos:

```bash
# Create polished URLs file with key pages
echo "https://example.com/" > demo-pages.txt
echo "https://example.com/features" >> demo-pages.txt
echo "https://example.com/pricing" >> demo-pages.txt

# Record with slow, smooth scrolling
npm run record -- example --source file --input demo-pages.txt --scroll-speed 50 --fps 30
```

### Use Case 3: Archive Website

Archive a complete website:

```bash
# Crawl everything
npm run crawl -- example --max-depth 5 --output archive/urls.txt

# Capture screenshots
npm run capture -- example --source file --input archive/urls.txt --viewports desktop --output archive/screenshots

# Generate PDFs
npm run pdf -- example --source file --input archive/urls.txt --output archive/pdfs
```

### Use Case 4: Mobile-First Review

Check mobile responsiveness:

```bash
# Mobile viewport only
npm run capture -- example --viewports mobile --output output/mobile-review

# Or compare mobile vs desktop
npm run capture -- example --viewports mobile,desktop
```

### Use Case 5: SEO Audit

Capture all pages for manual review:

```bash
# Deep crawl
npm run crawl -- example --max-depth 4

# Screenshots for visual audit
npm run capture -- example --source file --input data/urls.txt --viewports desktop
```

---

## Tips & Tricks

### Tip 1: URL File Management

Create specific URL lists for different purposes:

```bash
# Key landing pages
echo "https://example.com/" > landing-pages.txt
echo "https://example.com/pricing" >> landing-pages.txt
echo "https://example.com/signup" >> landing-pages.txt

# Documentation pages
echo "https://example.com/docs" > docs-pages.txt
echo "https://example.com/docs/getting-started" >> docs-pages.txt
```

### Tip 2: Custom Scroll Speeds

Different scroll speeds for different content:

```bash
# Fast scroll for long pages
npm run record -- example --scroll-speed 200

# Slow scroll for detailed content
npm run record -- example --scroll-speed 50

# Medium scroll (default)
npm run record -- example --scroll-speed 100
```

### Tip 3: Output Organization

Organize outputs by date or purpose:

```bash
# By date
npm run capture -- example --output "output/screenshots/$(date +%Y-%m-%d)"

# By purpose
npm run capture -- example --output output/client-review
npm run capture -- example --output output/internal-qa
```

### Tip 4: Selective Crawling

Use URL patterns to filter:

```bash
# After crawling, filter URLs
npm run crawl -- example --output data/all-urls.txt

# Filter only blog posts (using grep)
grep "/blog/" data/all-urls.txt > data/blog-urls.txt

# Capture only filtered URLs
npm run capture -- example --source file --input data/blog-urls.txt
```

### Tip 5: Video Quality

Balance quality and file size:

```bash
# Low quality, small files (presentations)
npm run record -- example --fps 15 --scroll-speed 150

# High quality, larger files (detailed demos)
npm run record -- example --fps 60 --scroll-speed 75

# Standard quality (default)
npm run record -- example --fps 30 --scroll-speed 100
```

### Tip 6: Batch Processing

Process multiple sites:

```bash
#!/bin/bash
# process-sites.sh

sites=("example" "docs" "blog")

for site in "${sites[@]}"; do
  echo "Processing $site..."
  npm run crawl -- "$site"
  npm run capture -- "$site" --source file --input data/urls.txt --viewports desktop
done
```

### Tip 7: Error Recovery

If a command fails midway, you can resume:

```bash
# If crawl fails, urls.txt will have partial results
# Edit to remove duplicates if needed, then continue:
npm run capture -- example --source file --input data/urls.txt
```

### Tip 8: Custom Viewports

For specific device testing, add to `src/config/viewports.ts`:

```typescript
ipadPro: {
  name: 'ipadPro',
  width: 1024,
  height: 1366,
},
galaxyS20: {
  name: 'galaxyS20',
  width: 360,
  height: 800,
},
```

Then use:
```bash
npm run capture -- example --viewports ipadPro,galaxyS20
```

### Tip 9: Combining with Shell Scripts

Automate complex workflows:

```bash
#!/bin/bash
# full-capture.sh

SITE=$1
DATE=$(date +%Y%m%d)
OUTPUT_DIR="output/$DATE/$SITE"

echo "Starting full capture for $SITE..."

# Crawl
npm run crawl -- "$SITE" --output "data/$SITE-urls.txt"

# Screenshots
npm run capture -- "$SITE" --source file --input "data/$SITE-urls.txt" --viewports desktop,mobile --output "$OUTPUT_DIR/screenshots"

# Videos (desktop only)
npm run record -- "$SITE" --source file --input "data/$SITE-urls.txt" --viewport desktop --output "$OUTPUT_DIR/videos"

# PDFs
npm run pdf -- "$SITE" --source file --input "data/$SITE-urls.txt" --output "$OUTPUT_DIR/pdfs"

echo "Complete! Output saved to $OUTPUT_DIR"
```

Usage:
```bash
chmod +x full-capture.sh
./full-capture.sh example
```

---

## Troubleshooting Examples

### Problem: Too many URLs crawled

**Solution**: Reduce max depth or use excludedPaths

```bash
# Instead of:
npm run crawl -- example --max-depth 5

# Try:
npm run crawl -- example --max-depth 2
```

### Problem: Videos are too fast

**Solution**: Reduce scroll speed

```bash
# Instead of:
npm run record -- example --scroll-speed 200

# Try:
npm run record -- example --scroll-speed 50
```

### Problem: Screenshots missing content

**Solution**: Site might need longer to load

Edit `src/config/defaults.ts` to increase timeouts:
```typescript
navigationTimeout: 90000, // 90 seconds instead of 60
```

### Problem: FFmpeg not found

**Solution**: Install FFmpeg

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Then retry recording
npm run record -- example
```

---

## Summary

This tool provides flexible options for:
- 🔍 **Discovering** pages through crawling
- 📸 **Capturing** screenshots in multiple viewports
- 🎥 **Recording** smooth-scrolling videos
- 📄 **Generating** print-ready PDFs

Combine these features to create powerful automation workflows tailored to your needs!
