const express = require("express");
const auth = require("../controllers/authController.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/login", auth.loginController);
router.post("/admin", auth.getAdminController);
router.post("/logout", auth.logoutController);
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Acceso concedido", user: req.user });
});

module.exports = router;
