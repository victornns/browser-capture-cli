import { Browser } from 'puppeteer';
import { Viewport } from '../types/config';
import { setupPage, navigateToPage } from './page-setup';
import * as fs from '../utils/fs';
import * as urlUtils from '../utils/url';
import * as log from '../utils/log';
import * as path from 'path';

/**
 * Screenshot capture
 */

export interface ScreenshotOptions {
  url: string;
  viewport: Viewport;
  outputDir: string;
}

export async function captureScreenshot(
  browser: Browser,
  options: ScreenshotOptions
): Promise<string> {
  const page = await browser.newPage();

  try {
    await setupPage(page, options.viewport);
    await navigateToPage(page, options.url);

    // Generate filename
    const filename = urlUtils.getFilenameFromUrl(options.url, '.png');
    const viewportSuffix = `-${options.viewport.name}`;
    const finalFilename = filename.replace('.png', `${viewportSuffix}.png`);
    const outputPath = path.join(options.outputDir, finalFilename);

    // Ensure output directory exists
    fs.ensureDir(options.outputDir);

    // Capture screenshot
    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });

    log.debug(`Screenshot saved: ${outputPath}`);

    return outputPath;
  } finally {
    await page.close();
  }
}

export async function captureScreenshots(
  browser: Browser,
  urls: string[],
  viewports: Viewport[],
  outputDir: string
): Promise<void> {
  const startTime = Date.now();
  log.section('Capturing Screenshots');
  log.info(`URLs: ${urls.length}`);
  log.info(`Viewports: ${viewports.map((v) => v.name).join(', ')}`);
  log.info(`Output: ${outputDir}`);

  let completed = 0;
  const total = urls.length * viewports.length;

  for (const url of urls) {
    for (const viewport of viewports) {
      try {
        await captureScreenshot(browser, {
          url,
          viewport,
          outputDir,
        });

        completed++;
        log.progress(completed, total, `${url} (${viewport.name})`);
      } catch (error) {
        log.error(`Failed to capture ${url} (${viewport.name}):`, error);
      }
    }
  }

  const duration = log.elapsed(startTime);
  log.success(`Screenshots completed: ${completed}/${total} in ${duration}`);
}
