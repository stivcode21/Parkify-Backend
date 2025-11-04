const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware.js");
const { getLockersController } = require("../controllers/lockerController");

router.get("/", verifyToken, getLockersController);

module.exports = router;
