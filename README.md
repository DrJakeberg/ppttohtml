# ppttohtml / Presentation Kiosk

Dockerized web application for presentation display with:
- Viewer at `/` (fullscreen button, swipe, manual navigation)
- Admin panel at `/admin` (token-protected API actions)
- Upload support for `pdf`, `ppt`, `pptx`
- `ppt/pptx -> pdf` conversion via LibreOffice
- Optional autoplay (x seconds), loop enabled

## Quick Start with Docker Compose

1. Set token:

```bash
export ADMIN_TOKEN='your-strong-token'
```

2. Start:

```bash
docker compose up -d --build
```

3. Open:
- Viewer: `http://localhost:3000/`
- Admin: `http://localhost:3000/admin`

## Usage

### Viewer
- `Fullscreen` button is visible immediately
- `Back` / `Next` buttons
- Keyboard: `Arrow left/right`, `PageUp/PageDown`
- Touch: horizontal swipe to change slides
- If autoplay is enabled: advances after `x` seconds
- After last slide: loops back to slide 1

### Admin
1. Enter token
2. Select and upload file (`pdf/ppt/pptx`)
3. Enable/disable autoplay
4. Save autoplay interval (seconds)

## Configuration

Important environment variables:
- `ADMIN_TOKEN` (required for production)
- `PORT` (default `3000`)
- `DATA_DIR` (Docker default: `/app/data`)
- `UPLOAD_DIR` (Docker default: `/app/uploads`)
- `CONVERTED_DIR` (Docker default: `/app/converted`)

## Persistence

`docker-compose.yml` defines persistent volumes:
- `presentation_data`
- `presentation_uploads`
- `presentation_converted`

## Development

Local scripts:
```bash
npm install
npm run dev
npm test
npm run lint
```

## Registry Scripts

- Start local Docker registry:
```bash
./scripts/create-local-registry.sh
```

- Build and push image:
```bash
REGISTRY=ghcr.io IMAGE_NAME=<user>/<repo> TAG=latest ./scripts/publish-image.sh
```

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`
- `npm ci`
- `npm run lint`
- `npm test`

## Production Notes

- Never keep `ADMIN_TOKEN` at default value
- Put a reverse proxy + TLS in front (e.g. Traefik/Nginx)
- Regularly update images and run security scans
- Optional: add rate limiting and IP allowlist for `/admin`
