const express = require('express');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  exportStudents,
} = require('../controllers/students.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);

router.get('/export', authorize('admin', 'teacher'), exportStudents);
router.get('/', authorize('admin', 'teacher'), getStudents);
router.post('/', authorize('admin'), createStudent);
router.get('/:id', authorize('admin', 'teacher'), getStudent);
router.put('/:id', authorize('admin'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

module.exports = router;
