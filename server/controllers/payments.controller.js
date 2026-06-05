const Payment = require('../models/Payment');
const Group = require('../models/Group');
const Student = require('../models/Student');
const ErrorResponse = require('../utils/errorResponse');

exports.getPayments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.month) filter.month = req.query.month;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.student) filter.student = req.query.student;
    if (req.query.group) filter.group = req.query.group;

    if (req.user.role === 'student' && req.user.linkedId) {
      filter.student = req.user.linkedId;
    }

    const payments = await Payment.find(filter)
      .populate('student', 'firstName lastName phone')
      .populate('group', 'name monthlyFee')
      .populate('receivedBy', 'name')
      .sort({ month: -1, createdAt: -1 });

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    const paymentData = {
      ...req.body,
      receivedBy: req.user._id,
    };

    if (paymentData.status === 'paid' || paymentData.status === 'partial') {
      paymentData.paidAt = new Date();
    }

    const payment = await Payment.create(paymentData);

    if (process.env.NODE_ENV === 'development') {
      console.log(`To\'lov qayd etildi: ${payment.amount} UZS`);
    }

    const populated = await Payment.findById(payment._id)
      .populate('student', 'firstName lastName')
      .populate('group', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    if (req.body.status === 'paid' || req.body.status === 'partial') {
      req.body.paidAt = req.body.paidAt || new Date();
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('student', 'firstName lastName')
      .populate('group', 'name');

    if (!payment) {
      return next(new ErrorResponse('To\'lov topilmadi', 404));
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

exports.getDebtors = async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);

    const payments = await Payment.find({
      month,
      status: { $in: ['unpaid', 'partial'] },
    })
      .populate('student', 'firstName lastName phone')
      .populate('group', 'name monthlyFee');

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);

    const payments = await Payment.find({ month });
    const activeGroups = await Group.find({ status: 'active' });
    const activeStudents = await Student.countDocuments({ status: 'active' });

    const totalCollected = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const partialCollected = payments
      .filter((p) => p.status === 'partial')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalExpected = activeGroups.reduce((sum, g) => {
      return sum + g.monthlyFee * g.students.length;
    }, 0);

    const unpaidCount = payments.filter((p) =>
      ['unpaid', 'partial'].includes(p.status)
    ).length;

    res.json({
      success: true,
      data: {
        month,
        totalCollected: totalCollected + partialCollected,
        totalExpected,
        outstanding: totalExpected - totalCollected - partialCollected,
        unpaidCount,
        activeStudents,
        activeGroups: activeGroups.length,
        paidCount: payments.filter((p) => p.status === 'paid').length,
      },
    });
  } catch (error) {
    next(error);
  }
};
