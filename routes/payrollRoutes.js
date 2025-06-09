const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

router.use(authMiddleware);

router.post("/process-payroll", payrollController.runPayroll);
router.get("/generate-payslip/:ppr_id", payrollController.generatePayslip);
router.get("/summary/:ppr_id", authorizeRole(["admin"]), payrollController.getPayrollSummary);
module.exports = router;
