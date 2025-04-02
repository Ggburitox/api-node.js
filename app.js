const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

// Middleware para parsear JSON y datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a la base de datos SQLite
const db = new sqlite3.Database("students.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
  }
});

// Obtener todos los estudiantes
app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Agregar un nuevo estudiante
app.post("/students", (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  const sql = "INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)";
  
  db.run(sql, [firstname, lastname, gender, age], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Estudiante creado", id: this.lastID });
  });
});

// Obtener un estudiante por ID
app.get("/student/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: "Estudiante no encontrado" });
      return;
    }
    res.json(row);
  });
});

// Actualizar un estudiante por ID
app.put("/student/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, gender, age } = req.body;
  const sql = "UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?";
  
  db.run(sql, [firstname, lastname, gender, age, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Estudiante actualizado" });
  });
});

// Eliminar un estudiante por ID
app.delete("/student/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM students WHERE id = ?";
  
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Estudiante eliminado" });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
