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
        
        // Nuevos usuarios y contraseñas
        const usuarios = [
            { username: 'Erik Lopez', password: '2930', image: 'IMG/Esdeath.gif' },
            { username: 'Sofia', password: 'Sofia123', image: 'IMG/Noche de baile.gif' },
            { username: 'Mia', password: 'Mia123', image: 'IMG/dans.gif' },
            { username: 'Zeus', password: 'Zeus123', image: 'IMG/Zeus.gif' },
            { username: 'Odin', password: 'Odin123', image: 'IMG/Odin.gif' },
            { username: 'Hades', password: 'Hades123', image: 'IMG/Hades.gif' },
            { username: 'Ares', password: 'Ares123', image: 'IMG/Ares.gif' },
            { username: 'Apolo', password: 'Apolo123', image: 'IMG/Apolo.gif' },
            { username: 'Atlas', password: 'Atlas123', image: 'IMG/Atlas.jpeg' },
            { username: 'Atenea', password: 'Atenea123', image: 'IMG/Atenea.gif' },
            { username: 'Daniela', password: 'Daniela29', image: 'IMG/Find y Share.gif' }
        ];
        
        // Inserta los usuarios en la base de datos
        usuarios.forEach(usuario => {
            db.run(
                `INSERT OR IGNORE INTO usuarios (username, password, image) VALUES (?, ?, ?)`,
                [usuario.username, usuario.password, usuario.image],
                function(err) {
                    if (err) {
                        console.error('Error insertando usuario:', err);
                    } else if (this.changes > 0) {
                        console.log(`Usuario ${usuario.username} insertado.`);
                    }
                }
            );
        });
    });
}

// Ruta para login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
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

// Ruta para registro
app.post('/api/register', (req, res) => {
    const { username, password, image } = req.body;

    // Verifica que se hayan proporcionado todos los campos necesarios
    if (!username || !password || !image) {
        return res.status(400).json({ error: 'Usuario, contraseña e imagen son requeridos' });
    }

    // Inserta el nuevo usuario en la base de datos
    db.run(
        `INSERT INTO usuarios (username, password, image) VALUES (?, ?, ?)`,
        [username, password, image],
        function(err) {
            if (err) {
                console.error('Error al registrar usuario:', err);
                return res.status(500).json({ error: 'Error al registrar el usuario. Puede que el usuario ya exista.' });
            }
            res.json({ success: true }); // Respuesta exitosa
        }
    );
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
