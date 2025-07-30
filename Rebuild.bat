@echo off
cd /d "%~dp0RolePlay" || (
    echo Ошибка: Не удалось перейти в папку RolePlay
    pause
    exit /b 1
)

echo START npm run build-prod...
npm run build-prod
