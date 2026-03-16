import { createApp } from './app.js';
import { getAdminToken } from './config.js';

const app = createApp();
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
  if (getAdminToken() === 'changeme') {
    console.warn('Warnung: ADMIN_TOKEN ist nicht gesetzt. Fallback-Token "changeme" aktiv.');
  }
});
