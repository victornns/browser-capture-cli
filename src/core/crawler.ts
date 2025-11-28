import { Browser, Page } from 'puppeteer';
import { SiteConfig, CrawlResult } from '../types/config';
import { setupPage, navigateToPage } from './page-setup';
import * as urlUtils from '../utils/url';
import * as log from '../utils/log';

/**
 * Website crawler
 */

export class Crawler {
  private visited: Set<string> = new Set();
  private queue: Array<{ url: string; depth: number }> = [];
  private results: CrawlResult[] = [];

  constructor(
    private browser: Browser,
    private config: SiteConfig
  ) {}

  async crawl(): Promise<CrawlResult[]> {
    const startTime = Date.now();
    log.section(`Crawling ${this.config.name}`);
    log.info(`Base URL: ${this.config.baseUrl}`);
    log.info(`Max depth: ${this.config.maxDepth}`);

    // Start with base URL
    this.queue.push({ url: this.config.baseUrl, depth: 0 });

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) continue;

      const { url, depth } = item;

      // Skip if already visited
      const normalized = urlUtils.normalizeUrl(url);
      if (this.visited.has(normalized)) {
        continue;
      }

      // Skip if max depth exceeded
      if (depth > this.config.maxDepth) {
        continue;
      }

      // Mark as visited
      this.visited.add(normalized);

      try {
        await this.crawlPage(normalized, depth);

        // Respect crawl delay
        if (this.config.crawlDelay > 0) {
          await this.delay(this.config.crawlDelay);
        }
      } catch (error) {
        log.error(`Failed to crawl ${normalized}:`, error);
      }

      log.progress(this.visited.size, this.visited.size + this.queue.length, normalized);
    }

    const duration = log.elapsed(startTime);
    log.success(`Crawl completed: ${this.results.length} pages found in ${duration}`);

    return this.results;
  }

  private async crawlPage(url: string, depth: number): Promise<void> {
    const page = await this.browser.newPage();

    try {
      await setupPage(page);
      await navigateToPage(page, url);

      // Add to results
      this.results.push({
        url,
        depth,
        timestamp: Date.now(),
      });

      // Extract links if not at max depth
      if (depth < this.config.maxDepth) {
        const links = await this.extractLinks(page);

        for (const link of links) {
          if (this.shouldCrawl(link)) {
            this.queue.push({ url: link, depth: depth + 1 });
          }
        }
      }
    } finally {
      await page.close();
    }
  }

  private async extractLinks(page: Page): Promise<string[]> {
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      return anchors.map((a) => (a as HTMLAnchorElement).href);
    });

    return links
      .map((link) => urlUtils.normalizeUrl(link))
      .filter((link) => urlUtils.isValidUrl(link));
  }

  private shouldCrawl(url: string): boolean {
    // Check if same domain
    if (!urlUtils.isSameDomain(url, this.config.baseUrl)) {
      return false;
    }

    // Check if already visited
    if (this.visited.has(url)) {
      return false;
    }

    // Check if allowed path
    if (!urlUtils.isAllowedPath(url, this.config.allowedPaths)) {
      return false;
    }

    // Check if excluded path
    if (urlUtils.isExcludedPath(url, this.config.excludedPaths)) {
      return false;
    }

    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getResults(): CrawlResult[] {
    return this.results;
  }

  getVisitedUrls(): string[] {
    return Array.from(this.visited);
  }
}

export async function crawlSite(browser: Browser, config: SiteConfig): Promise<CrawlResult[]> {
  const crawler = new Crawler(browser, config);
  return await crawler.crawl();
}
