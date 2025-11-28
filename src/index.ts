#!/usr/bin/env node

/**
 * Browser Capture CLI
 * Main entry point
 */

import { crawlCommand } from './cli/crawl';
import { captureCommand } from './cli/capture';
import { recordCommand } from './cli/record';
import { pdfCommand } from './cli/pdf';
import { listSites } from './config/sites';
import { VIEWPORTS } from './config/viewports';

const COMMANDS = ['crawl', 'capture', 'record', 'pdf', 'help'];

function showHelp(): void {
  console.log(`
Browser Capture CLI
===================

Usage: browser-capture <command> [options]

Commands:
  crawl <site>           Crawl a website and save discovered URLs
  capture <site>         Capture screenshots in multiple viewports
  record <site>          Record full-page videos with smooth scrolling
  pdf <site>             Generate print-style PDFs
  help                   Show this help message

Available Sites:
  ${listSites().join(', ')}

Available Viewports:
  ${Object.keys(VIEWPORTS).join(', ')}

Examples:
  browser-capture crawl example --max-depth 2
  browser-capture capture example --viewports desktop,mobile
  browser-capture record example --viewport desktop --scroll-speed 100
  browser-capture pdf example --source file --input data/urls.txt

For more information on a specific command:
  browser-capture <command> --help
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];

  if (command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  if (!COMMANDS.includes(command)) {
    console.error(`Unknown command: ${command}`);
    console.error('Run "browser-capture help" for usage information.');
    process.exit(1);
  }

  // Execute the appropriate command
  // The individual command files will handle their own argument parsing
  switch (command) {
    case 'crawl':
      await import('./cli/crawl');
      break;
    case 'capture':
      await import('./cli/capture');
      break;
    case 'record':
      await import('./cli/record');
      break;
    case 'pdf':
      await import('./cli/pdf');
      break;
  }
}

// Run the CLI if this is the main module
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Export for programmatic use
export { crawlCommand, captureCommand, recordCommand, pdfCommand };
