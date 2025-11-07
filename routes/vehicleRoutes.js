const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware.js");
const {
  entryVehicleController,
  listVehiclesController,
  exitVehicleController,
  searchVehicleController,
} = require("../controllers/vehicleController.js");

router.post("/entry", verifyToken, entryVehicleController);
router.get("/list", verifyToken, listVehiclesController);
router.post("/exit", verifyToken, exitVehicleController);
router.post("/search", verifyToken, searchVehicleController);

module.exports = router;
