const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String },
});

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    language: { type: String, required: true },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      required: true,
    },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    maxStudents: { type: Number, default: 12 },
    monthlyFee: { type: Number, required: true },
    schedule: [scheduleSchema],
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', groupSchema);
