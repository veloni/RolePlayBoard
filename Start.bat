@echo off
cd /d "%~dp0RolePlay/electron/dist-electron/win-unpacked" || (
    echo Ошибка: Не удалось перейти в папку RolePlay
    pause
    exit /b 1
)

start "" /B Electron.exe
exit