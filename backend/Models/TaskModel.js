const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema(
    {   
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High'],  default: 'Low' },
    due_date: { type: Date, },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically sets the updatedAt field to the current date/time
      },
      deleted_at: {
        type: Date,
        default: null,
      },
}, { timestamps: true });

module.exports = mongoose.model('Task',TaskSchema);