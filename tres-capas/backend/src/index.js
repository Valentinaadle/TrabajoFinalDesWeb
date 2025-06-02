const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend simple
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Rutas API
const turnoRoutes = require('./routes/turnoRoutes');
const profesionalRoutes = require('./routes/profesionalRoutes');

app.use('/api/turnos', turnoRoutes);
app.use('/api/profesionales', profesionalRoutes);

// Ruta para autenticación
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const dbService = require('./services/dbService');
        const usuarios = await dbService.getUsuarios();
        const usuario = usuarios.find(u => u.email === email && u.password === password);
        if (usuario) {
            res.json({
                user: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                },
                token: 'token-de-prueba'
            });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para obtener todos los datos (usuarios y turnos)
app.get('/api/data', async (req, res) => {
    try {
        const dbService = require('./services/dbService');
        const data = await dbService.readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos' });
    }
});

// Ruta para obtener turnos
app.get('/api/turnos', async (req, res) => {
    try {
        const dbPath = path.join(__dirname, '../../database/data/db.json');
        const data = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        res.json(data.turnos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los turnos' });
    }
});

// Ruta para obtener profesionales
app.get('/api/profesionales', async (req, res) => {
    try {
        const dbPath = path.join(__dirname, '../../database/data/db.json');
        const data = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        const profesionales = data.usuarios.filter(u => u.rol === 'profesional');
        res.json(profesionales);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los profesionales' });
    }
});

// Ruta para actualizar un turno
app.put('/api/turnos/:id', async (req, res) => {
    try {
        const dbPath = path.join(__dirname, '../../database/data/db.json');
        const data = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        
        const turnoIndex = data.turnos.findIndex(t => t.id === parseInt(req.params.id));
        if (turnoIndex === -1) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        data.turnos[turnoIndex] = { ...data.turnos[turnoIndex], ...req.body };
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
        
        res.json(data.turnos[turnoIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el turno' });
    }
});

// Ruta para cancelar un turno
app.delete('/api/turnos/:id', async (req, res) => {
    try {
        const dbPath = path.join(__dirname, '../../database/data/db.json');
        const data = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        
        const turnoIndex = data.turnos.findIndex(t => t.id === parseInt(req.params.id));
        if (turnoIndex === -1) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        data.turnos.splice(turnoIndex, 1);
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
        
        res.json({ message: 'Turno cancelado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cancelar el turno' });
    }
});

// Redirigir cualquier otra ruta al index.html del frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error en el servidor' });
});

// Puerto y inicio del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 