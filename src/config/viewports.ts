import { Viewport } from '../types/config';

/**
 * Standard viewport configurations
 */
export const VIEWPORTS: Record<string, Viewport> = {
  mobile: {
    name: 'mobile',
    width: 375,
    height: 667,
  },
  tablet: {
    name: 'tablet',
    width: 768,
    height: 1024,
  },
  desktop: {
    name: 'desktop',
    width: 1920,
    height: 1080,
  },
  '4k': {
    name: '4k',
    width: 3840,
    height: 2160,
  },
};

export const DEFAULT_VIEWPORT = VIEWPORTS.desktop;

export function getViewport(name: string): Viewport {
  const viewport = VIEWPORTS[name];
  if (!viewport) {
    throw new Error(`Unknown viewport: ${name}. Available: ${Object.keys(VIEWPORTS).join(', ')}`);
  }
  return viewport;
}

export function getViewports(names: string[]): Viewport[] {
  return names.map(getViewport);
}
