const db = require("../config/db");

exports.getLockersByAdminId = async (adminId) => {
  const [rows] = await db.query(
    "SELECT * FROM casilleros WHERE id_admin = ? ORDER BY id_casillero ASC",
    [adminId]
  );
  return rows;
};
