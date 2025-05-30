const dataModel = require('../models/DataModel');
const bcrypt = require('bcryptjs');

class UserController {
    async register(req, res) {
        try {
            const { email, password, name, role } = req.body;
            const users = await dataModel.getCollection('users');
            if (users.find(user => user.email === email)) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = {
                id: Date.now(),
                email,
                password: hashedPassword,
                name,
                role: role || 'patient'
            };
            const newUser = await dataModel.addToCollection('users', user);
            res.status(201).json({ message: 'Usuario registrado correctamente', user: { ...newUser, password: undefined } });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el usuario' });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        const users = await dataModel.getCollection('users');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            req.session.user = { id: user.id, name: user.name, role: user.role };
            res.json({ success: true, user: req.session.user });
        } else {
            res.json({ success: false, message: 'Credenciales incorrectas' });
        }
    }

    async logout(req, res) {
        req.session.destroy();
        res.json({ success: true });
    }

    async getProfessionals(req, res) {
        const users = await dataModel.getCollection('users');
        res.json(users.filter(u => u.role === 'professional'));
    }
}

module.exports = new UserController(); 