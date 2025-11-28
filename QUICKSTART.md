# Browser Capture CLI - Quick Start

## Installation

```bash
npm install
npm run build
```

## Quick Examples

### 1. Crawl a Website
```bash
npm run crawl -- example --max-depth 2
```

### 2. Capture Screenshots
```bash
# From crawl results
npm run capture -- example --viewports desktop,mobile

# From file
npm run capture -- example --source file --input urls.txt --viewports desktop
```

### 3. Record Videos
```bash
npm run record -- example --viewport desktop --scroll-speed 100 --fps 30
```

### 4. Generate PDFs
```bash
npm run pdf -- example --source file --input urls.txt
```

## Configuration

1. Add your site to `src/config/sites.ts`:
```typescript
mysite: {
  name: 'mysite',
  baseUrl: 'https://your-site.com',
  maxDepth: 2,
  allowedPaths: ['/'],
  excludedPaths: ['/admin'],
  crawlDelay: 1000,
}
```

2. Run commands with your site name:
```bash
npm run crawl -- mysite
```

## Output

- Screenshots: `output/screenshots/`
- Videos: `output/videos/`
- PDFs: `output/pdfs/`
- Crawl results: `data/urls.txt`
