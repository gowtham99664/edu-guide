#!/bin/bash
# ============================================================
#  EduGuide India — Full Stack Deploy Script
#  Usage: bash /opt/edu-guide/deploy.sh
#  Builds and deploys: PostgreSQL, Ollama, Backend, Frontend
#  Frontend: http://10.127.248.85:1206
#  Backend:  http://10.127.248.85:1207
#  API Docs: http://10.127.248.85:1207/docs
# ============================================================

set -e

PROJECT_DIR="/opt/edu-guide"
FRONTEND_PORT=1206
BACKEND_PORT=1207
VM_IP="10.127.248.85"

echo "======================================================"
echo " EduGuide India - Full Stack Deployment"
echo "======================================================"

# ── 1. Ensure eduguide-network exists ────────────────────
echo "[1/7] Checking Docker network..."
docker network inspect eduguide-network >/dev/null 2>&1 || docker network create eduguide-network
echo "      Network OK"

# ── 2. Start PostgreSQL container ────────────────────────
echo "[2/7] Starting PostgreSQL..."
docker rm -f eduguide-db 2>/dev/null || true
docker run -d \
  --name eduguide-db \
  --network eduguide-network \
  --restart unless-stopped \
  -e POSTGRES_USER=eduguide \
  -e POSTGRES_PASSWORD=EduGuide2024Secure \
  -e POSTGRES_DB=eduguide_db \
  -v eduguide_pgdata:/var/lib/postgresql/data \
  -p 5433:5432 \
  postgres:15-alpine
echo "      PostgreSQL started"

# ── 3. Start Ollama container ─────────────────────────────
echo "[3/7] Starting Ollama (Qwen AI)..."
docker rm -f eduguide-ollama 2>/dev/null || true
docker run -d \
  --name eduguide-ollama \
  --network eduguide-network \
  --restart unless-stopped \
  -v eduguide_ollama:/root/.ollama \
  -p 11434:11434 \
  ollama/ollama:latest
echo "      Ollama started"

# Wait for Ollama to be ready
echo "      Waiting for Ollama to be ready..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; then
    echo "      Ollama is ready!"
    break
  fi
  sleep 2
done

# ── 4. Pull Qwen model ────────────────────────────────────
echo "[4/7] Pulling Qwen2.5:1.5b model (this may take a few minutes on first run)..."
docker exec eduguide-ollama ollama pull qwen2.5:1.5b
echo "      Qwen model ready!"

# ── 5. Build and start backend ───────────────────────────
echo "[5/7] Building backend..."
docker rm -f eduguide-backend 2>/dev/null || true
docker rmi eduguide-backend 2>/dev/null || true
docker build -t eduguide-backend "$PROJECT_DIR/backend"
docker run -d \
  --name eduguide-backend \
  --network eduguide-network \
  --restart unless-stopped \
  -p ${BACKEND_PORT}:8000 \
  eduguide-backend
echo "      Backend started on port $BACKEND_PORT"

# ── 6. Build and deploy frontend ─────────────────────────
echo "[6/7] Building frontend..."
docker rm -f edu-guide 2>/dev/null || true
docker rmi edu-guide 2>/dev/null || true
cd "$PROJECT_DIR/frontend"
docker build -t edu-guide .
docker run -d \
  --name edu-guide \
  --restart unless-stopped \
  -p ${FRONTEND_PORT}:80 \
  edu-guide
echo "      Frontend started on port $FRONTEND_PORT"

# ── 7. Verify ─────────────────────────────────────────────
echo "[7/7] Verifying deployment..."
sleep 5

FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${FRONTEND_PORT}/ 2>/dev/null || echo "000")
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${BACKEND_PORT}/health 2>/dev/null || echo "000")
OLLAMA_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:11434/api/tags 2>/dev/null || echo "000")

echo ""
echo "======================================================"
echo " Deployment Summary"
echo "======================================================"
echo " Frontend  http://${VM_IP}:${FRONTEND_PORT}    [$FRONTEND_STATUS]"
echo " Backend   http://${VM_IP}:${BACKEND_PORT}     [$BACKEND_STATUS]"
echo " Ollama    http://${VM_IP}:11434        [$OLLAMA_STATUS]"
echo " API Docs  http://${VM_IP}:${BACKEND_PORT}/docs"
echo ""
echo " .env file: $PROJECT_DIR/backend/.env"
echo " Update SMTP_EMAIL and SMTP_PASSWORD for OTP emails"
echo "======================================================"

docker ps --filter "name=eduguide" --filter "name=edu-guide" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
