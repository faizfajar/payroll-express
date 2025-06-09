const express = require("express");
const router = express.Router();
const payrollPeriodEmployeeController = require("../controllers/payrollPeriodEmployeeController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", payrollPeriodEmployeeController.index);
router.get("/:id", payrollPeriodEmployeeController.getById);
router.get("/period/:ppr_id", payrollPeriodEmployeeController.getByPeriodId);
router.post("/", payrollPeriodEmployeeController.create);
router.put("/:ppr_id", payrollPeriodEmployeeController.update);
router.delete("/:id", payrollPeriodEmployeeController.delete);

module.exports = router;
