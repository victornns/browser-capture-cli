import * as fs from 'fs';
import * as path from 'path';

/**
 * File system utilities
 */

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.writeFileSync(filePath, content, 'utf-8');
}

export function readFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

export function readLines(filePath: string): string[] {
  const content = readFile(filePath);
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

export function appendFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.appendFileSync(filePath, content, 'utf-8');
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function deleteFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function listFiles(dirPath: string, extension?: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath);

  if (extension) {
    return files.filter((file) => file.endsWith(extension));
  }

  return files;
}

export function getFileSize(filePath: string): number {
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  const stats = fs.statSync(filePath);
  return stats.size;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
