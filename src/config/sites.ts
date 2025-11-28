import { SiteConfig } from '../types/config';

/**
 * Site configurations for crawling
 */
export const SITES: Record<string, SiteConfig> = {
  example: {
    name: 'example',
    baseUrl: 'https://vpl-website.vercel.app/',
    maxDepth: 2,
    allowedPaths: ['/'],
    excludedPaths: ['/admin', '/login'],
    crawlDelay: 1000,
  },
};

export function getSiteConfig(name: string): SiteConfig {
  const site = SITES[name];
  if (!site) {
    throw new Error(`Unknown site: ${name}. Available: ${Object.keys(SITES).join(', ')}`);
  }
  return site;
}

export function listSites(): string[] {
  return Object.keys(SITES);
}
