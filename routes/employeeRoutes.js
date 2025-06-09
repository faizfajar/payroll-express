const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", employeeController.index);
router.get("/:id", employeeController.getById);
router.post("/", employeeController.create);
router.put("/:id", employeeController.update);
router.delete("/:id", employeeController.delete);

module.exports = router;
