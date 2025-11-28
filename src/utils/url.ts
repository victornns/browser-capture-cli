/**
 * URL manipulation utilities
 */

export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove trailing slash
    if (parsed.pathname.endsWith('/') && parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    // Remove hash
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url;
  }
}

export function isSameDomain(url1: string, url2: string): boolean {
  try {
    const parsed1 = new URL(url1);
    const parsed2 = new URL(url2);
    return parsed1.hostname === parsed2.hostname;
  } catch {
    return false;
  }
}

export function isAllowedPath(url: string, allowedPaths: string[]): boolean {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;

    if (allowedPaths.length === 0) {
      return true;
    }

    return allowedPaths.some((allowed) => pathname.startsWith(allowed));
  } catch {
    return false;
  }
}

export function isExcludedPath(url: string, excludedPaths: string[]): boolean {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;

    return excludedPaths.some((excluded) => pathname.startsWith(excluded));
  } catch {
    return false;
  }
}

export function getPathSegments(url: string): string[] {
  try {
    const parsed = new URL(url);
    return parsed.pathname.split('/').filter((seg) => seg.length > 0);
  } catch {
    return [];
  }
}

export function getFilenameFromUrl(url: string, extension: string = ''): string {
  try {
    const parsed = new URL(url);
    let pathname = parsed.pathname;

    // Remove leading slash
    if (pathname.startsWith('/')) {
      pathname = pathname.slice(1);
    }

    // Replace slashes with dashes
    let filename = pathname.replace(/\//g, '-');

    // If empty, use 'index'
    if (filename === '' || filename === '-') {
      filename = 'index';
    }

    // Add extension if provided
    if (extension && !filename.endsWith(extension)) {
      filename += extension;
    }

    return filename;
  } catch {
    return 'unknown' + extension;
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function resolveUrl(baseUrl: string, relativeUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).toString();
  } catch {
    return relativeUrl;
  }
}

export function getDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return '';
  }
}
