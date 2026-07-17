@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Backup automatico progetto ecommerce-v2
REM Richiede: git installato e disponibile nel PATH

cd /d "%~dp0"

REM Timestamp locale in formato leggibile
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format \"yyyy-MM-dd HH:mm:ss\""') do set "NOW=%%i"

echo [BACKUP] Avvio backup automatico alle !NOW!

git add .
if errorlevel 1 (
  echo [BACKUP] Errore durante git add .
  exit /b 1
)

git diff --cached --quiet
if not errorlevel 1 (
  git commit -m "Backup automatico - !NOW!"
  if errorlevel 1 (
    echo [BACKUP] Commit non riuscito.
    exit /b 1
  )
) else (
  echo [BACKUP] Nessuna modifica da salvare.
)

REM Push opzionale su branch backup-giornaliero:
REM 1) togli "REM" alle righe sotto se vuoi abilitarlo.
REM git push origin HEAD:backup-giornaliero
REM if errorlevel 1 (
REM   echo [BACKUP] Push non riuscito.
REM   exit /b 1
REM )

echo [BACKUP] Completato.
exit /b 0
