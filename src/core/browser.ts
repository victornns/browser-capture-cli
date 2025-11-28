import puppeteer, { Browser, PuppeteerLaunchOptions } from 'puppeteer';
import { BrowserConfig } from '../types/config';
import { DEFAULT_BROWSER_CONFIG } from '../config/defaults';
import * as log from '../utils/log';

/**
 * Browser instance management
 */

let browserInstance: Browser | null = null;

export async function launchBrowser(config: Partial<BrowserConfig> = {}): Promise<Browser> {
  const finalConfig: BrowserConfig = {
    ...DEFAULT_BROWSER_CONFIG,
    ...config,
  };

  log.info('Launching browser...');

  const options: PuppeteerLaunchOptions = {
    headless: finalConfig.headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  };

  const browser = await puppeteer.launch(options);
  browserInstance = browser;

  log.success('Browser launched');
  return browser;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance && browserInstance.connected) {
    log.info('Closing browser...');
    await browserInstance.close();
    browserInstance = null;
    log.success('Browser closed');
  }
}

export function getBrowser(): Browser | null {
  return browserInstance;
}
