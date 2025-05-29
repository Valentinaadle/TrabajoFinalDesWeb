# Sistema de Reservas para Profesionales

Este proyecto es un sistema de reservas de citas para profesionales, desarrollado como parte de un trabajo final de desarrollo web. El sistema permite la gestión de citas entre pacientes y profesionales, incluyendo la confirmación y cancelación de turnos.

## Características

- Gestión de usuarios (pacientes y profesionales)
- Sistema de reserva de turnos
- Confirmación y cancelación de citas
- Panel administrativo
- Almacenamiento de datos en JSON

## Tecnologías Utilizadas

- Node.js
- Express.js
- JavaScript
- JSON para almacenamiento de datos

## Estructura del Proyecto

```
src/
├── app.js              # Punto de entrada de la aplicación
├── data/
│   └── db.json         # Base de datos JSON
├── models/
│   └── DataModel.js    # Modelo para manejo de datos
├── controllers/
│   └── appointment.controller.js  # Controlador de citas
└── routes/
    └── appointment.routes.js      # Rutas de la API
```

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear archivo .env con las variables de entorno necesarias
4. Iniciar el servidor:
   ```bash
   npm run dev
   ```

## API Endpoints

### Citas
- GET /api/appointments - Obtener todas las citas
- POST /api/appointments - Crear una nueva cita
- PUT /api/appointments/:id - Actualizar una cita
- DELETE /api/appointments/:id - Eliminar una cita

## Próximos Pasos

- Implementar autenticación de usuarios
- Agregar validación de datos
- Implementar el panel administrativo
- Migrar a arquitectura de tres capas 