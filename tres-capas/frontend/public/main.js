const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const loginSection = document.getElementById('loginSection');
    const loginForm = document.getElementById('loginForm');
    const loginMsg = document.getElementById('loginMsg');
    const patientSection = document.getElementById('patientSection');
    const professionalSection = document.getElementById('professionalSection');
    const adminSection = document.getElementById('adminSection');
    const patientName = document.getElementById('patientName');
    const professionalName = document.getElementById('professionalName');
    const professionalSelect = document.getElementById('professionalSelect');
    const appointmentForm = document.getElementById('appointmentForm');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const myAppointments = document.getElementById('myAppointments');
    const professionalAppointments = document.getElementById('professionalAppointments');
    const adminName = document.getElementById('adminName');
    const allAppointments = document.getElementById('allAppointments');
    const logoutBtn1 = document.getElementById('logoutBtn1');
    const logoutBtn2 = document.getElementById('logoutBtn2');
    const logoutBtn3 = document.getElementById('logoutBtn3');

    let currentUser = null;
    let usuarios = [];
    let profesionales = [];

    // Login
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.user) {
            currentUser = data.user;
            loginSection.style.display = 'none';
            if (currentUser.rol === 'paciente') showPatient();
            else if (currentUser.rol === 'profesional') showProfessional();
            else if (currentUser.rol === 'admin') showAdmin();
        } else {
            loginMsg.textContent = data.error || 'Credenciales inválidas';
        }
    };

    // Paciente
    async function showPatient() {
        patientSection.style.display = '';
        patientName.textContent = currentUser.nombre;
        // Listar profesionales en el select
        const res = await fetch(`${API_URL}/profesionales`);
        profesionales = await res.json();
        professionalSelect.innerHTML = profesionales.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
        loadMyAppointments();
    }
    appointmentForm.onsubmit = async (e) => {
        e.preventDefault();
        const profesionalId = professionalSelect.value;
        const fecha = dateInput.value;
        const hora = timeInput.value;
        // Unimos fecha y hora en formato ISO
        const fechaHora = `${fecha}T${hora}`;
        await fetch(`${API_URL}/turnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pacienteId: currentUser.pacienteId, profesionalId, fecha: fechaHora, consultorio: 'A1', estado: 'PENDIENTE' })
        });
        alert('Turno solicitado');
        loadMyAppointments();
    };
    async function loadMyAppointments() {
        const res = await fetch(`${API_URL}/turnos`);
        const turnos = await res.json();
        const misTurnos = turnos.filter(t => t.pacienteId == currentUser.pacienteId);
        myAppointments.innerHTML = misTurnos.map(a =>
            `<li>
                ${a.fecha} con profesional #${a.profesionalId} - Estado: ${a.estado}
                ${(a.estado === 'PENDIENTE' || a.estado === 'CONFIRMADO') ? `<button class='btn btn-sm btn-danger' onclick='window.cancelarTurno(${a.id})'>Cancelar</button>` : ''}
            </li>`
        ).join('');
    }
    window.cancelarTurno = async (id) => {
        await fetch(`${API_URL}/turnos/${id}`, { method: 'DELETE' });
        loadMyAppointments();
    };

    // Profesional
    async function showProfessional() {
        professionalSection.style.display = '';
        professionalName.textContent = currentUser.nombre;
        loadProfessionalAppointments();
    }
    async function loadProfessionalAppointments() {
        // Obtengo turnos y usuarios
        const [turnosRes, usuariosRes] = await Promise.all([
            fetch(`${API_URL}/turnos`),
            fetch(`${API_URL}/data`)
        ]);
        const turnos = await turnosRes.json();
        const data = await usuariosRes.json();
        const usuarios = data.usuarios || [];
        const misTurnos = turnos.filter(t => t.profesionalId == currentUser.id);
        professionalAppointments.innerHTML = misTurnos.map(a => {
            const paciente = usuarios.find(u => u.id == a.pacienteId);
            let acciones = '';
            if (a.estado === 'PENDIENTE') {
                acciones = `<button class='btn btn-sm btn-success' onclick='window.confirmarTurno(${a.id})'>Confirmar</button> `;
            }
            if (a.estado === 'PENDIENTE' || a.estado === 'CONFIRMADO') {
                acciones += `<button class='btn btn-sm btn-danger' onclick='window.cancelarTurnoProf(${a.id})'>Cancelar</button>`;
            }
            return `<li>${a.fecha} con paciente ${paciente ? paciente.nombre : '#'+a.pacienteId} - Estado: ${a.estado} ${acciones}</li>`;
        }).join('');
    }
    window.confirmarTurno = async (id) => {
        await fetch(`${API_URL}/turnos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'CONFIRMADO' })
        });
        loadProfessionalAppointments();
        if (currentUser.rol === 'admin') loadAllAppointments();
    };
    window.cancelarTurnoProf = async (id) => {
        await fetch(`${API_URL}/turnos/${id}`, { method: 'DELETE' });
        loadProfessionalAppointments();
        if (currentUser.rol === 'admin') loadAllAppointments();
    };

    // Admin
    async function showAdmin() {
        adminSection.style.display = '';
        adminName.textContent = currentUser.nombre;
        await loadAllAppointments();
    }
    async function loadAllAppointments() {
        const [turnosRes, usuariosRes, profesionalesRes] = await Promise.all([
            fetch(`${API_URL}/turnos`),
            fetch(`${API_URL}/data`),
            fetch(`${API_URL}/profesionales`)
        ]);
        const turnos = await turnosRes.json();
        const data = await usuariosRes.json();
        const usuarios = data.usuarios || [];
        const profesionales = await profesionalesRes.json();
        allAppointments.innerHTML = turnos.map(a => {
            const paciente = usuarios.find(u => u.pacienteId == a.pacienteId);
            const profesional = profesionales.find(p => p.id == a.profesionalId);
            return `<li>
                ${a.fecha} - Paciente: ${paciente ? paciente.nombre : 'Desconocido'} - Profesional: ${profesional ? profesional.nombre : 'Desconocido'} - Estado: ${a.estado}
                ${a.estado === 'PENDIENTE' ? `<button class='btn btn-sm btn-success' onclick='window.adminConfirmarTurno(${a.id})'>Confirmar</button> ` : ''}
                ${(a.estado === 'PENDIENTE' || a.estado === 'CONFIRMADO') ? `<button class='btn btn-sm btn-danger' onclick='window.adminCancelarTurno(${a.id})'>Cancelar</button>` : ''}
            </li>`;
        }).join('');
    }
    window.adminConfirmarTurno = async (id) => {
        await fetch(`${API_URL}/turnos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'CONFIRMADO' })
        });
        loadAllAppointments();
    };
    window.adminCancelarTurno = async (id) => {
        await fetch(`${API_URL}/turnos/${id}`, { method: 'DELETE' });
        loadAllAppointments();
    };

    // Logout
    logoutBtn1.onclick = logoutBtn2.onclick = logoutBtn3.onclick = () => {
        location.reload();
    };
}); 