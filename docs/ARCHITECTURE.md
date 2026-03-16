# Architektur

## Komponenten

- `src/server.js`
  - Startpunkt, startet Express-Server
- `src/app.js`
  - Routen, Upload-API, Settings-API, statische Frontends
- `src/config.js`
  - State-Handling (`state.json`), Verzeichnisverwaltung, Token
- `src/converter.js`
  - Validierung und Konvertierung mit LibreOffice
- `src/public/viewer.*`
  - Viewer-Frontend mit pdf.js, Touch und Autoplay
- `src/public/admin.*`
  - Admin-Frontend für Upload + Einstellungen

## State-Modell

Datei: `state.json`

```json
{
  "currentPresentation": {
    "originalName": "demo.pptx",
    "sourceName": "...",
    "pdfPath": "...",
    "uploadedAt": "..."
  },
  "autoplayEnabled": true,
  "autoplaySeconds": 15,
  "updatedAt": "..."
}
```

## Upload-Flow

1. Datei über `/api/admin/upload` senden
2. Token-Prüfung über Header `x-admin-token`
3. Endung validieren (`pdf|ppt|pptx`)
4. Bei `ppt|pptx` Konvertierung via `soffice --headless`
5. State auf neue Präsentation setzen

## Viewer-Flow

1. `/api/presentation` lesen
2. PDF unter `/presentation/current.pdf` laden
3. Seiten rendern (pdf.js)
4. Interaktionen: Buttons, Tastatur, Touch
5. Optionaler Timer für Autoplay
