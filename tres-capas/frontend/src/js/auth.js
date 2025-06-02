// Funciones de autenticación
const auth = {
    isAuthenticated: false,
    currentUser: null,

    // Inicializar el estado de autenticación
    init() {
        const token = localStorage.getItem('token');
        if (token) {
            this.isAuthenticated = true;
            // TODO: Decodificar token para obtener información del usuario
        }
        this.updateUI();
    },

    // Iniciar sesión
    async login(email, password) {
        try {
            const response = await api.login({ email, password });
            this.isAuthenticated = true;
            this.currentUser = response.user;
            this.updateUI();
            return true;
        } catch (error) {
            console.error('Error de inicio de sesión:', error);
            return false;
        }
    },

    // Cerrar sesión
    logout() {
        api.logout();
        this.isAuthenticated = false;
        this.currentUser = null;
        this.updateUI();
    },

    // Actualizar la UI basada en el estado de autenticación
    updateUI() {
        const btnLogin = document.getElementById('btnLogin');
        const loginForm = document.getElementById('loginForm');
        const modalLogin = document.getElementById('modalLogin');

        if (this.isAuthenticated) {
            btnLogin.textContent = 'Cerrar Sesión';
            btnLogin.onclick = () => this.logout();
            document.querySelectorAll('.auth-required').forEach(el => {
                el.style.display = 'block';
            });
        } else {
            btnLogin.textContent = 'Iniciar Sesión';
            btnLogin.onclick = () => modalLogin.style.display = 'block';
            document.querySelectorAll('.auth-required').forEach(el => {
                el.style.display = 'none';
            });
        }
    }
};

// Configurar eventos de autenticación
document.addEventListener('DOMContentLoaded', () => {
    const modalLogin = document.getElementById('modalLogin');
    const loginForm = document.getElementById('loginForm');

    // Inicializar estado de autenticación
    auth.init();

    // Manejar envío del formulario de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (await auth.login(email, password)) {
            modalLogin.style.display = 'none';
            loginForm.reset();
        } else {
            alert('Error de inicio de sesión');
        }
    });

    // Cerrar modal al hacer clic fuera
    window.onclick = (e) => {
        if (e.target === modalLogin) {
            modalLogin.style.display = 'none';
        }
    };
});

// Exponer el objeto auth globalmente
window.auth = auth; 