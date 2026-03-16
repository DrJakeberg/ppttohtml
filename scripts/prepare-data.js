import { ensureDirectories, readState } from '../src/config.js';

ensureDirectories();
readState();

console.log('Datenverzeichnisse und state.json vorbereitet.');
