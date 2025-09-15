@REM Script pour lancer codegen en stand alone

@echo off
echo === Script Codegen Playwright ===
cd /d "%~dp0"
set PATH=%~dp0node-v22.19.0-win-x64;%PATH%

echo Verification Node.js...
node --version || (echo Node.js non trouve & pause & exit /b 1)

cd tests
echo Repertoire: %CD%

echo.
echo === Lancement Codegen ===
if "%1"=="" (
    echo Utilisation de l'URL par defaut: http://localhost:8082
    npx playwright codegen http://localhost:8082
) else (
    echo Utilisation de l'URL: %1
    npx playwright codegen %1
)

pause