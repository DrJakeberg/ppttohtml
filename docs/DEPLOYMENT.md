# Deployment

## 1) Build + Run with Compose

```bash
export ADMIN_TOKEN='your-token'
docker compose up -d --build
```

## 2) Healthcheck

```bash
curl http://localhost:3000/health
```

## 3) Container Registry

### Local Registry
```bash
./scripts/create-local-registry.sh
```

### External Registry (e.g. GHCR)
```bash
echo "$GHCR_PAT" | docker login ghcr.io -u <github-user> --password-stdin
REGISTRY=ghcr.io IMAGE_NAME=<github-user>/presentation-web TAG=v1 ./scripts/publish-image.sh
```

## 4) Reverse Proxy (Recommended)

- Enforce TLS
- Protect `/admin`
- Optional: add IP filtering for admin access
