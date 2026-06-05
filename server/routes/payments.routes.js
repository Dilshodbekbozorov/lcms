const express = require('express');
const {
  getPayments,
  createPayment,
  updatePayment,
  getDebtors,
  getSummary,
} = require('../controllers/payments.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);

router.get('/debtors', authorize('admin'), getDebtors);
router.get('/summary', authorize('admin'), getSummary);
router.get('/', authorize('admin', 'student'), getPayments);
router.post('/', authorize('admin'), createPayment);
router.put('/:id', authorize('admin'), updatePayment);

module.exports = router;
