# Sistema de Reservas para Profesionales - Arquitectura de Tres Capas

Este proyecto es una migración del sistema monolítico original a una arquitectura de tres capas.

## Estructura del Proyecto

```
tres-capas/
├── frontend/           # Capa de Presentación
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       └── styles/
│
├── backend/           # Capa de Negocio
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       └── middleware/
│
└── database/         # Capa de Datos
    ├── models/
    ├── repositories/
    └── migrations/
```

## Tecnologías Utilizadas

### Frontend
- React 18
- Material-UI
- React Router
- Axios
- Formik + Yup

### Backend
- Node.js
- Express
- JWT
- Express-validator
- Express-session

### Base de Datos
- MongoDB
- Mongoose

## Instalación y Configuración

### Frontend
1. Navegar al directorio frontend: `cd frontend`
2. Instalar dependencias: `npm install`
3. Iniciar el servidor de desarrollo: `npm start`

### Backend
1. Navegar al directorio backend: `cd backend`
2. Instalar dependencias: `npm install`
3. Crear archivo .env con las variables de entorno necesarias
4. Iniciar el servidor: `npm run dev`

## División de Responsabilidades

### Vicki
- Frontend completo
- Controladores de pacientes
- Lógica de reservas
- Middleware de autenticación

### Compañera
- Modelos y repositorios
- Controladores de profesionales
- Gestión de agenda
- Configuración de base de datos

## Flujo de Trabajo Git

1. Crear una rama por feature
2. Hacer commits frecuentes y descriptivos
3. Crear Pull Requests para revisión
4. Merge a main después de revisión

## Variables de Entorno Necesarias

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sistema-reservas
JWT_SECRET=tu_secreto_jwt
SESSION_SECRET=tu_secreto_session
NODE_ENV=development
```

## Endpoints API

### Autenticación
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout

### Pacientes
- GET /api/pacientes
- POST /api/pacientes
- GET /api/pacientes/:id
- PUT /api/pacientes/:id

### Profesionales
- GET /api/profesionales
- POST /api/profesionales
- GET /api/profesionales/:id
- PUT /api/profesionales/:id

### Turnos
- GET /api/turnos
- POST /api/turnos
- GET /api/turnos/:id
- PUT /api/turnos/:id
- DELETE /api/turnos/:id 