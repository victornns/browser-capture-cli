# Browser Capture CLI - Usage Examples

## Basic Commands

### Crawl
```bash
npm run crawl -- example                           # Basic crawl
npm run crawl -- example --max-depth 3             # Limit depth
npm run crawl -- example --output data/urls.txt    # Custom output
```

### Capture Screenshots
```bash
npm run capture -- example                                    # Single viewport
npm run capture -- example --viewports desktop,mobile,tablet  # Multiple viewports
npm run capture -- example --source file --input data/urls.txt # From file
```

### Record Videos
```bash
npm run record -- example                          # Basic recording
npm run record -- example --scroll-speed 50        # Slow scroll
npm run record -- example --fps 60                 # Higher quality
npm run record -- example --viewport mobile        # Mobile viewport
```

### Generate PDFs
```bash
npm run pdf -- example                                    # Basic PDF
npm run pdf -- example --source file --input urls.txt    # From file
```

---

## Common Workflows

### Full Site Capture
```bash
# 1. Crawl
npm run crawl -- example --max-depth 2 --output data/urls.txt

# 2. Screenshots
npm run capture -- example --source file --input data/urls.txt --viewports desktop,mobile

# 3. PDFs
npm run pdf -- example --source file --input data/urls.txt
```

### Visual Regression Testing
```bash
npm run capture -- example --output output/before --viewports desktop
# Make changes to site
npm run capture -- example --output output/after --viewports desktop
```

### Client Demo Videos
```bash
# Create URL list with key pages
echo "https://example.com/" > demo-pages.txt
echo "https://example.com/features" >> demo-pages.txt

# Record with smooth scrolling
npm run record -- example --source file --input demo-pages.txt --scroll-speed 50 --fps 30
```

---

## Configuration Examples

### E-commerce Site
```typescript
// src/config/sites.ts
ecommerce: {
  name: 'ecommerce',
  baseUrl: 'https://shop.example.com',
  maxDepth: 3,
  allowedPaths: ['/products', '/categories'],
  excludedPaths: ['/checkout', '/cart', '/account'],
  crawlDelay: 2000,
}
```

### Documentation Site
```typescript
docs: {
  name: 'docs',
  baseUrl: 'https://docs.example.com',
  maxDepth: 5,
  allowedPaths: ['/docs'],
  excludedPaths: ['/api', '/admin'],
  crawlDelay: 500,
}
```

---

## Tips

### Organize Outputs by Date
```bash
npm run capture -- example --output "output/$(date +%Y-%m-%d)"
```

### Filter URLs
```bash
npm run crawl -- example --output data/all-urls.txt
grep "/blog/" data/all-urls.txt > data/blog-urls.txt
npm run capture -- example --source file --input data/blog-urls.txt
```

### Batch Processing Script
```bash
#!/bin/bash
sites=("example" "docs" "blog")
for site in "${sites[@]}"; do
  npm run crawl -- "$site"
  npm run capture -- "$site" --source file --input data/urls.txt
done
```

### Video Quality Presets
```bash
npm run record -- example --fps 15 --scroll-speed 150  # Low quality, small files
npm run record -- example --fps 30 --scroll-speed 100  # Standard quality
npm run record -- example --fps 60 --scroll-speed 75   # High quality
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Too many URLs | Reduce `--max-depth` or add `excludedPaths` |
| Videos too fast | Reduce `--scroll-speed` (try 50) |
| Missing content | Increase `navigationTimeout` in config |
| FFmpeg not found | Install: `brew install ffmpeg` (macOS) or `apt-get install ffmpeg` (Linux) |
