@echo off
setlocal enabledelayedexpansion

echo === Build script started ===
echo.

echo [1/3] Entering RolePlay folder...
cd /d "%~dp0RolePlay" 2>nul || (
    echo ERROR: Cannot enter RolePlay folder
    echo Check:
    echo 1. RolePlay folder exists
    echo 2. It's located next to this bat file
    pause
    exit /b 1
)
echo Success: %cd%
echo.

echo [2/3] Installing main dependencies (npm i)...
call npm i
echo Success: main dependencies installed
echo.

echo [3/3] Building Electron...
cd electron 2>nul || (
    echo ERROR: Cannot enter electron folder
    echo Check that electron folder exists inside RolePlay
    pause
    exit /b 1
)

echo Installing Electron dependencies...
call npm i
if errorlevel 1 (
    echo ERROR: Failed to install Electron dependencies
    pause
    exit /b 1
)

echo Starting build...
call npm run electron:build
if errorlevel 1 (
    echo ERROR: Build failed
    echo Check Electron configuration
    pause
    exit /b 1
)

echo.
echo === Build completed successfully ===
pause