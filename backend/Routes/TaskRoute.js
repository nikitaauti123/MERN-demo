const {
  addtask,
  updatetask,
  getAllTask,
  getSingletask,
  deletetask,
  updatetasktStatus,
} = require("../Controllers/TaskController");
const authMiddleware = require("../Middleware/authMiddleware"); // Import middleware

const express = require("express");
router = express.Router();
router.post("/task", authMiddleware, addtask);
router.get("/task", authMiddleware, getAllTask);
router.get("/task/:id", authMiddleware, getSingletask);
router.put("/task/:id", authMiddleware, updatetask);
router.delete("/task/:id", authMiddleware, deletetask);
router.post("/updatetasktStatus/:id", authMiddleware, updatetasktStatus);

module.exports = router;
