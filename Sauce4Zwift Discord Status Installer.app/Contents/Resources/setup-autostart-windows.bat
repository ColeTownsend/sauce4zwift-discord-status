@echo off
REM Setup Windows Task Scheduler to auto-start with Sauce4Zwift

echo Setting up auto-start with Sauce4Zwift...
echo.

set "MOD_DIR=%USERPROFILE%\Documents\SauceMods\sauce4zwift-discord-status"

REM Check if mod is installed
if not exist "%MOD_DIR%" (
    echo Plugin not found at: %MOD_DIR%
    echo Please run the installer first!
    pause
    exit /b 1
)

REM Create a watcher script
set "WATCHER_PATH=%MOD_DIR%\sauce-watcher.vbs"
echo ' Sauce4Zwift Discord Status - Auto-starter > "%WATCHER_PATH%"
echo Set WshShell = CreateObject("WScript.Shell") >> "%WATCHER_PATH%"
echo Set objWMIService = GetObject("winmgmts:\\.\root\cimv2") >> "%WATCHER_PATH%"
echo strModDir = "%MOD_DIR%" >> "%WATCHER_PATH%"
echo. >> "%WATCHER_PATH%"
echo ' Monitor for Sauce4Zwift process >> "%WATCHER_PATH%"
echo Do While True >> "%WATCHER_PATH%"
echo     Set colProcesses = objWMIService.ExecQuery("Select * from Win32_Process Where Name = 'Sauce4Zwift.exe'") >> "%WATCHER_PATH%"
echo. >> "%WATCHER_PATH%"
echo     If colProcesses.Count ^> 0 Then >> "%WATCHER_PATH%"
echo         ' Sauce is running, check if plugin is running >> "%WATCHER_PATH%"
echo         Set colDiscord = objWMIService.ExecQuery("Select * from Win32_Process Where CommandLine Like '%%sauce4zwift-discord-status%%'") >> "%WATCHER_PATH%"
echo. >> "%WATCHER_PATH%"
echo         If colDiscord.Count = 0 Then >> "%WATCHER_PATH%"
echo             ' Start the plugin >> "%WATCHER_PATH%"
echo             WshShell.CurrentDirectory = strModDir >> "%WATCHER_PATH%"
echo             WshShell.Run "cmd /c npm start", 0, False >> "%WATCHER_PATH%"
echo             WScript.Sleep 10000 >> "%WATCHER_PATH%"
echo         End If >> "%WATCHER_PATH%"
echo     End If >> "%WATCHER_PATH%"
echo. >> "%WATCHER_PATH%"
echo     WScript.Sleep 5000 >> "%WATCHER_PATH%"
echo Loop >> "%WATCHER_PATH%"

REM Create the scheduled task to run at login
schtasks /create /tn "Sauce4Zwift Discord Status Watcher" /tr "\"%WATCHER_PATH%\"" /sc onlogon /rl highest /f

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo Auto-start configured successfully!
    echo ==========================================
    echo.
    echo The Discord Status plugin will now:
    echo   - Start automatically when Sauce4Zwift launches
    echo   - Stop automatically when Sauce4Zwift closes
    echo   - Monitor continuously in the background
    echo.
    echo The watcher starts when you log in and waits for Sauce4Zwift.
    echo.
    echo To disable auto-start:
    echo   1. Open Task Scheduler
    echo   2. Find "Sauce4Zwift Discord Status Watcher"
    echo   3. Right-click and select "Disable" or "Delete"
    echo.
    echo ==========================================
) else (
    echo.
    echo ==========================================
    echo Failed to set up auto-start
    echo ==========================================
    echo Please run this script as Administrator
    echo.
)

pause
