@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PORT=13000
echo.
echo 正在构建 PRISM 站点并启动本地预览…
echo 预览地址：http://127.0.0.1:%PORT%/
echo 关闭弹出的命令行窗口即可停止服务。
echo.

where npm >nul 2>&1 || (
  echo 未找到 npm。请先安装 Node.js 22+ 并加入 PATH。
  pause
  exit /b 1
)

call npm run build
if errorlevel 1 (
  echo 构建失败，请检查上方错误信息。
  pause
  exit /b 1
)

where py >nul 2>&1 && (
  start "PRISM-本地预览" /D "%~dp0out" cmd /k py -m http.server --bind 127.0.0.1 %PORT%
  goto opened
)
where python >nul 2>&1 && (
  start "PRISM-本地预览" /D "%~dp0out" cmd /k python -m http.server --bind 127.0.0.1 %PORT%
  goto opened
)

echo 未找到 Python（py/python），无法启动静态文件服务。
echo 构建产物在 out\ 目录，可用任意静态服务器托管。
pause
exit /b 1

:opened
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"
exit /b 0
