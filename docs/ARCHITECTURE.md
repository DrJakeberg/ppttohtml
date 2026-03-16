# Architecture

## Components

- `src/server.js`
  - Entry point, starts the Express server
- `src/app.js`
  - Routes, upload API, settings API, static frontend delivery
- `src/config.js`
  - State handling (`state.json`), directory management, token access
- `src/converter.js`
  - File validation and LibreOffice conversion
- `src/public/viewer.*`
  - Viewer frontend with pdf.js, touch support, autoplay
- `src/public/admin.*`
  - Admin frontend for upload + settings

## State Model

File: `state.json`

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

## Upload Flow

1. Upload file through `/api/admin/upload`
2. Validate token from `x-admin-token` header
3. Validate extension (`pdf|ppt|pptx`)
4. Convert (`ppt|pptx`) via `soffice --headless`
5. Update state to new presentation

## Viewer Flow

1. Read `/api/presentation`
2. Load PDF from `/presentation/current.pdf`
3. Render pages with pdf.js
4. Handle interactions: buttons, keyboard, touch
5. Run optional autoplay timer
