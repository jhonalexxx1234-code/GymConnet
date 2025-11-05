// server.js - Backend para GymConnect
// Requisitos: npm install express cors mysql2 body-parser dotenv

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); // permite imágenes base64 grandes
app.use(express.static("public")); // servir el frontend

// Configuración base de datos
const db = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "gymconnect_db",
});

// Endpoint para guardar gimnasio
app.post("/api/gyms", async (req, res) => {
  try {
    const { name, slogan, description, instagram, facebook, style, images } = req.body;

    // Insertar o actualizar
    const [result] = await db.execute(
      `INSERT INTO gyms (name, slogan, description, instagram, facebook, primary_color, secondary_color, background_color, font_family, logo, header, gallery)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE slogan=VALUES(slogan), description=VALUES(description), instagram=VALUES(instagram), facebook=VALUES(facebook),
       primary_color=VALUES(primary_color), secondary_color=VALUES(secondary_color), background_color=VALUES(background_color),
       font_family=VALUES(font_family), logo=VALUES(logo), header=VALUES(header), gallery=VALUES(gallery)`,
      [
        name,
        slogan,
        description,
        instagram,
        facebook,
        style.primary,
        style.secondary,
        style.background,
        style.font,
        images.logo,
        images.header,
        JSON.stringify(images.gallery),
      ]
    );

    res.json({ message: "Gimnasio guardado correctamente", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar el gimnasio" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
