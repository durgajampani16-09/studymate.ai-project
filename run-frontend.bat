@echo off
title StudyMate AI — Frontend Server
echo ========================================================
echo        StudyMate AI - Intelligent Study Assistant
echo ========================================================
echo.
cd /d "%~dp0\frontend"
echo [1/2] Checking dependencies...
if not exist "node_modules\" (
    echo Installing npm dependencies...
    call npm.cmd install
)
echo.
echo [2/2] Launching Vite development server at http://localhost:5173 ...
echo.
call npm.cmd run dev
pause
