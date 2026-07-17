@echo off
REM Automazione Astro Forniture: Sintel + MePA, report unificato, email unica
cd /d "%~dp0"
"C:\Python314\python.exe" cerca_gare_astro.py
exit /b %ERRORLEVEL%
