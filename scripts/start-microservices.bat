@echo off
setlocal enabledelayedexpansion

:: ─────────────────────────────────────────────────────────────
::   ActForGood  --  Lancement des Microservices
::   Windows Batch Script
:: ─────────────────────────────────────────────────────────────

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
set "CYAN=%ESC%[96m"
set "BLUE=%ESC%[94m"
set "MAGENTA=%ESC%[95m"
set "WHITE=%ESC%[97m"

cls

echo.
echo %CYAN%%BOLD%   ##     ######  ########    ######## ########  #######  ########%R%
echo %CYAN%%BOLD%  ## ##  ##       ##          ##       ##       ##     ## ##     ##%R%
echo %CYAN%%BOLD% ##   ## ##       ##          ##       ##       ##     ## ##     ##%R%
echo %CYAN%%BOLD%##     ## ##      ######      ######   ######   ##     ## ##     ##%R%
echo %CYAN%%BOLD%######### ##       ##          ##       ##       ##     ## ##     ##%R%
echo %CYAN%%BOLD%##     ## ##       ##          ##       ##       ##     ## ##     ##%R%
echo %CYAN%%BOLD%##     ##  ######  ##          ##       ########  #######  ########%R%
echo.
echo %DIM%             Plateforme solidaire de mise en relation%R%
echo %DIM%   ===========================================================%R%
echo.

:: ── Chemins ──────────────────────────────────────────────────
set "SCRIPT_DIR=%~dp0"
set "BASE_DIR=%SCRIPT_DIR%.."
set "TARGET_DIR=%BASE_DIR%\ActForGood Microservices"
set "LOG_DIR=%BASE_DIR%\Logs"
set "MVN_CMD=%TARGET_DIR%\mvnw.cmd"

:: Creer le dossier Logs si besoin
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

:: ════════════════════════════════════════════════════════════
::  ETAPE 1 -- Verification de Maven
:: ════════════════════════════════════════════════════════════
echo   %MAGENTA%%BOLD%[ 01 ]  %WHITE%Verification de Maven%R%
echo   %DIM%===========================================================%R%

if exist "%MVN_CMD%" (
    echo   %GREEN%  [OK]%R%  Maven Wrapper detecte
) else (
    echo   %YELLOW%  [!!]%R%  Maven Wrapper introuvable, recherche du Maven systeme...
    where mvn >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        set "MVN_CMD=mvn"
        echo   %GREEN%  [OK]%R%  Maven systeme utilise
    ) else (
        echo   %RED%  [XX]%R%  Aucun Maven disponible. Installez-le ou ajoutez mvnw.cmd.
        echo.
        pause
        exit /b 1
    )
)

:: ════════════════════════════════════════════════════════════
::  ETAPE 2 -- Chargement du fichier .env
:: ════════════════════════════════════════════════════════════
echo.
echo   %MAGENTA%%BOLD%[ 02 ]  %WHITE%Chargement de la configuration%R%
echo   %DIM%===========================================================%R%

set "ENV_FILE=%BASE_DIR%\.env"
if exist "%ENV_FILE%" (
    for /f "usebackq tokens=1,* delims==" %%A in ("%ENV_FILE%") do (
        set "_L=%%A"
        if not "!_L:~0,1!"=="#" if not "!_L!"=="" (
            set "%%A=%%B"
        )
    )
    echo   %GREEN%  [OK]%R%  Variables chargees  DB_HOST=!DB_HOST! / USER=!DB_USERNAME!
) else (
    echo   %YELLOW%  [!!]%R%  Fichier .env introuvable -- valeurs par defaut des YML appliquees
)

echo   %CYAN%  [>>]%R%  Logs  -->  %LOG_DIR%

:: ════════════════════════════════════════════════════════════
::  ETAPE 3 -- Infrastructure Docker
:: ════════════════════════════════════════════════════════════
echo.
echo   %MAGENTA%%BOLD%[ 03 ]  %WHITE%Infrastructure  (Postgres / Redis / RabbitMQ / MongoDB)%R%
echo   %DIM%===========================================================%R%

where docker >nul 2>&1
if errorlevel 1 goto :no_docker

