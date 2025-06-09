const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

// GET all schedules
router.get("/", scheduleController.index);
router.get("/:id", scheduleController.getById);
router.post("/", scheduleController.create);
router.put("/:id", scheduleController.update);
router.delete("/:id", scheduleController.delete);

module.exports = router;
