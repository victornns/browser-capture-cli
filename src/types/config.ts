/**
 * Core type definitions for the browser capture CLI
 */

export interface Viewport {
  name: string;
  width: number;
  height: number;
}

export interface SiteConfig {
  name: string;
  baseUrl: string;
  maxDepth: number;
  allowedPaths: string[];
  excludedPaths: string[];
  crawlDelay: number;
}

export interface CrawlOptions {
  site: string;
  maxDepth?: number;
  output?: string;
}

export interface CaptureOptions {
  site: string;
  source: 'crawl' | 'file';
  inputFile?: string;
  viewports?: string[];
  output?: string;
}

export interface RecordOptions {
  site: string;
  source: 'crawl' | 'file';
  inputFile?: string;
  viewport?: string;
  output?: string;
  scrollSpeed?: number;
  fps?: number;
}

export interface PdfOptions {
  site: string;
  source: 'crawl' | 'file';
  inputFile?: string;
  output?: string;
}

export interface BrowserConfig {
  headless: boolean;
  defaultTimeout: number;
  navigationTimeout: number;
}

export interface CrawlResult {
  url: string;
  depth: number;
  timestamp: number;
}
