const express = require('express');
const {
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  getGradeSummary,
} = require('../controllers/grades.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);

router.get('/summary/:studentId', getGradeSummary);
router.get('/', getGrades);
router.post('/', authorize('admin', 'teacher'), createGrade);
router.put('/:id', authorize('admin', 'teacher'), updateGrade);
router.delete('/:id', authorize('admin', 'teacher'), deleteGrade);

module.exports = router;
