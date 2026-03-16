# Deployment

## 1) Build + Run per Compose

```bash
export ADMIN_TOKEN='dein-token'
docker compose up -d --build
```

## 2) Healthcheck

```bash
curl http://localhost:3000/health
```

## 3) Container Registry

### Lokale Registry
```bash
./scripts/create-local-registry.sh
```

### Externe Registry (z. B. GHCR)
```bash
echo "$GHCR_PAT" | docker login ghcr.io -u <github-user> --password-stdin
REGISTRY=ghcr.io IMAGE_NAME=<github-user>/presentation-web TAG=v1 ./scripts/publish-image.sh
```

## 4) Reverse Proxy (Empfehlung)

- TLS erzwingen
- Pfadschutz für `/admin`
- Optional: IP-Filter für Adminzugriff
