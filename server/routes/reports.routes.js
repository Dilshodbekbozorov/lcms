const express = require('express');
const {
  getDashboard,
  getRevenue,
  getAttendanceReport,
  getGroupsReport,
} = require('../controllers/reports.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/revenue', getRevenue);
router.get('/attendance', getAttendanceReport);
router.get('/groups', getGroupsReport);

module.exports = router;
