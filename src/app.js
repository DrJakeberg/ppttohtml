import express from 'express';
import helmet from 'helmet';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { convertToPdf, validateUpload } from './converter.js';
import {
  ensureDirectories,
  getAdminToken,
  getPaths,
  readState,
  writeState
} from './config.js';

ensureDirectories();

const { UPLOAD_DIR } = getPaths();

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, callback) => callback(null, UPLOAD_DIR),
    filename: (_, file, callback) => {
      const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      callback(null, safeName);
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 200
  }
});

function requireAdminToken(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  const expected = getAdminToken();

  if (token !== expected) {
    return res.status(401).json({ error: 'Ungültiger Admin-Token.' });
  }

  return next();
}

function parseSettingsInput(body) {
  const autoplayEnabled = body.autoplayEnabled === true || body.autoplayEnabled === 'true';
  const autoplaySeconds = Number(body.autoplaySeconds);

  if (!Number.isFinite(autoplaySeconds) || autoplaySeconds < 1 || autoplaySeconds > 3600) {
    throw new Error('autoplaySeconds muss zwischen 1 und 3600 liegen.');
  }

  return { autoplayEnabled, autoplaySeconds };
}

export function createApp() {
  const app = express();
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json());

  app.use('/assets', express.static(path.join(process.cwd(), 'src', 'public')));
  app.use('/vendor/pdfjs', express.static(path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build')));

  app.get('/', (_, res) => {
    res.sendFile(path.join(process.cwd(), 'src', 'public', 'viewer.html'));
  });

  app.get('/health', (_, res) => {
    res.json({ ok: true });
  });

  app.get('/admin', (_, res) => {
    res.sendFile(path.join(process.cwd(), 'src', 'public', 'admin.html'));
  });

  app.get('/api/presentation', (_, res) => {
    const state = readState();

    if (!state.currentPresentation) {
      return res.json({
        hasPresentation: false,
        autoplayEnabled: state.autoplayEnabled,
        autoplaySeconds: state.autoplaySeconds
      });
    }

    return res.json({
      hasPresentation: true,
      autoplayEnabled: state.autoplayEnabled,
      autoplaySeconds: state.autoplaySeconds,
      fileName: state.currentPresentation.originalName,
      pdfUrl: '/presentation/current.pdf'
    });
  });

  app.get('/presentation/current.pdf', (_, res) => {
    const state = readState();

    if (!state.currentPresentation?.pdfPath || !fs.existsSync(state.currentPresentation.pdfPath)) {
      return res.status(404).send('Keine Präsentation vorhanden.');
    }

    return res.sendFile(path.resolve(state.currentPresentation.pdfPath));
  });

  app.get('/api/admin/settings', requireAdminToken, (_, res) => {
    const state = readState();
    res.json({
      autoplayEnabled: state.autoplayEnabled,
      autoplaySeconds: state.autoplaySeconds,
      currentPresentation: state.currentPresentation
        ? {
            originalName: state.currentPresentation.originalName,
            uploadedAt: state.currentPresentation.uploadedAt
          }
        : null
    });
  });

  app.post('/api/admin/settings', requireAdminToken, (req, res) => {
    try {
      const { autoplayEnabled, autoplaySeconds } = parseSettingsInput(req.body);
      const state = readState();
      const next = writeState({
        ...state,
        autoplayEnabled,
        autoplaySeconds
      });

      return res.json({
        ok: true,
        autoplayEnabled: next.autoplayEnabled,
        autoplaySeconds: next.autoplaySeconds
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/admin/upload', requireAdminToken, upload.single('presentation'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Keine Datei erhalten.' });
    }

    try {
      validateUpload(req.file.originalname);

      const fileBase = `presentation-${Date.now()}`;
      const pdfPath = await convertToPdf(req.file.path, fileBase);

      const state = readState();
      const next = writeState({
        ...state,
        currentPresentation: {
          originalName: req.file.originalname,
          sourceName: req.file.filename,
          pdfPath,
          uploadedAt: new Date().toISOString()
        }
      });

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.json({
        ok: true,
        currentPresentation: next.currentPresentation
      });
    } catch (error) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: error.message });
    }
  });

  app.use((error, _req, res, _next) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload-Fehler: ${error.message}` });
    }

    return res.status(500).json({ error: 'Interner Serverfehler.' });
  });

  return app;
}
