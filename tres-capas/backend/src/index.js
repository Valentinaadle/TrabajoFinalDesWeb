const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Ruta para autenticación
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const dbPath = path.join(__dirname, '../../database/data/db.json');
        const data = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        
        const usuario = data.usuarios.find(u => u.email === email && u.password === password);
        
        if (usuario) {
            // En un sistema real, aquí generaríamos un JWT
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

// Ruta para obtener datos del JSON
app.get('/api/data', async (req, res) => {
    try {
        const dbPath = path.join(__dirname, '../../database/data/db.json');
        const data = await fs.readFile(dbPath, 'utf8');
        res.json(JSON.parse(data));
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
        res.json(data.profesionales);
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

// Puerto y inicio del servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 