const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware.js");
const {
  entryVehicleController,
  listVehiclesController,
} = require("../controllers/vehicleController.js");

router.post("/entry", verifyToken, entryVehicleController);
router.get("/list", verifyToken, listVehiclesController);

module.exports = router;
