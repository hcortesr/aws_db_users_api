const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// ── DB CONFIG ── update these with your credentials ──────────────────────────
const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "myapp",
  port: process.env.DB_PORT || 3306,
};

console.log(DB_CONFIG);
// ─────────────────────────────────────────────────────────────────────────────

let db;

async function initDB() {
  try {
    
    db = await mysql.createPool(DB_CONFIG);

    
    
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
}

// GET all items
app.get("/api/items", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM players");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add item
app.post("/api/items", async (req, res) => {
  const value = req.body;
  console.log(value);
  try {
    const [result] = await db.query("INSERT INTO players (name, age) VALUES (?, ?)", [value.name, value.age]);
    const [rows] = await db.query("SELECT * FROM players WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM players WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
});
