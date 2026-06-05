const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'transfer'],
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'partial'],
      default: 'unpaid',
    },
    paidAt: { type: Date },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
