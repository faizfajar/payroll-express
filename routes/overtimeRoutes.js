const express = require("express");
const router = express.Router();
const overtimeController = require("../controllers/overtimeController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", overtimeController.index);
router.get("/:id", overtimeController.getById);
router.get("/employee/:emp_id", overtimeController.getByEmployeeId);
router.post("/", overtimeController.create);
router.put("/:id", overtimeController.update);
router.delete("/:id", overtimeController.delete);

module.exports = router;
