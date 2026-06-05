const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Avtorizatsiya talab qilinadi', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user || !req.user.isActive) {
      return next(new ErrorResponse('Foydalanuvchi topilmadi yoki faol emas', 401));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse('Token yaroqsiz yoki muddati tugagan', 401));
  }
};

module.exports = protect;
