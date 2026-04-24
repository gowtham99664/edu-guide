@echo off
setlocal EnableDelayedExpansion
REM ============================================================
REM  EduGuide India — Windows Full Stack Deploy Script
REM  Usage: deploy.bat
REM  Builds and deploys: PostgreSQL, Ollama, Backend, Frontend
REM  Frontend: http://10.127.248.85:1206
REM  Backend:  http://10.127.248.85:1207
REM  API Docs: http://10.127.248.85:1207/docs
REM ============================================================

set PROJECT_DIR=%~dp0
set FRONTEND_PORT=1206
set BACKEND_PORT=1207

REM Host shown in summary URLs (override with DEPLOY_HOST if needed)
if defined DEPLOY_HOST (
  set APP_HOST=%DEPLOY_HOST%
) else (
  set APP_HOST=localhost
)

echo ======================================================
echo  EduGuide India - Full Stack Deployment
echo ======================================================

REM ── 1. Docker network ──────────────────────────────────
echo [1/7] Checking Docker network...
docker network inspect eduguide-network >nul 2>&1 || docker network create eduguide-network
echo       Network OK

REM ── 2. PostgreSQL ──────────────────────────────────────
echo [2/7] Starting PostgreSQL...
docker rm -f eduguide-db 2>nul
docker run -d ^
  --name eduguide-db ^
  --network eduguide-network ^
  --restart unless-stopped ^
  -e POSTGRES_USER=eduguide ^
  -e POSTGRES_PASSWORD=EduGuide2024Secure ^
  -e POSTGRES_DB=eduguide_db ^
  -v eduguide_pgdata:/var/lib/postgresql/data ^
  -p 5433:5432 ^
  postgres:15-alpine
if %ERRORLEVEL% neq 0 (
    echo [ERROR] PostgreSQL failed to start.
    exit /b 1
)
echo       PostgreSQL started

REM ── 3. Ollama ──────────────────────────────────────────
echo [3/7] Starting Ollama (Qwen AI)...
docker rm -f eduguide-ollama 2>nul
docker run -d ^
  --name eduguide-ollama ^
  --network eduguide-network ^
  --restart unless-stopped ^
  -v eduguide_ollama:/root/.ollama ^
  -p 11434:11434 ^
  ollama/ollama:latest
echo       Ollama started

echo       Waiting for Ollama to be ready...
set OLLAMA_READY=0
for /l %%i in (1,1,30) do (
    curl -sf http://localhost:11434/api/tags >nul 2>&1
    if !errorlevel! equ 0 (
        set OLLAMA_READY=1
        goto :ollama_ready
    )
    timeout /t 2 /nobreak >nul
)
:ollama_ready
if !OLLAMA_READY! equ 1 (
    echo       Ollama is ready!
) else (
    echo       [WARN] Ollama readiness check timed out; continuing...
)

REM ── 4. Pull Qwen model ────────────────────────────────
echo [4/7] Pulling Qwen2.5:1.5b model...
docker exec eduguide-ollama ollama pull qwen2.5:1.5b
echo       Qwen model ready

REM ── 5. Backend ─────────────────────────────────────────
echo [5/7] Building and starting backend...
docker rm -f eduguide-backend 2>nul
docker rmi eduguide-backend 2>nul
docker build -t eduguide-backend "%PROJECT_DIR%backend"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Backend build failed.
    exit /b 1
)
docker run -d ^
  --name eduguide-backend ^
  --network eduguide-network ^
  --restart unless-stopped ^
  -p %BACKEND_PORT%:8000 ^
  eduguide-backend
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Backend failed to start.
    exit /b 1
)
echo       Backend started on port %BACKEND_PORT%

REM ── 6. Frontend ────────────────────────────────────────
echo [6/7] Building and starting frontend...
docker rm -f edu-guide 2>nul
docker rmi edu-guide 2>nul
docker build -t edu-guide "%PROJECT_DIR%frontend"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Frontend build failed.
    exit /b 1
)
docker run -d ^
  --name edu-guide ^
  --restart unless-stopped ^
  -p %FRONTEND_PORT%:80 ^
  edu-guide
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Frontend failed to start.
    exit /b 1
)
echo       Frontend started on port %FRONTEND_PORT%

REM ── 7. Verify ─────────────────────────────────────────
echo [7/7] Verifying deployment...
timeout /t 5 /nobreak >nul

for /f "delims=" %%A in ('curl -s -o nul -w "%%{http_code}" http://localhost:%FRONTEND_PORT%/ 2^>nul') do set FRONTEND_STATUS=%%A
for /f "delims=" %%A in ('curl -s -o nul -w "%%{http_code}" http://localhost:%BACKEND_PORT%/health 2^>nul') do set BACKEND_STATUS=%%A
for /f "delims=" %%A in ('curl -s -o nul -w "%%{http_code}" http://localhost:11434/api/tags 2^>nul') do set OLLAMA_STATUS=%%A

if not defined FRONTEND_STATUS set FRONTEND_STATUS=000
if not defined BACKEND_STATUS set BACKEND_STATUS=000
if not defined OLLAMA_STATUS set OLLAMA_STATUS=000

echo.
echo ======================================================
echo  Deployment Summary
echo ======================================================
echo  Frontend  http://%APP_HOST%:%FRONTEND_PORT%    [%FRONTEND_STATUS%]
echo  Backend   http://%APP_HOST%:%BACKEND_PORT%     [%BACKEND_STATUS%]
echo  Ollama    http://%APP_HOST%:11434              [%OLLAMA_STATUS%]
echo  API Docs  http://%APP_HOST%:%BACKEND_PORT%/docs
echo.
echo  .env file: %PROJECT_DIR%backend\.env
echo ======================================================

docker ps --filter "name=eduguide" --filter "name=edu-guide" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
