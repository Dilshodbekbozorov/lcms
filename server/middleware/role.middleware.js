const ErrorResponse = require('../utils/errorResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `${req.user.role} roli bu amalni bajarishga ruxsat etilmagan`,
          403
        )
      );
    }
    next();
  };
};

module.exports = authorize;
