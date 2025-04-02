const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos (creará el archivo si no existe)
let db = new sqlite3.Database('./students.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear la tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT
)`, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Tabla creada con éxito.');
    }
});

// Cerrar la conexión
db.close((err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conexión cerrada.');
    }
});
