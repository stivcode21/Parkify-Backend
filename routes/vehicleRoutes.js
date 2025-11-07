const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware.js");
const {
  entryVehicleController,
  listVehiclesController,
  exitVehicleController,
  searchVehicleController,
  getRecordsController,
} = require("../controllers/vehicleController.js");

router.post("/entry", verifyToken, entryVehicleController);
router.get("/list", verifyToken, listVehiclesController);
router.post("/exit", verifyToken, exitVehicleController);
router.post("/search", verifyToken, searchVehicleController);
router.get("/records", verifyToken, getRecordsController);

module.exports = router;
