/**
 * Logging utilities
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  SUCCESS = 2,
  WARN = 3,
  ERROR = 4,
}

let currentLogLevel = LogLevel.INFO;

export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

function shouldLog(level: LogLevel): boolean {
  return level >= currentLogLevel;
}

export function debug(message: string, ...args: unknown[]): void {
  if (shouldLog(LogLevel.DEBUG)) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
}

export function info(message: string, ...args: unknown[]): void {
  if (shouldLog(LogLevel.INFO)) {
    console.log(`[INFO] ${message}`, ...args);
  }
}

export function success(message: string, ...args: unknown[]): void {
  if (shouldLog(LogLevel.SUCCESS)) {
    console.log(`[SUCCESS] ✓ ${message}`, ...args);
  }
}

export function warn(message: string, ...args: unknown[]): void {
  if (shouldLog(LogLevel.WARN)) {
    console.warn(`[WARN] ${message}`, ...args);
  }
}

export function error(message: string, ...args: unknown[]): void {
  if (shouldLog(LogLevel.ERROR)) {
    console.error(`[ERROR] ${message}`, ...args);
  }
}

export function section(title: string): void {
  if (shouldLog(LogLevel.INFO)) {
    console.log('');
    console.log('='.repeat(60));
    console.log(`  ${title}`);
    console.log('='.repeat(60));
  }
}

export function progress(current: number, total: number, item: string): void {
  if (shouldLog(LogLevel.INFO)) {
    const percentage = Math.round((current / total) * 100);
    console.log(`[${current}/${total}] (${percentage}%) ${item}`);
  }
}

export function elapsed(startTime: number): string {
  const duration = Date.now() - startTime;
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);

  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function time(message: string): () => void {
  const startTime = Date.now();
  info(message);

  return () => {
    const duration = elapsed(startTime);
    success(`${message} (completed in ${duration})`);
  };
}