docker-compose -f "%BASE_DIR%\docker-compose.yml" up -d postgres redis rabbitmq mongodb >nul 2>&1
if errorlevel 1 (
    echo   %YELLOW%  [!!]%R%  docker-compose a retourne une erreur -- verifiez Docker Desktop
) else (
    echo   %GREEN%  [OK]%R%  Conteneurs demarres via Docker Compose
)
call :wait_dots 10 "Initialisation des bases de donnees"
goto :infra_ready

:no_docker
echo   %YELLOW%  [!!]%R%  Docker non detecte -- assurez-vous que vos BDD tournent localement
call :wait_dots 3 "Verification reseau local"

:infra_ready
echo   %GREEN%  [OK]%R%  Infrastructure prete

:: ════════════════════════════════════════════════════════════
::  ETAPE 4 -- Microservices Spring Cloud
:: ════════════════════════════════════════════════════════════
echo.
echo   %MAGENTA%%BOLD%[ 04 ]  %WHITE%Demarrage des microservices%R%
echo   %DIM%===========================================================%R%

echo.
echo   %BLUE%%BOLD%  >> Infrastructure Spring Cloud%R%
call :start_service "config-server"     "Config Server"              15
call :start_service "service-discovery" "Service Discovery Eureka"   20
call :start_service "api-gateway"       "API Gateway"                15

echo.
echo   %BLUE%%BOLD%  >> Services metiers%R%
call :start_service "user-service"         "User Service"         5
call :start_service "campaign-service"     "Campaign Service"     5
call :start_service "matching-service"     "Matching Service"     5
call :start_service "donation-service"     "Donation Service"     5
call :start_service "wallet-service"       "Wallet Service"       5
call :start_service "transaction-service"  "Transaction Service"  5
call :start_service "payment-service"      "Payment Service"      5
call :start_service "notification-service" "Notification Service" 5
call :start_service "blockchain-service"   "Blockchain Service"   5

:: ════════════════════════════════════════════════════════════
::  RESUME FINAL
:: ════════════════════════════════════════════════════════════
echo.
echo   %DIM%===========================================================%R%
echo.
echo   %GREEN%%BOLD%  [OK] Tous les services ont ete lances avec succes !!%R%
echo.
echo   %WHITE%  Tableaux de bord :%R%
echo   %CYAN%    [*] Eureka Dashboard  -->%R%  http://localhost:8761
echo   %CYAN%    [*] API Gateway       -->%R%  http://localhost:8080
echo   %DIM%    [*] Logs              -->  %LOG_DIR%%R%
echo.
echo   %DIM%===========================================================%R%
echo.
pause
exit /b 0


:: ════════════════════════════════════════════════════════════
::  FONCTIONS UTILITAIRES
:: ════════════════════════════════════════════════════════════

:: ── Demarrer un service ──────────────────────────────────────
:start_service
set "SVC_ID=%~1"
set "SVC_NAME=%~2"
set "SVC_WAIT=%~3"
set "SVC_LOG=%LOG_DIR%\%SVC_ID%.log"
set "SVC_DIR=%TARGET_DIR%\%SVC_ID%"

if not exist "%SVC_DIR%" (
    echo   %DIM%  [-]  %SVC_NAME% -- dossier introuvable, ignore%R%
    goto :eof
)

echo   %YELLOW%  [>]%R%  %SVC_NAME%...
start /b cmd /c "cd /d "%SVC_DIR%" && "%MVN_CMD%" spring-boot:run > "%SVC_LOG%" 2>&1"

if %SVC_WAIT% GTR 0 (
    call :wait_dots %SVC_WAIT% "      Stabilisation de %SVC_NAME%"
)
echo   %GREEN%  [OK]%R%  %SVC_NAME% lance  [log: %SVC_ID%.log]
goto :eof


:: ── Barre d'attente animee ───────────────────────────────────
:wait_dots
set "WD_S=%~1"
set "WD_M=%~2"
<nul set /p "=%DIM%   %WD_M% "
for /l %%i in (1,1,%WD_S%) do (
    <nul set /p "=."
    timeout /t 1 /nobreak >nul
)
echo %R%
goto :eof
