const {
  registerVehicleEntry,
  vehicleExit,
  getListerVehicles,
  vehicleSearch,
  getRecordVehicles,
} = require("../models/vehicleModel");

exports.entryVehicleController = async (req, res) => {
  try {
    const adminId = req.user.id_admin; // viene del token
    const { placa, tipo, numeroLocker } = req.body;

    if (!placa || !tipo || !numeroLocker) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos." });
    }

    const result = await registerVehicleEntry(
      adminId,
      placa,
      tipo,
      numeroLocker
    );

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error en entryVehicleController:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.listVehiclesController = async (req, res) => {
  try {
    const adminId = req.user.id_admin; // viene del token
    const vehicles = await getListerVehicles(adminId);
    return res.status(200).json({ vehicles });
  } catch (error) {
    console.error("Error en listVehiclesController:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.exitVehicleController = async (req, res) => {
  const { placa, total } = req.body;
  const adminId = req.user.id_admin;

  const result = await vehicleExit(adminId, placa, total);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
};

exports.searchVehicleController = async (req, res) => {
  const { placa } = req.body;
  const adminId = req.user.id_admin;

  const result = await vehicleSearch(adminId, placa);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  res.json({
    message: "Vehículo encontrado.",
    vehicle: result.vehicle,
  });
};

exports.getRecordsController = async (req, res) => {
  try {
    const adminId = req.user.id_admin;
    const vehicles = await getRecordVehicles(adminId);
    return res.status(200).json({ vehicles });
  } catch (error) {
    console.error("Error en listVehiclesController:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
