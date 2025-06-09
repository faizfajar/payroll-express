const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", attendanceController.index);
router.get("/:id", attendanceController.getById);
router.get("/employee/:emp_id", attendanceController.getByEmployeeId);
router.get("/:emp_id/:start/:finish", attendanceController.getEmployeeAttendanceByRange);
router.post("/", attendanceController.create);
router.put("/:id", attendanceController.update);
router.delete("/:id", attendanceController.delete);

module.exports = router;
