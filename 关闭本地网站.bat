@echo off
chcp 65001 >nul
echo.
echo 【说明】这会结束监听 127.0.0.1 指定端口的 Python 内置网站进程（不改系统其它服务）。
echo 端口扫描: 8000 8765 18080 28123 58123
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0关闭本地网站.ps1"
echo.
pause
