@echo off
echo ===================================================
echo   GREENIE FIX & START SCRIPT
echo ===================================================
echo.
echo 1. Stopping any old servers (node.exe)...
taskkill /F /IM node.exe >nul 2>&1
echo    Done.
echo.
echo 2. Installing needed tools...
call npm install concurrently --save-dev >nul 2>&1
echo    Done.
echo.
echo 3. Starting Backend (Port 4000) and Frontend (Port 4200)...
echo    Please wait... the browser will open automatically.
echo.
npm start
pause
