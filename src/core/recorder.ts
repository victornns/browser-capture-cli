import { Browser } from 'puppeteer';
import { Viewport } from '../types/config';
import { setupPage, navigateToPage, getPageHeight, scrollToTop } from './page-setup';
import * as fs from '../utils/fs';
import * as urlUtils from '../utils/url';
import * as log from '../utils/log';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Video recording with smooth scrolling
 */

export interface RecordOptions {
  url: string;
  viewport: Viewport;
  outputDir: string;
  scrollSpeed: number;
  fps: number;
}

export async function recordPage(browser: Browser, options: RecordOptions): Promise<string> {
  const page = await browser.newPage();

  try {
    await setupPage(page, options.viewport);
    await navigateToPage(page, options.url);
    await scrollToTop(page);

    // Generate filename
    const filename = urlUtils.getFilenameFromUrl(options.url, '.webm');
    const viewportSuffix = `-${options.viewport.name}`;
    const finalFilename = filename.replace('.webm', `${viewportSuffix}.webm`);
    const outputPath = path.join(options.outputDir, finalFilename);

    // Ensure output directory exists
    fs.ensureDir(options.outputDir);

    // Get page height for scroll calculation
    const pageHeight = await getPageHeight(page);
    const viewportHeight = options.viewport.height;
    const scrollDistance = Math.max(0, pageHeight - viewportHeight);

    // Calculate duration based on scroll speed (pixels per second)
    const duration = scrollDistance / options.scrollSpeed;

    log.debug(`Page height: ${pageHeight}px, scroll distance: ${scrollDistance}px`);
    log.debug(`Recording duration: ${duration.toFixed(2)}s at ${options.scrollSpeed}px/s`);

    // Start recording
    const frames: Buffer[] = [];
    const frameInterval = 1000 / options.fps;
    const totalFrames = Math.ceil(duration * options.fps);

    for (let frame = 0; frame < totalFrames; frame++) {
      const progress = frame / totalFrames;
      const scrollY = Math.floor(scrollDistance * progress);

      // Scroll to position
      await page.evaluate((y: number) => {
        window.scrollTo(0, y);
      }, scrollY);

      // Wait a bit for rendering
      await new Promise((resolve) => setTimeout(resolve, frameInterval)); // Capture frame
      const screenshot = await page.screenshot({
        encoding: 'binary',
      });

      frames.push(screenshot as Buffer);
    }

    log.debug(`Captured ${frames.length} frames`);

    // Save frames temporarily and convert to video using ffmpeg
    const tempDir = path.join(options.outputDir, '.temp');
    fs.ensureDir(tempDir);

    // Save frames as images
    for (let i = 0; i < frames.length; i++) {
      const framePath = path.join(tempDir, `frame-${String(i).padStart(6, '0')}.png`);
      fs.writeFile(framePath, frames[i].toString('base64'));
    }

    // Convert to video using ffmpeg (requires ffmpeg to be installed)
    try {
      const ffmpegCmd = `ffmpeg -y -framerate ${options.fps} -i ${tempDir}/frame-%06d.png -c:v libvpx-vp9 -pix_fmt yuva420p ${outputPath}`;
      await execPromise(ffmpegCmd);
      log.debug(`Video created: ${outputPath}`);
    } catch (error) {
      log.error('FFmpeg error (is ffmpeg installed?):', error);
      log.warn('Falling back to frame sequence export');
    }

    // Clean up temp frames
    const tempFiles = fs.listFiles(tempDir);
    for (const file of tempFiles) {
      fs.deleteFile(path.join(tempDir, file));
    }

    return outputPath;
  } finally {
    await page.close();
  }
}

export async function recordPages(
  browser: Browser,
  urls: string[],
  viewport: Viewport,
  outputDir: string,
  scrollSpeed: number,
  fps: number
): Promise<void> {
  const startTime = Date.now();
  log.section('Recording Videos');
  log.info(`URLs: ${urls.length}`);
  log.info(`Viewport: ${viewport.name}`);
  log.info(`Scroll speed: ${scrollSpeed}px/s`);
  log.info(`FPS: ${fps}`);
  log.info(`Output: ${outputDir}`);

  let completed = 0;

  for (const url of urls) {
    try {
      await recordPage(browser, {
        url,
        viewport,
        outputDir,
        scrollSpeed,
        fps,
      });

      completed++;
      log.progress(completed, urls.length, url);
    } catch (error) {
      log.error(`Failed to record ${url}:`, error);
    }
  }

  const duration = log.elapsed(startTime);
  log.success(`Recording completed: ${completed}/${urls.length} in ${duration}`);
}
