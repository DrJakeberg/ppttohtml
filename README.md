# ppttohtml / Presentation Kiosk

Dockerisierte Web-Anwendung für Präsentationen mit:
- Viewer unter `/` (Fullscreen-Button, Wischen, Blättern)
- Adminbereich unter `/admin` (Token-geschützt für API-Aktionen)
- Upload von `pdf`, `ppt`, `pptx`
- Konvertierung von `ppt/pptx -> pdf` via LibreOffice
- Optionales Autoplay (x Sekunden), Endlosschleife

## Schnellstart mit Docker Compose

1. Token setzen:

```bash
export ADMIN_TOKEN='dein-sehr-starker-token'
```

2. Starten:

```bash
docker compose up -d --build
```

3. Öffnen:
- Viewer: `http://localhost:3000/`
- Admin: `http://localhost:3000/admin`

## Bedienung

### Viewer
- `Vollbild`-Button direkt oben sichtbar
- `Zurück` / `Weiter` Buttons
- Tastatur: `Pfeil links/rechts`, `PageUp/PageDown`
- Touch: horizontal wischen für Seitenwechsel
- Wenn Autoplay aktiv ist: nach `x` Sekunden nächste Seite
- Nach letzter Seite: Start bei Seite 1

### Admin
1. Token eintragen
2. Datei (`pdf/ppt/pptx`) auswählen und hochladen
3. Autoplay aktivieren/deaktivieren
4. Sekundenintervall speichern

## Konfiguration

Wichtige ENV-Variablen:
- `ADMIN_TOKEN` (Pflicht für Produktion)
- `PORT` (Default `3000`)
- `DATA_DIR` (Default in Docker: `/app/data`)
- `UPLOAD_DIR` (Default in Docker: `/app/uploads`)
- `CONVERTED_DIR` (Default in Docker: `/app/converted`)

## Persistenz

In `docker-compose.yml` sind Volumes hinterlegt:
- `presentation_data`
- `presentation_uploads`
- `presentation_converted`

## Entwicklung

Lokale Scripts:
```bash
npm install
npm run dev
npm test
npm run lint
```

## Registry-Skripte

- Lokale Docker-Registry starten:
```bash
./scripts/create-local-registry.sh
```

- Image bauen und pushen:
```bash
REGISTRY=ghcr.io IMAGE_NAME=<user>/<repo> TAG=latest ./scripts/publish-image.sh
```

## CI

GitHub Actions Workflow: `.github/workflows/ci.yml`
- `npm ci`
- `npm run lint`
- `npm test`

## Wichtige Hinweise Produktion

- `ADMIN_TOKEN` niemals auf Default lassen
- Reverse Proxy + TLS (z. B. Traefik/Nginx) davor setzen
- Regelmäßige Image-Updates und Security-Scans
- Optional: Rate-Limit und Basic-IP-Whitelist für `/admin`
