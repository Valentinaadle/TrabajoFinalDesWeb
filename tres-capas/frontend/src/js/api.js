// Configuración de la API
const API_URL = 'http://localhost:3001/api';

// Funciones de la API
const api = {
    // Autenticación
    async login(credentials) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    logout() {
        localStorage.removeItem('token');
    },

    // Turnos
    async getTurnos() {
        const response = await fetch(`${API_URL}/turnos`, {
            headers: this.getHeaders()
        });
        if (!response.ok) {
            throw new Error('Error al obtener turnos');
        }
        return response.json();
    },

    async cancelarTurno(id) {
        const response = await fetch(`${API_URL}/turnos/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        if (!response.ok) {
            throw new Error('Error al cancelar turno');
        }
        return response.json();
    },

    // Profesionales
    async getProfesionales() {
        const response = await fetch(`${API_URL}/profesionales`, {
            headers: this.getHeaders()
        });
        if (!response.ok) {
            throw new Error('Error al obtener profesionales');
        }
        return response.json();
    },

    // Pacientes
    async getPaciente(id) {
        const response = await fetch(`${API_URL}/pacientes/${id}`, {
            headers: this.getHeaders()
        });
        return handleError(response);
    },

    async actualizarPaciente(id, data) {
        const response = await fetch(`${API_URL}/pacientes/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        return handleError(response);
    },

    // Profesionales
    async getProfesional(id) {
        const response = await fetch(`${API_URL}/profesionales/${id}`, {
            headers: this.getHeaders()
        });
        return handleError(response);
    },

    // Turnos
    async crearTurno(turnoData) {
        const response = await fetch(`${API_URL}/turnos`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(turnoData)
        });
        return handleError(response);
    },

    async actualizarTurno(id, turnoData) {
        const response = await fetch(`${API_URL}/turnos/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(turnoData)
        });
        return handleError(response);
    },

    // Helpers
    getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }
};

// Exponer el objeto api globalmente
window.api = api; 