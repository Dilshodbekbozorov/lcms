const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: ['male', 'female'] },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'archived'],
      default: 'active',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);
