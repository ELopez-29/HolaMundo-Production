//server
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors()); // Permite solicitudes de diferentes orígenes
app.use(express.json()); // Permite el manejo de datos JSON en las solicitudes
app.use(express.static('.')); // Sirve archivos estáticos

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        initializeDatabase(); // Inicializa la base de datos
    }
});

// Inicializa la base de datos con usuarios
function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        image TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creando tabla:', err);
            return;
        }
    });
}

// Ruta para registro
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    // Verifica que se proporcionen usuario y contraseña
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    // Verifica si el nombre de usuario ya existe
    db.get('SELECT * FROM usuarios WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Error al verificar el usuario:', err);
            return res.status(500).json({ error: 'Error al verificar el usuario' });
        }

        if (row) {
            // Si el usuario ya existe, devuelve un mensaje de error
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
        } else {
            // Si el usuario no existe, procede a insertar el nuevo usuario
            db.run(
                `INSERT INTO usuarios (username, password, image) VALUES (?, ?, ?)`,
                [username, password, 'default_image_path'], // Cambia esto por una ruta de imagen predeterminada si es necesario
                function(err) {
                    if (err) {
                        console.error('Error insertando usuario:', err);
                        return res.status(500).json({ error: 'Error al guardar el usuario' });
                    }
                    res.json({ success: true, message: 'Usuario guardado con éxito' });
                }
            );
        }
    });
});

// Ruta para login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Verifica que se proporcionen usuario y contraseña
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    // Verifica las credenciales del usuario en la base de datos
    db.get(
        'SELECT * FROM usuarios WHERE username = ? AND password = ?',
        [username, password],
        (err, row) => {
            if (err) {
                console.error('Error en consulta:', err);
                return res.status(500).json({ error: 'Error del servidor' });
            }

            if (row) {
                // Respuesta exitosa con los datos del usuario
                res.json({
                    success: true,
                    user: {
                        username: row.username,
                        image: row.image
                    }
                });
            } else {
                // Respuesta de error si las credenciales son incorrectas
                res.json({
                    success: false,
                    error: 'Usuario o contraseña incorrectos'
                });
            }
        }
    );
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
