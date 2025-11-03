require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware global
app.use(cors(corsOptions)); // Permite peticiones desde el frontend
app.use(express.json()); // Permite recibir JSON en el body
app.use(cookieParser());

// Rutas principales
app.use("/api/auth", authRoutes);

// Servidor escuchando
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
