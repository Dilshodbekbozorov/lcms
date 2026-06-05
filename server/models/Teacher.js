const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    languages: [{ type: String }],
    levels: [{ type: String }],
    salary: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    hiredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

teacherSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

teacherSchema.set('toJSON', { virtuals: true });
teacherSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Teacher', teacherSchema);
