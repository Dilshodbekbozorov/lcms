const express = require('express');
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teachers.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin'), getTeachers);
router.post('/', authorize('admin'), createTeacher);
router.get('/:id', authorize('admin'), getTeacher);
router.put('/:id', authorize('admin'), updateTeacher);
router.delete('/:id', authorize('admin'), deleteTeacher);

module.exports = router;
