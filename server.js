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

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    // Inserta el nuevo usuario en la base de datos
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
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
