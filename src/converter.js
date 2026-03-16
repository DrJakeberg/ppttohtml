import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { getPaths } from './config.js';

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.ppt', '.pptx']);

export function validateUpload(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error('Nur PDF, PPT und PPTX sind erlaubt.');
  }

  return extension;
}

export async function convertToPdf(inputPath, outputBaseName) {
  const extension = path.extname(inputPath).toLowerCase();
  const { CONVERTED_DIR } = getPaths();

  if (extension === '.pdf') {
    const target = path.join(CONVERTED_DIR, `${outputBaseName}.pdf`);
    fs.copyFileSync(inputPath, target);
    return target;
  }

  const outputPath = path.join(CONVERTED_DIR, `${outputBaseName}.pdf`);

  await runSoffice(inputPath, CONVERTED_DIR);

  const originalPdfPath = path.join(
    CONVERTED_DIR,
    `${path.basename(inputPath, path.extname(inputPath))}.pdf`
  );

  if (!fs.existsSync(originalPdfPath)) {
    throw new Error('Konvertierung fehlgeschlagen: PDF wurde nicht erzeugt.');
  }

  fs.renameSync(originalPdfPath, outputPath);
  return outputPath;
}

function runSoffice(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    const command = 'soffice';
    const args = [
      '--headless',
      '--nologo',
      '--nolockcheck',
      '--convert-to',
      'pdf',
      '--outdir',
      outputDir,
      inputPath
    ];

    const process = spawn(command, args);
    let stderr = '';

    process.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    process.on('error', (error) => {
      reject(new Error(`Konvertierung nicht möglich: ${error.message}`));
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Konvertierung fehlgeschlagen (${code}): ${stderr}`));
      }
    });
  });
}
