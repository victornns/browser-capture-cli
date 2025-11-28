import { BrowserConfig } from '../types/config';

/**
 * Default configuration values
 */
export const DEFAULT_BROWSER_CONFIG: BrowserConfig = {
  headless: true,
  defaultTimeout: 30000,
  navigationTimeout: 60000,
};

export const DEFAULT_CRAWL_OUTPUT = 'data/urls.txt';
export const DEFAULT_SCREENSHOT_OUTPUT = 'output/screenshots';
export const DEFAULT_VIDEO_OUTPUT = 'output/videos';
export const DEFAULT_PDF_OUTPUT = 'output/pdfs';

export const DEFAULT_SCROLL_SPEED = 100; // pixels per second
export const DEFAULT_FPS = 30;

export const DEFAULT_VIEWPORTS = ['desktop'];

export const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
