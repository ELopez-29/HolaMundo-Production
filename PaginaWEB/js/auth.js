//Carpeta Js
//auth
// Espera a que todo el contenido del DOM se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3001/api'; // URL de la API para la autenticación

    // --- LÓGICA PARA LA PÁGINA DE LOGIN (INDEX.HTML) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Maneja el envío del formulario
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Previene que el formulario se envíe de la forma tradicional

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');

            try {
                // Realiza la solicitud a la API para autenticar al usuario
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Login exitoso
                    console.log('Login exitoso');
                    errorMessage.textContent = '';

                    // Guarda la información de sesión en sessionStorage
                    const sessionData = {
                        username: data.user.username,
                        image: data.user.image,
                        loggedIn: true,
                        loginTime: new Date().getTime()
                    };
                    sessionStorage.setItem('userSession', JSON.stringify(sessionData));

                    // Redirige al dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    // Mensaje de error si las credenciales son incorrectas
                    errorMessage.textContent = data.error || 'Usuario o contraseña incorrectos.';
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                errorMessage.textContent = 'Error de conexión con el servidor.'; // Mensaje de error de conexión
            }
        });
    }

    // --- LÓGICA PARA LA PÁGINA PROTEGIDA (DASHBOARD.HTML) ---
    const usernameDisplay = document.getElementById('usernameDisplay');
    const userImageDisplay = document.getElementById('userImageDisplay');
    const logoutButton = document.getElementById('logoutButton');

    if (usernameDisplay && logoutButton) {
        // Obtenemos los datos de la sesión guardados
        const sessionData = JSON.parse(sessionStorage.getItem('userSession'));

        // Si hay datos de sesión, mostramos el nombre de usuario
        if (sessionData && sessionData.loggedIn) {
            usernameDisplay.textContent = sessionData.username;

            // Mostrar la imagen de perfil del usuario
            if (userImageDisplay) {
                userImageDisplay.src = sessionData.image;
                userImageDisplay.alt = `Foto de ${sessionData.username}`;
            }
        } else {
            // Redirige a la página de inicio si no hay sesión activa
            window.location.href = 'index.html';
        }

        // Funcionalidad del botón de cerrar sesión
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('userSession'); // Limpia la sesión del sessionStorage
            console.log('Sesión cerrada.');
            window.location.href = 'index.html'; // Redirige al inicio
        });
    }
});
