@echo off
setlocal enabledelayedexpansion

echo.
echo Sauce4Zwift Discord Status - Installer
echo ==========================================
echo.

REM Detect Documents directory
set "DOCS_DIR=%USERPROFILE%\Documents"
if not exist "%DOCS_DIR%" set "DOCS_DIR=%USERPROFILE%\My Documents"

REM Create SauceMods directory if it doesn't exist
set "MODS_DIR=%DOCS_DIR%\SauceMods"
if not exist "%MODS_DIR%" (
    echo Creating SauceMods directory...
    mkdir "%MODS_DIR%"
    echo Created %MODS_DIR%
)

REM Create mod directory
set "MOD_DIR=%MODS_DIR%\sauce4zwift-discord-status"
echo.
echo Installing to: %MOD_DIR%

REM Remove old installation if exists
if exist "%MOD_DIR%" (
    echo Existing installation found, removing...
    rmdir /s /q "%MOD_DIR%"
)

REM Create mod directory
mkdir "%MOD_DIR%"

REM Copy files
echo Copying files...
xcopy /E /I /Q src "%MOD_DIR%\src"
copy /Y package.json "%MOD_DIR%\"
copy /Y manifest.json "%MOD_DIR%\"
copy /Y LICENSE "%MOD_DIR%"
copy /Y README.md "%MOD_DIR%"

REM Install dependencies
echo.
echo Installing dependencies...
cd /d "%MOD_DIR%"
call npm install --silent

if %errorlevel% equ 0 (
    echo.
    echo Installation complete!
    echo.
    echo Installed to: %MOD_DIR%
    echo.
    echo To start the plugin:
    echo   cd "%MOD_DIR%"
    echo   npm start
    echo.
    echo Or double-click the 'start.bat' file
    echo.
    echo Make sure Discord and Sauce4Zwift are running!
    
    REM Create a start.bat file
    echo @echo off > "%MOD_DIR%\start.bat"
    echo cd /d "%%~dp0" >> "%MOD_DIR%\start.bat"
    echo npm start >> "%MOD_DIR%\start.bat"
    echo pause >> "%MOD_DIR%\start.bat"
    
    echo Created start.bat for easy launching
    echo.
    pause
) else (
    echo Installation failed
    pause
    exit /b 1
)
