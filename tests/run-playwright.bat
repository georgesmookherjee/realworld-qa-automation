@echo off
set PATH=%~dp0..\node-v22.19.0-win-x64;%PATH%
playwright test --ui
npm run test:ui