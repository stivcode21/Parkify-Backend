const db = require("../config/db");

exports.findAdminByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM admins WHERE correo = ?", [email]);
  return rows.length > 0 ? rows[0] : null;
};
