import { Browser } from 'puppeteer';
import { setupPage, navigateToPage } from './page-setup';
import * as fs from '../utils/fs';
import * as urlUtils from '../utils/url';
import * as log from '../utils/log';
import * as path from 'path';

/**
 * PDF generation with print-style rendering
 */

export interface PdfOptions {
  url: string;
  outputDir: string;
}

export async function generatePdf(browser: Browser, options: PdfOptions): Promise<string> {
  const page = await browser.newPage();

  try {
    await setupPage(page);
    await navigateToPage(page, options.url);

    // Generate filename
    const filename = urlUtils.getFilenameFromUrl(options.url, '.pdf');
    const outputPath = path.join(options.outputDir, filename);

    // Ensure output directory exists
    fs.ensureDir(options.outputDir);

    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    log.debug(`PDF saved: ${outputPath}`);

    return outputPath;
  } finally {
    await page.close();
  }
}

export async function generatePdfs(
  browser: Browser,
  urls: string[],
  outputDir: string
): Promise<void> {
  const startTime = Date.now();
  log.section('Generating PDFs');
  log.info(`URLs: ${urls.length}`);
  log.info(`Output: ${outputDir}`);

  let completed = 0;

  for (const url of urls) {
    try {
      await generatePdf(browser, {
        url,
        outputDir,
      });

      completed++;
      log.progress(completed, urls.length, url);
    } catch (error) {
      log.error(`Failed to generate PDF for ${url}:`, error);
    }
  }

  const duration = log.elapsed(startTime);
  log.success(`PDF generation completed: ${completed}/${urls.length} in ${duration}`);
}
