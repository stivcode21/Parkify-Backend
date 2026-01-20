const jwt = require("jsonwebtoken");
const { findAdminByEmail } = require("../models/adminModel");

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ message: "Correo y contraseña son requeridos." });
    }

    // Buscar usuario
    const user = await findAdminByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Correo no registrado." });
    }

    // Verificar contraseña (por ahora sin encriptar)
    const isMatch = password === user.contrasena;
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id_admin: user.id_admin, email: user.correo },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    const isProd = process.env.NODE_ENV === "production";

    // Configurar cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    });

    // Respuesta
    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      user: {
        id_admin: user.id,
        email: user.correo,
      },
    });
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.logoutController = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
  return res.status(200).json({ message: "Sesión cerrada correctamente." });
};
