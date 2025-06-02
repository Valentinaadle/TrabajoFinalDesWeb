# Instrucciones para Ejecutar el Proyecto

## Requisitos Previos
- Node.js instalado (versión 14 o superior)
- Navegador web moderno

## Pasos para Ejecutar

### 1. Backend (Capa de Negocio)
Esta capa requiere Node.js y npm porque usa Express:

1. Abrir una terminal
2. Navegar a la carpeta del backend:
```bash
cd tres-capas/backend
```
3. Instalar dependencias (solo la primera vez):
```bash
npm install
```
4. Iniciar el servidor:
```bash
npm run dev
```
El servidor estará corriendo en http://localhost:3000

### 2. Frontend (Capa de Presentación)
Esta capa solo necesita un servidor web simple:

1. Abrir otra terminal
2. Navegar a la carpeta del frontend:
```bash
cd tres-capas/frontend/src
```
3. Iniciar el servidor web:
```bash
http-server -p 8080
```
Si no tienes http-server instalado, puedes instalarlo globalmente:
```bash
npm install -g http-server
```

La aplicación estará disponible en http://localhost:8080

### 3. Capa de Datos
Esta capa no necesita ejecutarse por separado, ya que:
- Es un archivo JSON (`database/data/db.json`)
- El backend lo lee y escribe directamente
- No requiere ninguna instalación o ejecución

## Estructura de Archivos
```
tres-capas/
├── frontend/           # Capa de Presentación
│   └── src/
│       ├── index.html  # No requiere npm
│       ├── styles/
│       └── js/
├── backend/           # Capa de Negocio
│   └── src/           # Requiere npm install y npm run dev
│       ├── index.js
│       └── routes/
└── database/         # Capa de Datos
    └── data/         # No requiere ejecución
        └── db.json
```

## Pruebas Básicas
1. Verificar que el backend esté corriendo (http://localhost:3000/api/data debería mostrar los datos)
2. Abrir el frontend en el navegador (http://localhost:8080)
3. Navegar a la sección de turnos para ver el turno de ejemplo

## Solución de Problemas
- Si el backend no inicia:
  * Verificar que estás en la carpeta correcta (tres-capas/backend)
  * Verificar que ejecutaste `npm install`
  * Verificar que el puerto 3000 esté libre
- Si el frontend no carga:
  * Verificar que el servidor web simple está corriendo
  * Verificar que el puerto 8080 esté libre 