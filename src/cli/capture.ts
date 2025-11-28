#!/usr/bin/env node

import { launchBrowser, closeBrowser } from '../core/browser';
import { crawlSite } from '../core/crawler';
import { loadUrlsFromFile, saveCrawlResults } from '../core/url-source';
import { captureScreenshots } from '../core/screenshot';
import { getSiteConfig } from '../config/sites';
import { getViewports, DEFAULT_VIEWPORT } from '../config/viewports';
import { DEFAULT_SCREENSHOT_OUTPUT, DEFAULT_CRAWL_OUTPUT } from '../config/defaults';
import { CaptureOptions } from '../types/config';
import * as log from '../utils/log';
import * as cleanup from '../utils/cleanup';

/**
 * CLI command: capture
 * Capture screenshots of pages in multiple viewports
 */

export async function captureCommand(options: CaptureOptions): Promise<void> {
  cleanup.setupProcessHandlers();

  try {
    // Get site configuration
    const siteConfig = getSiteConfig(options.site);

    // Determine output directory
    const outputDir = options.output || DEFAULT_SCREENSHOT_OUTPUT;

    // Get viewports
    const viewportNames = options.viewports || [DEFAULT_VIEWPORT.name];
    const viewports = getViewports(viewportNames);

    // Launch browser
    const browser = await launchBrowser();
    cleanup.registerBrowserCleanup(browser);

    // Get URLs
    let urls: string[];

    if (options.source === 'file') {
      if (!options.inputFile) {
        throw new Error('Input file required when source is "file"');
      }
      urls = await loadUrlsFromFile(options.inputFile);
    } else {
      // Crawl to get URLs
      const results = await crawlSite(browser, siteConfig);
      urls = results.map((r) => r.url);

      // Save crawl results if needed
      await saveCrawlResults(results, DEFAULT_CRAWL_OUTPUT);
    }

    if (urls.length === 0) {
      log.warn('No URLs to capture');
      return;
    }

    // Capture screenshots
    await captureScreenshots(browser, urls, viewports, outputDir);

    // Close browser
    await closeBrowser();
  } catch (error) {
    log.error('Capture failed:', error);
    process.exit(1);
  }
}

// Main execution if run directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      'Usage: capture <site> [--source crawl|file] [--input <file>] [--viewports <viewport1,viewport2>] [--output <dir>]'
    );
    console.log('');
    console.log(
      'Example: capture example --source file --input data/urls.txt --viewports desktop,mobile'
    );
    process.exit(1);
  }

  const options: CaptureOptions = {
    site: args[0],
    source: 'crawl',
  };

  // Parse additional arguments
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--source' && args[i + 1]) {
      options.source = args[i + 1] as 'crawl' | 'file';
      i++;
    } else if (args[i] === '--input' && args[i + 1]) {
      options.inputFile = args[i + 1];
      i++;
    } else if (args[i] === '--viewports' && args[i + 1]) {
      options.viewports = args[i + 1].split(',');
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    }
  }

  captureCommand(options);
}
