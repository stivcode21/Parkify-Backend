require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const lockerRoutes = require("./routes/lockerRoutes");
const corsOptions = require("./config/corsOptions");
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");

const app = express();
const isProd = process.env.NODE_ENV === "production";

// Trust proxy so secure cookies work behind Render/HTTPS proxies
app.set("trust proxy", 1);

// Middleware global
if (!isProd) {
  app.use(cors(corsOptions)); // Permite peticiones desde el frontend
}
app.use(express.json()); // Permite recibir JSON en el body
app.use(cookieParser());

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/lockers", lockerRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Servidor escuchando
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
