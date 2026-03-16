import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT_DIR, 'src', 'data');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(ROOT_DIR, 'src', 'uploads');
const CONVERTED_DIR = process.env.CONVERTED_DIR || path.join(ROOT_DIR, 'src', 'converted');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

const defaultState = {
  currentPresentation: null,
  autoplayEnabled: false,
  autoplaySeconds: 10,
  updatedAt: new Date(0).toISOString()
};

export function getPaths() {
  return {
    ROOT_DIR,
    DATA_DIR,
    UPLOAD_DIR,
    CONVERTED_DIR,
    STATE_FILE
  };
}

export function ensureDirectories() {
  [DATA_DIR, UPLOAD_DIR, CONVERTED_DIR].forEach((dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

export function readState() {
  ensureDirectories();

  if (!fs.existsSync(STATE_FILE)) {
    writeState(defaultState);
    return { ...defaultState };
  }

  try {
    const content = fs.readFileSync(STATE_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return {
      ...defaultState,
      ...parsed
    };
  } catch {
    writeState(defaultState);
    return { ...defaultState };
  }
}

export function writeState(nextState) {
  ensureDirectories();
  const merged = {
    ...defaultState,
    ...nextState,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(STATE_FILE, JSON.stringify(merged, null, 2), 'utf-8');
  return merged;
}

export function getAdminToken() {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    return 'changeme';
  }

  return token;
}
