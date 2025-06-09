const express = require("express");
const router = express.Router();
const reimbursementController = require("../controllers/reimbursementController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", reimbursementController.index);
router.get("/:id", reimbursementController.getById);
router.get("/employee/:emp_id", reimbursementController.getByEmployeeId);
router.post("/", reimbursementController.create);
router.put("/:id", reimbursementController.update);
router.delete("/:id", reimbursementController.delete);

module.exports = router;
