#!/usr/bin/env bash
set -euo pipefail

REGISTRY="${REGISTRY:-ghcr.io}"
IMAGE_NAME="${IMAGE_NAME:-youruser/presentation-web}"
TAG="${TAG:-latest}"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo "Baue Image: ${FULL_IMAGE}"
docker build -t "${FULL_IMAGE}" .

echo "Pushe Image: ${FULL_IMAGE}"
docker push "${FULL_IMAGE}"

echo "Fertig: ${FULL_IMAGE}"
