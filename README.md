# Browser Capture CLI

Automated website crawling, screenshot capture, video recording, and PDF generation using **TypeScript + Puppeteer**.

## Features

- **Crawling**: Automatically discover all pages on a website
- **Screenshots**: Capture full-page screenshots in multiple viewports (mobile, tablet, desktop, 4K)
- **Video Recording**: Record smooth-scrolling videos of entire pages
- **PDF Generation**: Create print-style PDFs with clickable links

## Installation

```bash
npm install
npm run build
```

## Usage

### Commands

```bash
# Crawl a website
npm run crawl -- example --max-depth 2

# Capture screenshots
npm run capture -- example --viewports desktop,mobile

# Record videos (requires ffmpeg)
npm run record -- example --viewport desktop --scroll-speed 100

# Generate PDFs
npm run pdf -- example
```

### Using URL Files

```bash
# Save URLs from crawling
npm run crawl -- example --output data/urls.txt

# Use saved URLs
npm run capture -- example --source file --input data/urls.txt
```

## Configuration

Edit `src/config/sites.ts` to add new sites:

```typescript
export const SITES: Record<string, SiteConfig> = {
  mysite: {
    name: 'mysite',
    baseUrl: 'https://example.com',
    maxDepth: 2,
    allowedPaths: ['/'],
    excludedPaths: ['/admin'],
    crawlDelay: 1000,
  },
};
```

## Requirements

- **Node.js**: >= 18.0.0
- **FFmpeg**: Required for video recording

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg
```

## Project Structure

```
src/
  cli/          # CLI commands
  core/         # Core logic (browser, crawler, capture)
  config/       # Site and viewport configs
  types/        # TypeScript definitions
  utils/        # Utilities
```

## License

MIT
