# 📐 Browser Capture CLI

Automated website crawling, screenshot capture, video recording, and PDF generation using **TypeScript + Puppeteer**.

## 🚀 Features

- **Crawling**: Automatically discover all pages on a website
- **Screenshots**: Capture full-page screenshots in multiple viewports (mobile, tablet, desktop, 4K)
- **Video Recording**: Record smooth-scrolling videos of entire pages
- **PDF Generation**: Create print-style PDFs with clickable links
- **TypeScript**: Fully typed with strict mode enabled
- **Clean Architecture**: Well-organized, maintainable code structure

## 📦 Installation

```bash
# Clone or download the project
cd browser-capture-cli

# Install dependencies
npm install

# Build the project
npm run build
```

## 🛠️ Usage

### Command Line Interface

The CLI provides four main commands:

#### 1. Crawl a Website

Discover all pages on a website and save URLs to a file.

```bash
npm run crawl -- example --max-depth 2 --output data/urls.txt
```

Options:
- `--max-depth <number>`: Maximum crawl depth (default: from site config)
- `--output <file>`: Output file path (default: `data/urls.txt`)

#### 2. Capture Screenshots

Take full-page screenshots in multiple viewports.

```bash
# Crawl and capture
npm run capture -- example --viewports desktop,mobile,tablet

# Use existing URL list
npm run capture -- example --source file --input data/urls.txt --viewports desktop
```

Options:
- `--source <crawl|file>`: URL source (default: `crawl`)
- `--input <file>`: Input file when source is `file`
- `--viewports <list>`: Comma-separated viewport names (default: `desktop`)
- `--output <dir>`: Output directory (default: `output/screenshots`)

Available viewports: `mobile` (375x667), `tablet` (768x1024), `desktop` (1920x1080), `4k` (3840x2160)

#### 3. Record Videos

Record smooth-scrolling videos of pages.

```bash
# Crawl and record
npm run record -- example --viewport desktop --scroll-speed 100 --fps 30

# Use existing URL list
npm run record -- example --source file --input data/urls.txt
```

Options:
- `--source <crawl|file>`: URL source (default: `crawl`)
- `--input <file>`: Input file when source is `file`
- `--viewport <name>`: Viewport name (default: `desktop`)
- `--scroll-speed <px/s>`: Scroll speed in pixels per second (default: `100`)
- `--fps <number>`: Frames per second (default: `30`)
- `--output <dir>`: Output directory (default: `output/videos`)

**Note**: Video recording requires `ffmpeg` to be installed on your system.

#### 4. Generate PDFs

Create print-style PDFs of pages.

```bash
# Crawl and generate PDFs
npm run pdf -- example

# Use existing URL list
npm run pdf -- example --source file --input data/urls.txt --output output/pdfs
```

Options:
- `--source <crawl|file>`: URL source (default: `crawl`)
- `--input <file>`: Input file when source is `file`
- `--output <dir>`: Output directory (default: `output/pdfs`)

### Help

```bash
npm run crawl -- --help
npm run capture -- --help
npm run record -- --help
npm run pdf -- --help
```

## ⚙️ Configuration

### Adding a New Site

Edit `src/config/sites.ts`:

```typescript
export const SITES: Record<string, SiteConfig> = {
  mysite: {
    name: 'mysite',
    baseUrl: 'https://example.com',
    maxDepth: 2,
    allowedPaths: ['/'],
    excludedPaths: ['/admin', '/login'],
    crawlDelay: 1000, // milliseconds between requests
  },
};
```

### Custom Viewports

Edit `src/config/viewports.ts`:

```typescript
export const VIEWPORTS: Record<string, Viewport> = {
  custom: {
    name: 'custom',
    width: 1440,
    height: 900,
  },
};
```

### Default Settings

Edit `src/config/defaults.ts` to change default output directories, scroll speed, FPS, etc.

## 📁 Project Structure

```
src/
  cli/              # CLI command implementations
    crawl.ts        # Crawl command
    capture.ts      # Screenshot command
    record.ts       # Video recording command
    pdf.ts          # PDF generation command

  core/             # Core business logic
    browser.ts      # Browser instance management
    page-setup.ts   # Page configuration and navigation
    crawler.ts      # Website crawling logic
    url-source.ts   # URL loading/saving
    screenshot.ts   # Screenshot capture
    recorder.ts     # Video recording
    pdf.ts          # PDF generation

  config/           # Configuration files
    sites.ts        # Site definitions
    viewports.ts    # Viewport definitions
    defaults.ts     # Default values

  types/            # TypeScript type definitions
    config.ts       # All type definitions

  utils/            # Utility functions
    fs.ts           # File system operations
    url.ts          # URL manipulation
    log.ts          # Logging utilities
    cleanup.ts      # Cleanup and signal handling

  index.ts          # Main entry point
```

## 🔧 Development

```bash
# Watch mode (auto-compile on changes)
npm run dev

# Build
npm run build

# Lint
npm run lint

# Format
npm run format

# Clean build artifacts
npm run clean
```

## 📋 Requirements

- **Node.js**: >= 18.0.0
- **FFmpeg**: Required for video recording (optional for other features)

### Installing FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

## 🎯 Use Cases

1. **Documentation**: Capture screenshots of your application in different viewports
2. **Testing**: Visual regression testing by comparing screenshots
3. **Archiving**: Create PDFs of web pages for offline access
4. **Demos**: Record videos showing page interactions
5. **Site Audits**: Crawl and capture entire websites for review

## 🧪 Example Workflow

```bash
# 1. Crawl a website
npm run crawl -- example --max-depth 3 --output data/example-urls.txt

# 2. Capture screenshots in multiple viewports
npm run capture -- example --source file --input data/example-urls.txt --viewports desktop,mobile

# 3. Record videos for key pages (edit urls.txt to select specific pages)
npm run record -- example --source file --input data/key-pages.txt --scroll-speed 150

# 4. Generate PDFs for documentation
npm run pdf -- example --source file --input data/example-urls.txt
```

## 📝 URL File Format

The `urls.txt` file should contain one URL per line:

```
https://example.com/
https://example.com/about
https://example.com/products
# Comments are supported (lines starting with #)
https://example.com/contact
```

## 🐛 Troubleshooting

**Browser fails to launch:**
- Make sure you have sufficient permissions
- On Linux, you may need additional dependencies: `sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget`

**Video recording fails:**
- Ensure FFmpeg is installed: `ffmpeg -version`
- Check that the output directory is writable

**TypeScript errors:**
- Run `npm install` to ensure all dependencies are installed
- Run `npm run build` to check for compilation errors

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! This project follows a clean, explicit architecture:

- No unnecessary abstractions
- Explicit over implicit
- Type-safe with strict TypeScript
- Clear separation of concerns

## 🔮 Future Enhancements

- [ ] Parallel processing for faster execution
- [ ] Custom JavaScript injection before capture
- [ ] Authentication support (login flows)
- [ ] Sitemap.xml support
- [ ] Custom screenshot regions
- [ ] Video with interactions (clicks, scrolls, etc.)
- [ ] Comparison mode (before/after screenshots)
- [ ] CI/CD integration examples
