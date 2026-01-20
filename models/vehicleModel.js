const db = require("../config/db");

exports.registerVehicleEntry = async (adminId, placa, tipo, numeroLocker) => {
  const conn = await db.connect(); // Inicia la conexión

  try {
    await conn.query("BEGIN");

    console.log(adminId, placa, tipo, numeroLocker);

    // Verificar si la placa ya existe en la base de datos
    const { rows: vehicleExists } = await conn.query(
      "SELECT id_vehiculo FROM vehiculos WHERE placa = $1 AND id_admin = $2",
      [placa, adminId]
    );

    if (vehicleExists.length > 0) {
      await conn.query("ROLLBACK");
      return {
        success: false,
        message: "La placa ya está registrada en el sistema.",
      };
    }

    // Verificar si el casillero existe y su estado actual
    const { rows: lockers } = await conn.query(
      "SELECT id_casillero, ocupado FROM casilleros WHERE id_admin = $1 AND numero_casillero = $2",
      [adminId, numeroLocker]
    );

    if (lockers.length === 0) {
      await conn.query("ROLLBACK");
      return { success: false, message: "Casillero no encontrado." };
    }

    const { id_casillero: idLocker, ocupado } = lockers[0];

    // Si el casillero está ocupado, no se puede usar
    if (ocupado === true) {
      await conn.query("ROLLBACK");
      return {
        success: false,
        message: "El casillero seleccionado ya está ocupado.",
      };
    }

    // Insertar el vehículo
    await conn.query(
      "INSERT INTO vehiculos (id_admin, id_casillero, placa, tipo) VALUES ($1, $2, $3, $4)",
      [adminId, idLocker, placa, tipo]
    );

    // Actualizar el casillero como ocupado y asignarle la placa
    await conn.query(
      "UPDATE casilleros SET ocupado = true, placa = $1 WHERE id_casillero = $2 AND id_admin = $3",
      [placa, idLocker, adminId]
    );

    await conn.query("COMMIT"); // Confirmar la transacción

    return {
      success: true,
      message: "Vehículo registrado y casillero actualizado correctamente.",
    };
  } catch (error) {
    await conn.query("ROLLBACK"); // Si ocurre un error, se revierte todo lo hecho en la transacción

    if (error.code === "23505") {
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

exports.getListerVehicles = async (adminId) => {
  const { rows } = await db.query(
    "SELECT * FROM vehiculos WHERE id_admin = $1",
    [adminId]
  );
  return rows;
};

exports.vehicleExit = async (adminId, placa, total) => {
  const conn = await db.connect();

  try {
    await conn.query("BEGIN");

    // busca el vehículo
    const { rows: vehiculos } = await conn.query(
      "SELECT * FROM vehiculos WHERE id_admin = $1 AND placa = $2",
      [adminId, placa]
    );

    if (vehiculos.length === 0) {
      await conn.query("ROLLBACK");
      return {
        success: false,
        message:
          "No se encontró el vehículo con esa placa para este administrador.",
      };
    }

    const vehiculo = vehiculos[0];

    // insertar datos la tabla historial
    await conn.query(
      `INSERT INTO historial (id_admin, placa, tipo, numero_casillero, fecha_entrada, monto_total, fecha_salida)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        vehiculo.id_admin,
        vehiculo.placa,
        vehiculo.tipo,
        vehiculo.id_casillero,
        vehiculo.fecha_entrada,
        total,
      ]
    );

    await conn.query("DELETE FROM vehiculos WHERE id_admin = $1 AND placa = $2", [
      adminId,
      placa,
    ]);

    // Marcar el casillero como disponible
    await conn.query(
      "UPDATE casilleros SET ocupado = false, placa = NULL WHERE id_casillero = $1 AND id_admin = $2",
      [vehiculo.id_casillero, adminId]
    );

    await conn.query("COMMIT");

    return {
      success: true,
      message: "vehiculo eliminado del registro actual correctamente.",
    };
  } catch (error) {
    await conn.query("ROLLBACK");
    console.error("Error en registerVehicleExit:", error);
    return {
      success: false,
      message: "Error al registrar la salida del vehículo.",
      error,
    };
  } finally {
    conn.release();
  }
};

exports.vehicleSearch = async (adminId, placa) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM vehiculos WHERE id_admin = $1 AND placa = $2",
      [adminId, placa]
    );

    if (rows.length === 0) {
      return { success: false, message: "Vehículo no encontrado." };
    }

    return { success: true, vehicle: rows[0] };
  } catch (error) {
    console.error("Error en vehicleSearch:", error);
    return { success: false, message: "Error al buscar el vehículo." };
  }
};

exports.getRecordVehicles = async (adminId) => {
  const { rows } = await db.query(
    "SELECT * FROM historial WHERE id_admin = $1",
    [adminId]
  );
  return rows;
};
