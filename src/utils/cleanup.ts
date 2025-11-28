import { Browser } from 'puppeteer';
import * as log from './log';

/**
 * Cleanup utilities for graceful shutdown
 */

const cleanupHandlers: Array<() => Promise<void>> = [];
let isCleaningUp = false;

export function registerCleanup(handler: () => Promise<void>): void {
  cleanupHandlers.push(handler);
}

export async function cleanup(): Promise<void> {
  if (isCleaningUp) {
    return;
  }

  isCleaningUp = true;
  log.info('Cleaning up...');

  for (const handler of cleanupHandlers) {
    try {
      await handler();
    } catch (error) {
      log.error('Cleanup error:', error);
    }
  }

  cleanupHandlers.length = 0;
}

export function registerBrowserCleanup(browser: Browser): void {
  registerCleanup(async () => {
    if (browser.connected) {
      await browser.close();
    }
  });
}

export function setupProcessHandlers(): void {
  process.on('SIGINT', async () => {
    log.info('Received SIGINT, shutting down...');
    await cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    log.info('Received SIGTERM, shutting down...');
    await cleanup();
    process.exit(0);
  });

  process.on('uncaughtException', async (error) => {
    log.error('Uncaught exception:', error);
    await cleanup();
    process.exit(1);
  });

  process.on('unhandledRejection', async (reason) => {
    log.error('Unhandled rejection:', reason);
    await cleanup();
    process.exit(1);
  });
}
