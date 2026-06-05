const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  const expiresIn =
    role === 'admin'
      ? process.env.JWT_EXPIRES_IN || '8h'
      : '24h';

  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

module.exports = generateToken;
