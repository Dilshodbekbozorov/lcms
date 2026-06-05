const express = require('express');
const {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addStudentToGroup,
  removeStudentFromGroup,
  getSchedule,
} = require('../controllers/groups.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);

router.get('/schedule/all', getSchedule);
router.get('/', getGroups);
router.post('/', authorize('admin'), createGroup);
router.get('/:id', getGroup);
router.put('/:id', authorize('admin'), updateGroup);
router.delete('/:id', authorize('admin'), deleteGroup);
router.post('/:id/students', authorize('admin'), addStudentToGroup);
router.delete('/:id/students/:sid', authorize('admin'), removeStudentFromGroup);

module.exports = router;
