const { getLockersByAdminId } = require("../models/lockerModel");

exports.getLockersController = async (req, res) => {
  try {
    const adminId = req.user.id_admin;

    if (!adminId) {
      return res
        .status(401)
        .json({ message: "No se pudo identificar el administrador." });
    }

    const lockers = await getLockersByAdminId(adminId);
    return res.status(200).json({ lockers });
  } catch (error) {
    console.error("Error al obtener casilleros:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
