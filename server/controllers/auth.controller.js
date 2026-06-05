const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ErrorResponse = require('../utils/errorResponse');

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validatsiya xatosi',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return next(new ErrorResponse('Email yoki parol noto\'g\'ri', 401));
    }

    if (!user.isActive) {
      return next(new ErrorResponse('Hisob faol emas', 401));
    }

    const token = generateToken(user._id, user.role);

    if (process.env.NODE_ENV === 'development') {
      console.log(`Foydalanuvchi kirdi: ${user.email} (${user.role})`);
    }

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          linkedId: user.linkedId,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Muvaffaqiyatli chiqildi' });
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        linkedId: user.linkedId,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validatsiya xatosi',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const { currentPassword, newPassword } = req.body;

    if (!(await user.matchPassword(currentPassword))) {
      return next(new ErrorResponse('Joriy parol noto\'g\'ri', 400));
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Parol muvaffaqiyatli o\'zgartirildi' });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validatsiya xatosi',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
