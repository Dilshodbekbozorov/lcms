const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    type: {
      type: String,
      enum: ['test', 'homework', 'oral', 'midterm', 'final'],
      required: true,
    },
    score: { type: Number, required: true, min: 0, max: 100 },
    maxScore: { type: Number, default: 100 },
    date: { type: Date, default: Date.now },
    comment: { type: String },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Grade', gradeSchema);
