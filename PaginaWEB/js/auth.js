//Carpeta Js
//auth
// Espera a que todo el contenido del DOM se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3001/api'; // URL de la API para la autenticación

    // --- LÓGICA PARA LA PÁGINA DE REGISTRO (register.html) ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Maneja el envío del formulario
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Previene que el formulario se envíe de la forma tradicional

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
                    // Registro exitoso
                    message.textContent = data.message;
                    errorMessage.textContent = '';

                    // Redirige a la página principal después de un breve retraso
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000); // 2 segundos de espera
                } else {
                    // Mensaje de error si hubo un problema
                    errorMessage.textContent = data.error || 'Error al registrar el usuario.';
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                errorMessage.textContent = 'Error de conexión con el servidor.'; // Mensaje de error de conexión
            }
        });
    }
});
