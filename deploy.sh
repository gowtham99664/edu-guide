#!/bin/bash
# ============================================================
#  EduPathway India — VM-side Deploy Script
#  Usage: bash /opt/edu-guide/deploy.sh
#  Rebuilds and restarts the Docker container from current source
# ============================================================

set -e

APP_DIR=/opt/edu-guide/frontend

echo "[1/3] Building Docker image..."
cd "$APP_DIR"
docker build -t edu-guide .

echo "[2/3] Stopping and removing old container..."
docker stop edu-guide 2>/dev/null || true
docker rm   edu-guide 2>/dev/null || true

echo "[3/3] Starting new container..."
docker run -d --name edu-guide -p 1206:80 edu-guide

echo ""
echo "Deploy complete! Site: http://10.127.248.85:1206"
