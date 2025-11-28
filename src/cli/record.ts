#!/usr/bin/env node

import { launchBrowser, closeBrowser } from '../core/browser';
import { crawlSite } from '../core/crawler';
import { loadUrlsFromFile, saveCrawlResults } from '../core/url-source';
import { recordPages } from '../core/recorder';
import { getSiteConfig } from '../config/sites';
import { getViewport, DEFAULT_VIEWPORT } from '../config/viewports';
import {
  DEFAULT_VIDEO_OUTPUT,
  DEFAULT_CRAWL_OUTPUT,
  DEFAULT_SCROLL_SPEED,
  DEFAULT_FPS,
} from '../config/defaults';
import { RecordOptions } from '../types/config';
import * as log from '../utils/log';
import * as cleanup from '../utils/cleanup';

/**
 * CLI command: record
 * Record full-page videos with smooth scrolling
 */

export async function recordCommand(options: RecordOptions): Promise<void> {
  cleanup.setupProcessHandlers();

  try {
    // Get site configuration
    const siteConfig = getSiteConfig(options.site);

    // Determine output directory
    const outputDir = options.output || DEFAULT_VIDEO_OUTPUT;

    // Get viewport
    const viewportName = options.viewport || DEFAULT_VIEWPORT.name;
    const viewport = getViewport(viewportName);

    // Get scroll speed and fps
    const scrollSpeed = options.scrollSpeed || DEFAULT_SCROLL_SPEED;
    const fps = options.fps || DEFAULT_FPS;

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
      log.warn('No URLs to record');
      return;
    }

    // Record videos
    await recordPages(browser, urls, viewport, outputDir, scrollSpeed, fps);

    // Close browser
    await closeBrowser();
  } catch (error) {
    log.error('Record failed:', error);
    process.exit(1);
  }
}

// Main execution if run directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      'Usage: record <site> [--source crawl|file] [--input <file>] [--viewport <viewport>] [--scroll-speed <px/s>] [--fps <fps>] [--output <dir>]'
    );
    console.log('');
    console.log(
      'Example: record example --source file --input data/urls.txt --viewport desktop --scroll-speed 100 --fps 30'
    );
    process.exit(1);
  }

  const options: RecordOptions = {
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
    } else if (args[i] === '--viewport' && args[i + 1]) {
      options.viewport = args[i + 1];
      i++;
    } else if (args[i] === '--scroll-speed' && args[i + 1]) {
      options.scrollSpeed = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--fps' && args[i + 1]) {
      options.fps = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    }
  }

  recordCommand(options);
}
