//Carpeta Js
//auth
// Espera a que todo el contenido del DOM se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3001/api'; // URL de la API para la autenticación

    // --- LÓGICA PARA LA PÁGINA DE REGISTRO ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Maneja el envío del formulario de registro
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Previene que el formulario se envíe de la forma tradicional

            const username = document.getElementById('newUsername').value;
            const password = document.getElementById('newPassword').value;
            const image = document.getElementById('userImage').value;
            const registerMessage = document.getElementById('registerMessage');

            try {
                // Realiza la solicitud a la API para registrar al usuario
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, image })
                });

                const data = await response.json();

                if (data.success) {
                    // Registro exitoso
                    console.log('Registro exitoso');
                    registerMessage.textContent = 'Usuario registrado exitosamente. Puedes iniciar sesión ahora.';
                } else {
                    // Mensaje de error si el registro falla
                    registerMessage.textContent = data.error || 'Error al registrar el usuario.';
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                registerMessage.textContent = 'Error de conexión con el servidor.'; // Mensaje de error de conexión
            }
        });
    }
});
