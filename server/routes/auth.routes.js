const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  login,
  logout,
  getMe,
  changePassword,
  createUser,
  getUsers,
} = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Juda ko\'p urinish. 15 daqiqadan keyin qayta urinib ko\'ring.',
  },
});

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('To\'g\'ri email kiriting'),
    body('password').notEmpty().withMessage('Parol talab qilinadi'),
  ],
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Joriy parol talab qilinadi'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Yangi parol kamida 6 belgidan iborat bo\'lishi kerak'),
  ],
  changePassword
);

router.get('/users', protect, authorize('admin'), getUsers);
router.post(
  '/users',
  protect,
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Ism talab qilinadi'),
    body('email').isEmail().withMessage('To\'g\'ri email kiriting'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Parol kamida 6 belgidan iborat bo\'lishi kerak'),
    body('role').isIn(['admin', 'teacher', 'student']).withMessage('Noto\'g\'ri rol'),
  ],
  createUser
);

module.exports = router;
