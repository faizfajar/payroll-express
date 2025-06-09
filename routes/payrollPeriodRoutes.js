const express = require("express");
const router = express.Router();
const payrollPeriodController = require("../controllers/payrollPeriodController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", payrollPeriodController.index);
router.get("/:id", payrollPeriodController.show);
router.post("/", payrollPeriodController.create);
router.put("/:id", payrollPeriodController.update);
router.delete("/:id", payrollPeriodController.destroy);

module.exports = router;
