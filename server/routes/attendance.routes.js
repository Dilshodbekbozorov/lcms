const express = require('express');
const {
  getAttendance,
  bulkAttendance,
  updateAttendance,
  getAttendanceStats,
} = require('../controllers/attendance.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);

router.get('/stats/:groupId', authorize('admin', 'teacher'), getAttendanceStats);
router.get('/', authorize('admin', 'teacher'), getAttendance);
router.post('/bulk', authorize('admin', 'teacher'), bulkAttendance);
router.put('/:id', authorize('admin', 'teacher'), updateAttendance);

module.exports = router;
