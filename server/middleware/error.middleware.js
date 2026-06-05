const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    error = new ErrorResponse('Noto\'g\'ri ID formati', 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ErrorResponse(`${field} allaqachon mavjud`, 400);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    error = new ErrorResponse('Validatsiya xatosi', 400, errors);
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server xatosi',
    errors: error.errors || [],
  });
};

module.exports = errorHandler;
