const express = require("express");
const router = express.Router();
const controller = require("../controllers/payrollPeriodController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
