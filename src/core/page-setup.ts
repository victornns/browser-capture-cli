import { Page } from 'puppeteer';
import { Viewport } from '../types/config';
import { USER_AGENT, DEFAULT_BROWSER_CONFIG } from '../config/defaults';

/**
 * Page setup and configuration
 */

export async function setupPage(page: Page, viewport?: Viewport): Promise<void> {
  // Set user agent
  await page.setUserAgent(USER_AGENT);

  // Set viewport if provided
  if (viewport) {
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
    });
  }

  // Set timeouts
  page.setDefaultNavigationTimeout(DEFAULT_BROWSER_CONFIG.navigationTimeout);
  page.setDefaultTimeout(DEFAULT_BROWSER_CONFIG.defaultTimeout);

  // Block unnecessary resources for faster loading
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const resourceType = request.resourceType();

    // Allow navigation, document, script, stylesheet, and images
    // Block fonts, media, and other heavy resources
    if (['font', 'media', 'websocket'].includes(resourceType)) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

export async function navigateToPage(page: Page, url: string): Promise<void> {
  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: DEFAULT_BROWSER_CONFIG.navigationTimeout,
  });

  // Wait for any dynamic content
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve());
      }
    });
  });
}

export async function scrollToBottom(page: Page, speed: number = 100): Promise<void> {
  await page.evaluate(async (scrollSpeed) => {
    await new Promise<void>((resolve) => {
      const distance = 100;
      const delay = (distance / scrollSpeed) * 1000;

      const scrollHeight = document.documentElement.scrollHeight;
      let currentPosition = 0;

      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        currentPosition += distance;

        if (currentPosition >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  }, speed);
}

export async function getPageHeight(page: Page): Promise<number> {
  return await page.evaluate(() => {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
  });
}

export async function scrollToTop(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
}
