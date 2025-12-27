@echo off
title Appraise - Local Development Server
color 0A

echo ========================================
echo        Appraise Local Launcher
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    echo.
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully.
    echo.
)

:: Check for .env.local file
if not exist ".env.local" (
    echo [WARNING] .env.local file not found.
    echo Creating template .env.local file...
    echo GEMINI_API_KEY=your_api_key_here > .env.local
    echo.
    echo [ACTION REQUIRED] Please edit .env.local and add your Gemini API key.
    echo Opening .env.local in notepad...
    notepad .env.local
    echo.
    echo Press any key to continue after adding your API key...
    pause >nul
)

echo ========================================
echo   Starting development server...
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

:: Start the dev server
npm run dev
