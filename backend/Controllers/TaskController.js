const { query } = require("express");

const Task = require("../Models/TaskModel");

const addtask = async (req, res) => {
  try {
    const newtask = new Task(req.body);
    await newtask.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error in  inserting the newtask",
        error: err.message,
      });
  }
};

const updatetask = async (req, res) => {
  const updatedata = req.body;
  const { id } = req.params;

  try {
    const result = await Task.updateOne({ _id: id }, { $set: updatedata });
    if (!result) {
      res.status(404).json({ success: false, message: "task not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (err) {
    res
      .status(500)
      .json({ sucess: false, message: "error updating in task", error: err });
  }
};
const getAllTask = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;
    const filter = req.query.filter;
    const query = {
      deleted_at: null,
    };
    if (search) {
      query.title = { $regex: search, $options: "i" }; // Add search condition if provided
    }
    if (filter === "Low") {
      query.priority = "Low"; // Filter by status 1
    } else if (filter === "Medium") {
      query.priority = "Medium"; // Filter by status 0
    } else if (filter === "High") {
      query.priority = "High"; // Filter by status 0
    }
    const result = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Task.find(query).countDocuments();
    res.status(201).json({ success: true, result, count });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Task ",
      error: err.message,
    });
  }
};

const getSingletask = async (req, res) => {
  // const { id } = req.body;
  const { id } = req.params;
  try {
    const result = await Task.findOne({ _id: id });
    if (!result) {
      res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Project" });
  }
};

const deletetask = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Task.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching Project" });
  }
};
const updatetasktStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(status);
    const { id } = req.params;
    console.log(status);
    console.log(id);
    const updatedRecord = await Task.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } // Return the updated record
    );
    console.log(updatedRecord);
    if (!updatedRecord) {
      throw new Error("Record not found");
    }

    return res.status(200).json({ success: true, result: updatedRecord }); // Return response
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating status",
        error: err.message,
      });
  }
};
module.exports = {
  addtask,
  updatetask,
  getAllTask,
  getSingletask,
  deletetask,
  updatetasktStatus,
};
