#!/usr/bin/env node

import { launchBrowser, closeBrowser } from '../core/browser';
import { crawlSite } from '../core/crawler';
import { saveCrawlResults } from '../core/url-source';
import { getSiteConfig } from '../config/sites';
import { DEFAULT_CRAWL_OUTPUT } from '../config/defaults';
import { CrawlOptions } from '../types/config';
import * as log from '../utils/log';
import * as cleanup from '../utils/cleanup';

/**
 * CLI command: crawl
 * Crawl a website and save discovered URLs
 */

export async function crawlCommand(options: CrawlOptions): Promise<void> {
  cleanup.setupProcessHandlers();

  try {
    // Get site configuration
    const siteConfig = getSiteConfig(options.site);

    // Override max depth if provided
    if (options.maxDepth !== undefined) {
      siteConfig.maxDepth = options.maxDepth;
    }

    // Determine output file
    const outputFile = options.output || DEFAULT_CRAWL_OUTPUT;

    // Launch browser
    const browser = await launchBrowser();
    cleanup.registerBrowserCleanup(browser);

    // Crawl site
    const results = await crawlSite(browser, siteConfig);

    // Save results
    await saveCrawlResults(results, outputFile);
    log.success(`URLs saved to: ${outputFile}`);

    // Close browser
    await closeBrowser();
  } catch (error) {
    log.error('Crawl failed:', error);
    process.exit(1);
  }
}

// Main execution if run directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: crawl <site> [--max-depth <depth>] [--output <file>]');
    console.log('');
    console.log('Example: crawl example --max-depth 2 --output data/urls.txt');
    process.exit(1);
  }

  const options: CrawlOptions = {
    site: args[0],
  };

  // Parse additional arguments
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--max-depth' && args[i + 1]) {
      options.maxDepth = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    }
  }

  crawlCommand(options);
}
