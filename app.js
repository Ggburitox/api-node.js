const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db.js");
const app = express();
const port = 6666;

// Middleware para parsear JSON y datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Obtener todos los estudiantes
app.get("/students", (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Agregar un nuevo estudiante
app.post("/students", (req, res) => {
    const { firstname, lastname, gender, age } = req.body;
    if (!firstname || !lastname || !gender) {
        return res.status(400).json({ error: "Faltan datos requeridos (firstname, lastname, gender)" });
    }
    const sql = "INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)";
    db.run(sql, [firstname, lastname, gender, age], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "✅ Estudiante creado", id: this.lastID });
    });
});

// Obtener un estudiante por ID
app.get("/student/:id", (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "❌ Estudiante no encontrado" });
        }
        res.json(row);
    });
});

// Actualizar un estudiante por ID
app.put("/student/:id", (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, gender, age } = req.body;
    if (!firstname || !lastname || !gender) {
        return res.status(400).json({ error: "Faltan datos requeridos (firstname, lastname, gender)" });
    }
    const sql = "UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?";
    db.run(sql, [firstname, lastname, gender, age, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "✅ Estudiante actualizado" });
    });
});

// Eliminar un estudiante por ID
app.delete("/student/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM students WHERE id = ?";
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "✅ Estudiante eliminado" });
    });
});

// Iniciar el servidor
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Servidor corriendo en http://0.0.0.0:${port}`);
});
