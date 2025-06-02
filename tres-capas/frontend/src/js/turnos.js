// Objeto para manejar la funcionalidad de turnos
const turnos = {
    lista: [],

    // Cargar turnos desde la API
    async cargarTurnos() {
        try {
            this.lista = await api.getTurnos();
            this.mostrarTurnos();
        } catch (error) {
            console.error('Error al cargar turnos:', error);
        }
    },

    // Mostrar turnos en la UI
    mostrarTurnos() {
        const container = document.getElementById('listaTurnos');
        if (!container) return;

        if (this.lista.length === 0) {
            container.innerHTML = '<p>No hay turnos registrados</p>';
            return;
        }

        container.innerHTML = this.lista.map(turno => `
            <div class="turno-card">
                <h3>Turno #${turno.id}</h3>
                <p>Fecha: ${new Date(turno.fecha).toLocaleString()}</p>
                <p>Estado: ${turno.estado}</p>
                <p>Consultorio: ${turno.consultorio}</p>
                <button class="btn secondary" onclick="turnos.cancelarTurno(${turno.id})">
                    Cancelar Turno
                </button>
            </div>
        `).join('');
    },

    // Cancelar un turno
    async cancelarTurno(turnoId) {
        if (!auth.isAuthenticated) {
            alert('Debe iniciar sesión para cancelar un turno');
            return;
        }

        if (confirm('¿Está seguro que desea cancelar este turno?')) {
            try {
                await api.cancelarTurno(turnoId);
                await this.cargarTurnos(); // Recargar la lista
                alert('Turno cancelado exitosamente');
            } catch (error) {
                console.error('Error al cancelar turno:', error);
                alert('Error al cancelar el turno');
            }
        }
    }
};

// Exponer el objeto turnos globalmente
window.turnos = turnos; 