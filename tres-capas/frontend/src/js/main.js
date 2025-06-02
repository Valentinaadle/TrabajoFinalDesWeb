// Manejo de navegación
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos DOM
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const btnLogin = document.getElementById('btnLogin');
    const modalLogin = document.getElementById('modalLogin');
    const loginForm = document.getElementById('loginForm');
    const btnRegistro = document.getElementById('btnRegistro');

    // Función para mostrar una página y ocultar las demás
    function showPage(pageId) {
        // Ocultar todas las páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Mostrar la página seleccionada
        const selectedPage = document.getElementById(pageId);
        if (selectedPage) {
            selectedPage.classList.add('active');
            
            // Cargar datos específicos de la página
            if (pageId === 'profesionales') {
                profesionales.cargarProfesionales();
            } else if (pageId === 'turnos') {
                turnos.cargarTurnos();
            }
        }
    }

    // Event listeners para navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(link.dataset.page);
        });
    });

    // También manejar los botones que tienen data-page
    document.querySelectorAll('button[data-page]').forEach(button => {
        button.addEventListener('click', () => {
            showPage(button.dataset.page);
        });
    });

    // Manejo del modal de login
    btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        if (auth.isAuthenticated) {
            auth.logout();
        } else {
            modalLogin.style.display = 'block';
        }
    });

    // Cerrar modal al hacer click fuera
    window.onclick = (e) => {
        if (e.target === modalLogin) {
            modalLogin.style.display = 'none';
        }
    };

    // Manejar envío del formulario de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const success = await auth.login(email, password);
            if (success) {
                modalLogin.style.display = 'none';
                loginForm.reset();
            }
        } catch (error) {
            mostrarError('Error al iniciar sesión: ' + error.message);
        }
    });

    // Manejar click en botón de registro
    btnRegistro.addEventListener('click', () => {
        // Aquí podrías mostrar un modal de registro o navegar a una página de registro
        console.log('Implementar registro');
    });

    // Función para mostrar mensajes de error
    function mostrarError(mensaje) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensaje;
        
        // Insertar el mensaje en el formulario
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Inicialización
    auth.init(); // Inicializar estado de autenticación
    showPage('home');
}); 