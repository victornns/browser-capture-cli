import { CrawlResult } from '../types/config';
import * as fs from '../utils/fs';

/**
 * URL source management (from crawl results or file)
 */

export async function loadUrlsFromCrawl(crawlResults: CrawlResult[]): Promise<string[]> {
  return crawlResults.map((result) => result.url);
}

export async function loadUrlsFromFile(filePath: string): Promise<string[]> {
  const urls = fs.readLines(filePath);
  return urls;
}

export async function saveUrlsToFile(urls: string[], filePath: string): Promise<void> {
  const content = urls.join('\n') + '\n';
  fs.writeFile(filePath, content);
}

export async function saveCrawlResults(results: CrawlResult[], filePath: string): Promise<void> {
  const urls = results.map((r) => r.url);
  await saveUrlsToFile(urls, filePath);
}
