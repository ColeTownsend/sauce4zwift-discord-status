@echo off
echo.
echo Installing Sauce4Zwift Discord Status...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

if %errorlevel% equ 0 (
    echo.
    echo Installation complete!
    echo.
    echo To start the plugin, run:
    echo   npm start
    echo.
    echo Make sure Discord and Sauce4Zwift are running!
    pause
) else (
    echo Installation failed
    pause
    exit /b 1
)
