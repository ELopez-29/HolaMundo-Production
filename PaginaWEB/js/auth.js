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

    // --- LÓGICA PARA LA PÁGINA DEL DASHBOARD (dashboard.html) ---
    const sessionData = JSON.parse(sessionStorage.getItem('userSession'));
    const usernameDisplay = document.getElementById('usernameDisplay');
    const userImageDisplay = document.getElementById('userImageDisplay');
    const userDescription = document.getElementById('userDescription');
    const userUniqueContent = document.getElementById('userUniqueContent');
    const logoutButton = document.getElementById('logoutButton');

    // Perfiles de usuarios
    const userProfiles = {
        'Erik Lopez': {
            description: 'Desarrollador web y amante de la tecnología.',
            profileImage: 'IMG/Esdeath.gif',
            uniqueContent: '<p>Proyectos recientes: <ul><li>Proyecto A</li><li>Proyecto B</li></ul></p>'
        },
        'Sofia': {
            description: 'Diseñadora gráfica con pasión por el arte.',
            profileImage: 'IMG/Noche de baile.gif',
            uniqueContent: '<p>Portafolio de diseño: <a href="#">Ver Portafolio</a></p>'
        },
        'Mia': {
            description: 'Estudiante de ingeniería y entusiasta de la programación.',
            profileImage: 'IMG/dans.gif',
            uniqueContent: '<p>Proyectos académicos: <ul><li>Proyecto X</li><li>Proyecto Y</li></ul></p>'
        },
        'Zeus': {
            description: 'Líder de proyectos y experto en gestión.',
            profileImage: 'IMG/Zeus.gif',
            uniqueContent: '<p>Metodologías utilizadas: <strong>Agile, Scrum</strong></p>'
        },
        'Odin': {
            description: 'Analista de datos y científico de datos.',
            profileImage: 'IMG/Odin.gif',
            uniqueContent: '<p>Herramientas: <strong>Python, R, SQL</strong></p>'
        },
        'Ades': {
            description: 'Ingeniero de software y desarrollador backend.',
            profileImage: 'IMG/Hades.gif',
            uniqueContent: '<p>Lenguajes: <strong>Java, C#, Go</strong></p>'
        },
        'Ares': {
            description: 'Especialista en marketing digital y redes sociales.',
            profileImage: 'IMG/Ares.gif',
            uniqueContent: '<p>Estrategias: <strong>SEO, SEM</strong></p>'
        },
        'Apolo': {
            description: 'Músico y compositor, amante de la creatividad.',
            profileImage: 'IMG/Apolo.gif',
            uniqueContent: '<p>Último álbum: <strong>Sonidos del Alma</strong></p>'
        },
        'Atlas': {
            description: 'Arquitecto y diseñador urbano.',
            profileImage: 'IMG/Atlas.jpeg',
            uniqueContent: '<p>Proyectos destacados: <strong>Edificio X, Parque Y</strong></p>'
        },
        'Atenea': {
            description: 'Consultora y experta en desarrollo sostenible.',
            profileImage: 'IMG/Atenea.gif',
            uniqueContent: '<p>Iniciativas: <strong>Proyecto Verde</strong></p>'
        },
        'Daniela': {
            description: 'Fotógrafa y viajera apasionada.',
            profileImage: 'IMG/Find y Share.gif',
            uniqueContent: '<p>Últimos viajes: <strong>Asia, Europa</strong></p>'
        }
    };

    // Muestra la información del usuario en el dashboard
    if (sessionData && sessionData.loggedIn) {
        usernameDisplay.textContent = sessionData.username;

        // Mostrar la imagen de perfil del usuario
        if (userImageDisplay) {
            userImageDisplay.src = sessionData.image;
            userImageDisplay.alt = `Foto de ${sessionData.username}`;
        }

        // Muestra la descripción y contenido único del usuario
        const profile = userProfiles[sessionData.username];
        if (profile) {
            userDescription.textContent = profile.description;
            userUniqueContent.innerHTML = profile.uniqueContent;
        }
    } else {
        // Redirige a la página de inicio si no hay sesión activa
        window.location.href = 'index.html';
    }

    // Funcionalidad del botón de cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('userSession'); // Limpia la sesión del sessionStorage
            console.log('Sesión cerrada.');
            window.location.href = 'index.html'; // Redirige al inicio
        });
    }
});
