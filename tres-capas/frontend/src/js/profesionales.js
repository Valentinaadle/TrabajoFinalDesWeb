// Funciones para manejar profesionales
const profesionales = {
    lista: [],

    // Cargar profesionales desde la API
    async cargarProfesionales() {
        try {
            this.lista = await api.getProfesionales();
            this.mostrarProfesionales();
        } catch (error) {
            console.error('Error al cargar profesionales:', error);
        }
    },

    // Mostrar profesionales en la UI
    mostrarProfesionales() {
        const container = document.getElementById('listaProfesionales');
        if (!container) return;

        container.innerHTML = this.lista.map(prof => `
            <div class="profesional-card">
                <h3>${prof.nombre}</h3>
                <p>Especialidad: ${prof.especialidad}</p>
                <p>Horarios: ${prof.horarios}</p>
                <button class="btn primary" onclick="profesionales.reservarTurno(${prof.id})">
                    Reservar Turno
                </button>
            </div>
        `).join('');
    },

    // Reservar turno con un profesional
    async reservarTurno(profesionalId) {
        if (!auth.isAuthenticated) {
            alert('Debe iniciar sesión para reservar un turno');
            return;
        }

        const profesional = this.lista.find(p => p.id === profesionalId);
        if (!profesional) return;

        // TODO: Implementar lógica de reserva de turno
        alert(`Reservando turno con ${profesional.nombre}`);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar profesionales cuando se muestre la página correspondiente
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.dataset.page === 'profesionales') {
                profesionales.cargarProfesionales();
            }
        });
    });

    // Cargar profesionales si estamos en la página de profesionales
    if (document.querySelector('#profesionales.active')) {
        profesionales.cargarProfesionales();
    }
});

// Exponer el objeto profesionales globalmente
window.profesionales = profesionales; 