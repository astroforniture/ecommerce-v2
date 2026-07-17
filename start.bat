@echo off
title Avvio Astro Forniture E-commerce
echo --------------------------------------------------
echo AVVIO E-COMMERCE ASTRO FORNITURE IN CORSO...
echo --------------------------------------------------

set "ROOT=C:\Users\Utente\Cubbit\Astro Forniture\ecommerce-v2"

:: 1. Storefront (porta 5173)
echo Accensione negozio (Storefront)...
start "Storefront - Porto 5173" cmd /k "cd /d "%ROOT%" && npm run dev"

timeout /t 3 /nobreak >nul

:: 2. Back office (porta 5174)
echo Accensione pannello admin...
start "Admin - Porto 5174" cmd /k "cd /d "%ROOT%\astro-admin" && npm run dev"

timeout /t 3 /nobreak >nul

:: 3. Apri il negozio su Chrome
echo Apertura sito sul browser...
start chrome http://localhost:5173

echo --------------------------------------------------
echo Storefront: http://localhost:5173
echo Admin:      http://localhost:5174
echo Buona giornata.
echo --------------------------------------------------
exit
