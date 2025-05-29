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

    // Login
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            currentUser = data.user;
            loginSection.style.display = 'none';
            if (currentUser.role === 'patient') showPatient();
            else if (currentUser.role === 'professional') showProfessional();
            else if (currentUser.role === 'admin') showAdmin();
        } else {
            loginMsg.textContent = data.message;
        }
    };

    // Paciente
    async function showPatient() {
        patientSection.style.display = '';
        patientName.textContent = currentUser.name;
        // Listar profesionales en el select
        const res = await fetch('/api/users/professionals');
        const professionals = await res.json();
        professionalSelect.innerHTML = professionals.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        loadMyAppointments();
    }
    appointmentForm.onsubmit = async (e) => {
        e.preventDefault();
        const professionalId = professionalSelect.value;
        const date = dateInput.value;
        const time = timeInput.value;
        await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientId: currentUser.id, professionalId, date, time })
        });
        alert('Turno solicitado');
        loadMyAppointments();
    };
    async function loadMyAppointments() {
        const res = await fetch(`/api/appointments/patient/${currentUser.id}`);
        const appointments = await res.json();
        myAppointments.innerHTML = appointments.map(a =>
            `<li>
                ${a.date} ${a.time} con profesional #${a.professionalId} - Estado: ${a.status}
                ${(a.status === 'pendiente' || a.status === 'confirmado') ? `<button class='btn btn-sm btn-danger' onclick='window.cancelarTurno(${a.id})'>Cancelar</button>` : ''}
            </li>`
        ).join('');
    }
    window.cancelarTurno = async (id) => {
        await fetch(`/api/appointments/${id}/cancel`, { method: 'PUT' });
        loadMyAppointments();
    };

    // Profesional
    async function showProfessional() {
        professionalSection.style.display = '';
        professionalName.textContent = currentUser.name;
        loadProfessionalAppointments();
    }
    async function loadProfessionalAppointments() {
        const res = await fetch(`/api/appointments/professional/${currentUser.id}`);
        const appointments = await res.json();
        professionalAppointments.innerHTML = appointments.map(a => `<li>${a.date} ${a.time} con paciente #${a.patientId} - Estado: ${a.status} ${a.status === 'pendiente' ? `<button class='btn btn-sm btn-success' onclick='window.confirmarTurno(${a.id})'>Confirmar</button> <button class='btn btn-sm btn-danger' onclick='window.cancelarTurnoProf(${a.id})'>Cancelar</button>` : ''}</li>`).join('');
    }
    window.confirmarTurno = async (id) => {
        await fetch(`/api/appointments/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'confirmado' })
        });
        loadProfessionalAppointments();
        if (currentUser.role === 'admin') loadAllAppointments();
    };
    window.cancelarTurnoProf = async (id) => {
        await fetch(`/api/appointments/${id}/cancel`, { method: 'PUT' });
        loadProfessionalAppointments();
        if (currentUser.role === 'admin') loadAllAppointments();
    };

    // Admin
    function showAdmin() {
        adminSection.style.display = '';
        adminName.textContent = currentUser.name;
        loadAllAppointments();
    }
    async function loadAllAppointments() {
        // Obtener turnos y usuarios
        const [appointmentsRes, usersRes] = await Promise.all([
            fetch('/api/appointments'),
            fetch('/api/users')
        ]);
        const appointments = await appointmentsRes.json();
        const allUsers = await usersRes.json();

        allAppointments.innerHTML = appointments.map(a => {
            const paciente = allUsers.find(u => u.id == a.patientId);
            const profesional = allUsers.find(u => u.id == a.professionalId);
            return `<li>
                ${a.date} ${a.time} - Paciente: ${paciente ? paciente.name : 'Desconocido'} - Profesional: ${profesional ? profesional.name : 'Desconocido'} - Estado: ${a.status}
                ${a.status === 'pendiente' ? `<button class='btn btn-sm btn-success' onclick='window.adminConfirmarTurno(${a.id})'>Confirmar</button> ` : ''}
                ${(a.status === 'pendiente' || a.status === 'confirmado') ? `<button class='btn btn-sm btn-danger' onclick='window.adminCancelarTurno(${a.id})'>Cancelar</button>` : ''}
            </li>`;
        }).join('');
    }
    window.adminConfirmarTurno = async (id) => {
        await fetch(`/api/appointments/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'confirmado' })
        });
        loadAllAppointments();
    };
    window.adminCancelarTurno = async (id) => {
        await fetch(`/api/appointments/${id}/cancel`, { method: 'PUT' });
        loadAllAppointments();
    };

    // Logout
    logoutBtn1.onclick = logoutBtn2.onclick = logoutBtn3.onclick = async () => {
        await fetch('/api/users/logout', { method: 'POST' });
        location.reload();
    };
});