const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión simple
app.use(session({
    secret: 'clave_super_secreta',
    resave: false,
    saveUninitialized: true
}));

// Rutas
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const professionalRoutes = require('./routes/professionalRoutes');

app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/professionals', professionalRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!' });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
}); 