@echo off
REM ============================================================
REM  EduPathway India — Windows Local Deploy Script
REM  Usage: deploy.bat
REM  Builds and runs the app locally using Docker
REM  Access at: http://localhost:1206
REM ============================================================

set IMAGE=edu-guide
set CONTAINER=edu-guide
set PORT=1206

echo [1/3] Building Docker image...
docker build -t %IMAGE% "%~dp0frontend"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker build failed.
    exit /b 1
)

echo [2/3] Stopping and removing old container (if any)...
docker stop %CONTAINER% 2>nul
docker rm   %CONTAINER% 2>nul

echo [3/3] Starting container...
docker run -d --name %CONTAINER% -p %PORT%:80 %IMAGE%
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to start container.
    exit /b 1
)

echo.
echo Deploy complete! Open: http://localhost:%PORT%
