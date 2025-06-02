@echo off
echo Iniciando el Sistema de Reservas (Arquitectura de Tres Capas)
echo.

REM Instalar dependencias del backend
echo Instalando dependencias del backend...
cd backend
call npm install
echo.

REM Instalar http-server globalmente si no está instalado
echo Instalando http-server...
call npm install -g http-server
echo.

REM Iniciar el backend
echo Iniciando el servidor backend...
start cmd /k "cd backend && npm run dev"

REM Esperar 5 segundos para que el backend inicie
timeout /t 5

REM Iniciar el frontend
echo Iniciando el servidor frontend...
start cmd /k "cd frontend/src && http-server -p 8080"

REM Abrir el navegador
echo Abriendo el navegador...
timeout /t 2
start http://localhost:8080

echo.
echo Sistema iniciado! 
echo Backend corriendo en http://localhost:3000
echo Frontend corriendo en http://localhost:8080 