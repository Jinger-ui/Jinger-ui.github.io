@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem 若端口仍被占用，可把下面改成 28080 / 38123 等
set PORT=18080
echo.
echo 正在启动本地网站：http://127.0.0.1:%PORT%/
echo 服务目录：%CD%
echo 关闭弹出的命令行窗口即可停止服务；或在该窗口按 Ctrl+C。
echo.

where py >nul 2>&1 && (
  start "简历网站-本地服务" /D "%~dp0" cmd /k py -m http.server --bind 127.0.0.1 %PORT%
  goto opened
)
where python >nul 2>&1 && (
  start "简历网站-本地服务" /D "%~dp0" cmd /k python -m http.server --bind 127.0.0.1 %PORT%
  goto opened
)

echo 未找到 Python（py/python）。请先安装 Python 并加入 PATH，
echo 或直接用浏览器双击打开本文件夹里的 index.html
pause
exit /b 1

:opened
rem 等新进程监听端口后再打开浏览器（老机器可多等几秒）
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"
exit /b 0
