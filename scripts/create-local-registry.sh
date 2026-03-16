#!/usr/bin/env bash
set -euo pipefail

NAME="${REGISTRY_NAME:-local-registry}"
PORT="${REGISTRY_PORT:-5000}"

if docker ps -a --format '{{.Names}}' | grep -q "^${NAME}$"; then
  echo "Registry-Container ${NAME} existiert bereits."
  docker start "${NAME}" >/dev/null || true
else
  docker run -d -p "${PORT}:5000" --restart=always --name "${NAME}" registry:2
fi

echo "Lokale Registry läuft unter: localhost:${PORT}"
echo "Beispiel: docker tag app:latest localhost:${PORT}/app:latest"
echo "Beispiel: docker push localhost:${PORT}/app:latest"
