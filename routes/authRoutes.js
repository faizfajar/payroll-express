const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// const authMiddleware = require("../middlewares/authMiddleware");
// router.get("/protected", authMiddleware, (req, res) => {
//   res.json({ user: req.user });
// });

router.post("/login", authController.login);

module.exports = router;
