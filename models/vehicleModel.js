const db = require("../config/db");

exports.registerVehicleEntry = async (adminId, placa, tipo, numeroLocker) => {
  const conn = await db.getConnection(); // Inicia la conexión

  try {
    await conn.beginTransaction();

    console.log(adminId, placa, tipo, numeroLocker);

    // Verificar si la placa ya existe en la base de datos
    const [vehicleExists] = await conn.query(
      "SELECT id_vehiculo FROM vehiculos WHERE placa = ? AND id_admin = ?",
      [placa, adminId]
    );

    if (vehicleExists.length > 0) {
      return {
        success: false,
        message: "La placa ya está registrada en el sistema.",
      };
    }

    // Verificar si el casillero existe y su estado actual
    const [lockers] = await conn.query(
      "SELECT id_casillero, ocupado FROM casilleros WHERE id_admin = ? AND numero_casillero = ?",
      [adminId, numeroLocker]
    );

    if (lockers.length === 0) {
      return { success: false, message: "Casillero no encontrado." };
    }

    const { id_casillero: idLocker, ocupado } = lockers[0];

    // Si el casillero está ocupado, no se puede usar
    if (Number(ocupado) === 1) {
      return {
        success: false,
        message: "El casillero seleccionado ya está ocupado.",
      };
    }

    // Insertar el vehículo
    await conn.query(
      "INSERT INTO vehiculos (id_admin, id_casillero, placa, tipo) VALUES (?, ?, ?, ?)",
      [adminId, idLocker, placa, tipo]
    );

    // Actualizar el casillero como ocupado y asignarle la placa
    await conn.query(
      "UPDATE casilleros SET ocupado = 1, placa = ? WHERE id_casillero = ? AND id_admin = ?",
      [placa, idLocker, adminId]
    );

    await conn.commit(); // Confirmar la transacción

    return {
      success: true,
      message: "Vehículo registrado y casillero actualizado correctamente.",
    };
  } catch (error) {
    await conn.rollback(); // Si ocurre un error, se revierte todo lo hecho en la transacción

    if (error.code === "ER_DUP_ENTRY") {
      return {
        success: false,
        message: "Ya existe un vehículo con esta placa registrado.",
      };
    }

    // Otros errores
    console.error("Error en registerVehicleEntry:", error);
    return {
      success: false,
      message:
        "Ocurrió un error al registrar el vehículo. Inténtelo nuevamente.",
    };
  } finally {
    conn.release(); // Liberar la conexión de la base de datos
  }
};
