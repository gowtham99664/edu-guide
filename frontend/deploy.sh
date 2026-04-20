#!/bin/bash
# ============================================================
#  EduPathway India - Linux Docker Deployment Script
#  Usage: chmod +x deploy.sh && ./deploy.sh
# ============================================================

CONTAINER_NAME="edu-guide"
IMAGE_NAME="edu-guide"
PORT=1206

echo "============================================================"
echo " EduPathway India - Docker Deployment"
echo "============================================================"
echo ""

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "[ERROR] Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if container exists (running or stopped)
echo "[1/5] Checking for existing container \"${CONTAINER_NAME}\"..."
if docker ps -a --filter "name=^${CONTAINER_NAME}$" --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "       Found existing container. Stopping and removing..."
    docker stop "${CONTAINER_NAME}" >/dev/null 2>&1
    docker rm "${CONTAINER_NAME}" >/dev/null 2>&1
    echo "       Container removed."
else
    echo "       No existing container found."
fi

# Check if image exists and remove it
echo "[2/5] Checking for existing image \"${IMAGE_NAME}\"..."
if docker images -q "${IMAGE_NAME}" 2>/dev/null | grep -q .; then
    echo "       Found existing image. Removing..."
    docker rmi "${IMAGE_NAME}" >/dev/null 2>&1
    echo "       Image removed."
else
    echo "       No existing image found."
fi

# Build the new image
echo "[3/5] Building Docker image \"${IMAGE_NAME}\"..."
if ! docker build -t "${IMAGE_NAME}" .; then
    echo "[ERROR] Docker build failed. Check the output above."
    exit 1
fi
echo "       Build successful."

# Run the container
echo "[4/5] Starting container \"${CONTAINER_NAME}\" on port ${PORT}..."
if ! docker run -d --name "${CONTAINER_NAME}" -p "${PORT}:80" "${IMAGE_NAME}"; then
    echo "[ERROR] Failed to start container. Check if port ${PORT} is in use."
    exit 1
fi

# Verify
echo "[5/5] Verifying deployment..."
sleep 3
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}/")
echo "       HTTP Status: ${HTTP_STATUS}"

if [ "${HTTP_STATUS}" = "200" ]; then
    echo ""
    echo "============================================================"
    echo " Deployment complete!"
    echo " Application is running at: http://localhost:${PORT}"
    echo "============================================================"
else
    echo ""
    echo "[WARNING] App returned HTTP ${HTTP_STATUS}. Check container logs:"
    echo "  docker logs ${CONTAINER_NAME}"
fi
