@echo off
chcp 65001>nul
cd /d "%~dp0"
rem Restart: stop python on localhost:18080, then start resume folder server again
set PORT=18080
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0restart-server.ps1" -Port %PORT%
