const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware.js");
const {
  entryVehicleController,
} = require("../controllers/vehicleController.js");

router.post("/entry", verifyToken, entryVehicleController);

module.exports = router;
