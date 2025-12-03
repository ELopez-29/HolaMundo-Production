//Carpeta Js
//auth
// Espera a que todo el contenido del DOM se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3001/api'; // URL de la API para la autenticación

    // --- LÓGICA PARA LA PÁGINA DE REGISTRO (register.html) ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Previene el envío del formulario

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const message = document.getElementById('message');
            const errorMessage = document.getElementById('errorMessage');

            // Verifica que las contraseñas coincidan
            if (password !== confirmPassword) {
                errorMessage.textContent = 'Las contraseñas no coinciden.';
                return;
            }

            try {
                // Realiza la solicitud a la API para registrar al usuario
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    message.textContent = data.message;
                    errorMessage.textContent = '';

                    // Redirige a la página principal después de un breve retraso
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000); // 2 segundos de espera
                } else {
                    errorMessage.textContent = data.error || 'Error al registrar el usuario.';
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                errorMessage.textContent = 'Error de conexión con el servidor.';
            }
        });
    }

    // --- LÓGICA PARA LA PÁGINA DE INICIO DE SESIÓN (index.html) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Previene el envío del formulario

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
                    errorMessage.textContent = data.error || 'Usuario o contraseña incorrectos.';
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                errorMessage.textContent = 'Error de conexión con el servidor.';
            }
        });
    }
});
