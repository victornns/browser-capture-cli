# Browser Capture CLI - Project Architecture

## Overview

This project implements a complete browser automation CLI tool for crawling websites, capturing screenshots, recording videos, and generating PDFs using TypeScript and Puppeteer.

## Architecture Principles

✅ **Clean & Explicit**: No unnecessary abstractions  
✅ **Type-Safe**: Strict TypeScript with complete type coverage  
✅ **Maintainable**: Clear separation of concerns  
✅ **Modular**: Each module has a single, well-defined responsibility

## Project Structure

```
browser-capture-cli/
├── src/
│   ├── cli/              # Command-line interface implementations
│   │   ├── crawl.ts      # Crawl command: discover URLs
│   │   ├── capture.ts    # Capture command: take screenshots
│   │   ├── record.ts     # Record command: create videos
│   │   └── pdf.ts        # PDF command: generate PDFs
│   │
│   ├── core/             # Core business logic
│   │   ├── browser.ts    # Browser lifecycle management
│   │   ├── page-setup.ts # Page configuration and navigation
│   │   ├── crawler.ts    # Website crawling implementation
│   │   ├── url-source.ts # URL loading and saving
│   │   ├── screenshot.ts # Screenshot capture logic
│   │   ├── recorder.ts   # Video recording logic
│   │   └── pdf.ts        # PDF generation logic
│   │
│   ├── config/           # Configuration management
│   │   ├── sites.ts      # Site definitions
│   │   ├── viewports.ts  # Viewport configurations
│   │   └── defaults.ts   # Default values and constants
│   │
│   ├── types/            # TypeScript type definitions
│   │   └── config.ts     # All interfaces and types
│   │
│   ├── utils/            # Utility functions
│   │   ├── fs.ts         # File system operations
│   │   ├── url.ts        # URL manipulation
│   │   ├── log.ts        # Logging and output
│   │   └── cleanup.ts    # Cleanup and signal handling
│   │
│   └── index.ts          # Main entry point
│
├── dist/                 # Compiled JavaScript (generated)
├── output/               # Generated outputs (created at runtime)
│   ├── screenshots/      # Screenshots
│   ├── videos/          # Recorded videos
│   └── pdfs/            # Generated PDFs
├── data/                # Data files (created at runtime)
│   └── urls.txt         # Crawled URLs
│
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
├── .eslintrc.js        # ESLint configuration
├── .prettierrc.json    # Prettier configuration
├── .gitignore          # Git ignore patterns
├── README.md           # Main documentation
├── QUICKSTART.md       # Quick start guide
└── urls.txt            # Example URLs file
```

## Module Descriptions

### CLI Layer (`src/cli/`)

**Purpose**: Handle command-line arguments and orchestrate core functionality

- **crawl.ts**: Parses crawl command arguments and executes site crawling
- **capture.ts**: Handles screenshot capture with multiple viewport support
- **record.ts**: Manages video recording with smooth scrolling
- **pdf.ts**: Coordinates PDF generation

**Responsibilities**:
- Parse command-line arguments
- Validate user input
- Initialize browser
- Call core modules
- Handle errors and cleanup

### Core Layer (`src/core/`)

**Purpose**: Implement core business logic independent of CLI

- **browser.ts**: Manages Puppeteer browser instance lifecycle
- **page-setup.ts**: Configures pages (viewport, user agent, navigation)
- **crawler.ts**: Implements breadth-first website crawling
- **url-source.ts**: Loads URLs from files or crawl results
- **screenshot.ts**: Captures full-page screenshots
- **recorder.ts**: Records videos with smooth scrolling
- **pdf.ts**: Generates print-style PDFs

**Responsibilities**:
- Core automation logic
- Browser interactions
- Data processing
- No dependency on CLI arguments

### Config Layer (`src/config/`)

**Purpose**: Centralize all configuration

- **sites.ts**: Site definitions (base URL, allowed paths, etc.)
- **viewports.ts**: Viewport configurations (mobile, tablet, desktop, 4K)
- **defaults.ts**: Default values for all operations

**Responsibilities**:
- Configuration management
- Default values
- Site-specific settings

### Types Layer (`src/types/`)

**Purpose**: TypeScript type definitions

- **config.ts**: All interfaces and types for the project

**Responsibilities**:
- Type safety
- Clear contracts between modules
- Documentation through types

### Utils Layer (`src/utils/`)

**Purpose**: Reusable utility functions

