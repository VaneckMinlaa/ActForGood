@echo off
setlocal

:: Activer les sequences ANSI (Windows 10+)
reg add HKCU\Console /v VirtualTerminalLevel /t REG_DWORD /d 1 /f >nul 2>&1

:: Generer le caractere ESC (0x1B) pour les couleurs ANSI
for /F %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"

:: Codes couleur
set "R=%ESC%[0m"
set "BOLD=%ESC%[1m"
set "DIM=%ESC%[2m"
set "GREEN=%ESC%[92m"
set "YELLOW=%ESC%[93m"
set "RED=%ESC%[91m"
set "MAGENTA=%ESC%[95m"
set "WHITE=%ESC%[97m"

:: Chemins absolus (evite les problemes de cd)
set "SCRIPT_DIR=%~dp0"
set "BASE_DIR=%SCRIPT_DIR%.."
set "COMPOSE_FILE=%BASE_DIR%\docker-compose.yml"

cls

echo.
echo %RED%%BOLD%   #######  ########  ########  ########  ########%R%
echo %RED%%BOLD%  ##     ##    ##     ##     ## ##     ##    ##   %R%
echo %RED%%BOLD%  ##            ##     ##     ## ##     ##    ##   %R%
echo %RED%%BOLD%   #######    ##     ##     ## ########     ##   %R%
echo %RED%%BOLD%         ##   ##     ##     ## ##           ##   %R%
echo %RED%%BOLD%  ##     ##   ##     ##     ## ##           ##   %R%
echo %RED%%BOLD%   #######    ##     ########  ##           ##   %R%
echo.
echo %DIM%             Arret de la plateforme ActForGood%R%
echo %DIM%   ===========================================================%R%
echo.

:: ════════════════════════════════════════════════════════════
::  ETAPE 1 -- Arret des processus Java (Spring Boot)
:: ════════════════════════════════════════════════════════════
echo   %MAGENTA%%BOLD%[ 01 ]  %WHITE%Arret des microservices Java%R%
echo   %DIM%===========================================================%R%

:: Verifie si au moins un java.exe tourne
tasklist /FI "IMAGENAME eq java.exe" /NH 2>nul | findstr /I "java.exe" >nul 2>&1
if errorlevel 1 (
    echo   %YELLOW%  [!!]%R%  Aucun processus Java detecte -- rien a arreter
) else (
    echo   %YELLOW%  [>]%R%  Processus Java detectes -- arret en cours...
    taskkill /F /IM java.exe /T >nul 2>&1
    echo   %GREEN%  [OK]%R%  Processus Java arretes
)

:: ════════════════════════════════════════════════════════════
::  ETAPE 2 -- Infrastructure Docker (optionnel)
:: ════════════════════════════════════════════════════════════
echo.
echo   %MAGENTA%%BOLD%[ 02 ]  %WHITE%Infrastructure Docker%R%
echo   %DIM%===========================================================%R%

where docker >nul 2>&1
if errorlevel 1 (
    echo   %DIM%  [-]%R%  Docker non detecte -- aucune action necessaire
    goto :done
)

if not exist "%COMPOSE_FILE%" (
    echo   %YELLOW%  [!!]%R%  docker-compose.yml introuvable dans %BASE_DIR%
    goto :done
)

echo.
set /p "RESP=   %YELLOW%[?]%R%  Arreter Postgres, Redis, RabbitMQ et MongoDB ? %DIM%[o/N]%R%  "
echo.

if /i "%RESP%"=="o" (
    echo   %YELLOW%  [>]%R%  Arret des conteneurs Docker...
    docker-compose -f "%COMPOSE_FILE%" stop postgres redis rabbitmq mongodb
    if errorlevel 1 (
        echo   %YELLOW%  [!!]%R%  docker-compose a signale une erreur -- verifiez Docker Desktop
    ) else (
        echo   %GREEN%  [OK]%R%  Conteneurs arretes
    )
) else (
    echo   %DIM%  [-]%R%  Infrastructure Docker conservee active
)

:done
echo.
echo   %DIM%===========================================================%R%
echo.
echo   %GREEN%%BOLD%  [OK]  Arret termine. A bientot !!%R%
echo.
echo   %DIM%===========================================================%R%
echo.
pause
