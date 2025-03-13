const {
    addtask,
    updatetask,
    getAllTask,
    getSingletask,
    deletetask,updatetasktStatus
  } = require("../Controllers/TaskController");

  const express = require('express');
  router = express.Router();
  router.post('/task',addtask);
  router.get('/task',getAllTask);
  router.get('/task/:id',getSingletask);
router.put('/task/:id',updatetask);
router.delete('/task/:id',deletetask);
router.post('/updatetasktStatus/:id',updatetasktStatus)

module.exports = router