- **fs.ts**: File system operations (read, write, ensure dirs)
- **url.ts**: URL manipulation (normalize, validate, extract)
- **log.ts**: Logging utilities (info, success, error, progress)
- **cleanup.ts**: Graceful shutdown and signal handling

**Responsibilities**:
- Common operations
- Cross-cutting concerns
- No business logic

## Data Flow

### 1. Crawl Flow
```
User Input → CLI Parser → Site Config → Browser Launch → 
Crawler → Extract Links → Save URLs → Browser Close
```

### 2. Capture Flow
```
User Input → CLI Parser → Load URLs (crawl or file) → 
Browser Launch → For each URL + Viewport → Navigate → 
Screenshot → Save → Browser Close
```

### 3. Record Flow
```
User Input → CLI Parser → Load URLs → Browser Launch → 
For each URL → Navigate → Calculate Scroll → Capture Frames → 
Convert to Video (FFmpeg) → Browser Close
```

### 4. PDF Flow
```
User Input → CLI Parser → Load URLs → Browser Launch → 
For each URL → Navigate → Generate PDF → Save → Browser Close
```

## Key Design Decisions

### 1. Separation of Concerns
- **CLI**: Argument parsing only
- **Core**: Business logic only
- **Utils**: Generic helpers only

### 2. Explicit Configuration
- No magic values
- All defaults in `defaults.ts`
- Site configs in `sites.ts`

### 3. Type Safety
- Strict TypeScript mode
- Explicit types everywhere
- No `any` types (except for error handling)

### 4. Error Handling
- Graceful degradation
- Continue on individual failures
- Proper cleanup on exit

### 5. Modularity
- Each file has one responsibility
- Functions are small and focused
- Easy to test and maintain

## Extension Points

### Adding New Commands
1. Create new file in `src/cli/`
2. Implement command logic in `src/core/`
3. Add to `src/index.ts`
4. Update `package.json` scripts

### Adding New Sites
Edit `src/config/sites.ts`:
```typescript
mysite: {
  name: 'mysite',
  baseUrl: 'https://example.com',
  maxDepth: 2,
  allowedPaths: ['/'],
  excludedPaths: ['/admin'],
  crawlDelay: 1000,
}
```

### Adding New Viewports
Edit `src/config/viewports.ts`:
```typescript
customViewport: {
  name: 'customViewport',
  width: 1440,
  height: 900,
}
```

### Adding New Utilities
Create new file in `src/utils/` following the same pattern.

## Dependencies

### Production
- **puppeteer**: Browser automation (Chromium control)

### Development
- **typescript**: Type safety and compilation
- **@types/node**: Node.js type definitions
- **eslint**: Code linting
- **prettier**: Code formatting
- **ts-node**: TypeScript execution for development

### External (Optional)
- **ffmpeg**: Required for video recording only

## Build & Development

```bash
# Development (watch mode)
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## Output Structure

```
output/
├── screenshots/
│   ├── index-desktop.png
│   ├── index-mobile.png
│   ├── about-desktop.png
│   └── about-mobile.png
│
├── videos/
│   ├── index-desktop.webm
│   └── about-desktop.webm
│
└── pdfs/
    ├── index.pdf
    └── about.pdf

data/
└── urls.txt              # Crawled URLs
```

## Performance Considerations

1. **Parallel Processing**: Could be added for multiple URLs
2. **Resource Blocking**: Already blocks fonts, media, websockets
3. **Crawl Delay**: Configurable per site to respect rate limits
4. **Browser Reuse**: Single browser instance reused across pages

## Future Enhancements

- [ ] Parallel URL processing
- [ ] Authentication support (login flows)
- [ ] Custom JavaScript injection
- [ ] Sitemap.xml support
- [ ] Custom screenshot regions
- [ ] Video with interactions
- [ ] Before/after comparisons
- [ ] CI/CD integration

## Testing Strategy

While not yet implemented, recommended structure:

```
tests/
├── unit/              # Unit tests for individual modules
├── integration/       # Integration tests for workflows
└── fixtures/          # Test data and mock sites
```

## Conclusion

This architecture provides:
- **Maintainability**: Clear structure, easy to navigate
- **Extensibility**: Easy to add new features
- **Type Safety**: Compile-time error detection
- **Clarity**: No hidden complexity or magic
- **Professionalism**: Production-ready code structure

The project follows best practices for TypeScript CLI applications and serves as a solid foundation for browser automation tasks.
