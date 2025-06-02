# Sistema de Reservas para Profesionales - Arquitectura de Tres Capas

Este proyecto es el resultado de la migración de un sistema monolítico a una arquitectura de tres capas, utilizando Node.js, Express y almacenamiento en archivos JSON. El objetivo fue mejorar la mantenibilidad, escalabilidad y claridad del sistema.

---

## Justificación de la Migración

### Arquitectura Monolítica (Antes)
- Todo el código (frontend, backend, lógica y datos) estaba mezclado en pocos archivos.
- Dificultad para mantener, escalar y testear.
- Lógica duplicada y acoplamiento alto.

### Arquitectura en Tres Capas (Después)
- **Capa de Presentación:** `/frontend/public` (HTML, CSS, JS vanilla)
- **Capa de Negocio:** `/backend/src` (rutas, controladores, servicios)
- **Capa de Datos:** `/database/data/db.json` (almacenamiento en JSON)

**Beneficios:**
- Separación clara de responsabilidades.
- Mejor mantenibilidad y escalabilidad.
- Código más limpio y fácil de entender.

---

## Estructura Final del Proyecto

```
tres-capas/
├── frontend/
│   └── public/
│       ├── index.html
│       ├── main.js
│       └── styles.css
│
├── backend/
│   └── src/
│       ├── index.js            # Punto de entrada, monta middlewares y rutas
│       ├── controllers/
│       │   ├── turnoController.js
│       │   └── profesionalController.js
│       ├── routes/
│       │   ├── turnoRoutes.js
│       │   └── profesionalRoutes.js
│       └── services/
│           └── dbService.js
│
└── database/
    └── data/
        └── db.json
```

---

## Detalle de la migración: ¿Qué archivos se adaptaron y cómo?

### 1. **Frontend (Presentación)**
- **Antes (Monolito):**
  - `monolito/src/public/index.html`, `app.js`, `styles.css`: Todo el frontend y la lógica estaban juntos, con llamadas directas a rutas del backend monolítico.
- **Después (Tres Capas):**
  - `tres-capas/frontend/public/index.html`, `main.js`, `styles.css`:  
    - Se migró la estructura visual y la lógica de vistas (login, paciente, profesional, admin) a estos archivos.
    - Se adaptaron las llamadas a la nueva API RESTful.
    - Se mejoró la separación de responsabilidades: solo presentación y manejo de eventos.

### 2. **Backend (Negocio)**
- **Antes (Monolito):**
  - Rutas, controladores y lógica de negocio estaban mezclados en archivos como `monolito/src/app.js`, `routes/`, `controllers/`.
  - Ejemplo: `appointmentController.js`, `userController.js`, etc.
- **Después (Tres Capas):**
  - **Rutas:**  
    - `tres-capas/backend/src/routes/turnoRoutes.js` y `profesionalRoutes.js`  
      → Definen los endpoints y delegan en los controladores.
  - **Controladores:**  
    - `tres-capas/backend/src/controllers/turnoController.js` y `profesionalController.js`  
      → Implementan la lógica de negocio, validan datos y llaman a los servicios.
  - **Servicios:**  
    - `tres-capas/backend/src/services/dbService.js`  
      → Encapsula el acceso a los datos (lectura/escritura de JSON).
  - **index.js:**  
    - Solo monta middlewares y rutas, sin lógica de negocio.

### 3. **Base de Datos (Datos)**
- **Antes (Monolito):**
  - `monolito/src/data/db.json`:  
    - Estructura simple en JSON.
- **Después (Tres Capas):**
  - `tres-capas/database/data/db.json`:  
    - Un solo array de usuarios con un campo `rol` (`paciente`, `profesional`, `admin`).
    - Un solo array de turnos, referenciando por ID a los usuarios.

---

### Ejemplo de Adaptación

- **Lógica de login y vistas:**  
  - Antes: En `monolito/src/public/app.js` se hacía todo (login, mostrar vistas, manejar turnos).
  - Después: En `tres-capas/frontend/public/main.js` se separó la lógica de presentación y se adaptaron las llamadas a la nueva API.

- **Gestión de turnos:**  
  - Antes: Controladores y rutas mezclados (`appointmentController.js`, `appointmentRoutes.js`).
  - Después:  
    - Rutas (`turnoRoutes.js`) → Controlador (`turnoController.js`) → Servicio (`dbService.js`).

- **Obtención de profesionales:**  
  - Antes: `/api/users/professionals` en el monolito.
  - Después: `/api/profesionales` en la nueva API, usando la capa de servicios para filtrar por rol.

---

## ¿Cómo se adaptó cada archivo?

- **Frontend:**
  - Todo el frontend es HTML, CSS y JS puro en `/public`.
  - `main.js` maneja la lógica de login, turnos y vistas según el rol.
- **Backend:**
  - `index.js` solo monta middlewares y rutas.
  - Las rutas (`routes/`) llaman a controladores (`controllers/`).
  - Los controladores usan el servicio de datos (`services/dbService.js`).
  - Toda la lógica de negocio y acceso a datos está separada.
- **Base de datos:**
  - Un solo archivo `db.json` con usuarios y turnos.

---

## Cómo correr el sistema

1. **Instalar dependencias del backend:**
   ```bash
   cd tres-capas/backend
   npm install
   ```
2. **Iniciar el backend:**
   ```bash
   npm start
   ```
3. **Abrir el sistema:**
   - Accede a `http://localhost:3001` en tu navegador.
   - El frontend se sirve automáticamente desde el backend.

---

## Ejemplo de usuarios para login

- **Paciente:**
  - Email: juan@email.com
  - Contraseña: 123456
- **Profesional:**
  - Email: maria@email.com
  - Contraseña: prof1
- **Administrador:**
  - Email: valentina.adle@email.com
  - Contraseña: admin1

Puedes agregar más usuarios editando `db.json`.

---

## Decisión arquitectónica y migración

- Se migró de un sistema monolítico (todo junto) a una arquitectura de tres capas para separar responsabilidades y facilitar el mantenimiento.
- Se unificó la base de datos en un solo archivo JSON, eliminando referencias cruzadas innecesarias.
- El backend ahora sigue el patrón rutas → controladores → servicios → datos.
- El frontend es simple, sin dependencias, y consume la API del backend.

---

## Conclusión

La migración a una arquitectura de tres capas permitió un sistema más limpio, mantenible y escalable. Cada capa tiene una responsabilidad clara y el código es mucho más fácil de entender y modificar. 