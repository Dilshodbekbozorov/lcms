const Group = require('../models/Group');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const ErrorResponse = require('../utils/errorResponse');

const buildGroupFilter = async (query, user) => {
  const filter = {};
  if (query.language) filter.language = query.language;
  if (query.level) filter.level = query.level;
  if (query.status) filter.status = query.status;

  if (user.role === 'teacher' && user.linkedId) {
    filter.teacher = user.linkedId;
  }

  if (user.role === 'student' && user.linkedId) {
    const student = await Student.findById(user.linkedId);
    if (student?.group) filter._id = student.group;
  }

  return filter;
};

exports.getGroups = async (req, res, next) => {
  try {
    const filter = await buildGroupFilter(req.query, req.user);
    const groups = await Group.find(filter)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName')
      .sort({ name: 1 });

    res.json({ success: true, count: groups.length, data: groups });
  } catch (error) {
    next(error);
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('teacher')
      .populate('students');

    if (!group) {
      return next(new ErrorResponse('Guruh topilmadi', 404));
    }

    const studentIds = group.students.map((s) => s._id);
    const attendanceRecords = await Attendance.find({
      group: group._id,
      student: { $in: studentIds },
    });

    const statsMap = {};
    studentIds.forEach((id) => {
      statsMap[id.toString()] = { total: 0, present: 0 };
    });

    attendanceRecords.forEach((a) => {
      const key = a.student.toString();
      statsMap[key].total++;
      if (['present', 'late'].includes(a.status)) {
        statsMap[key].present++;
      }
    });

    const studentsWithStats = group.students.map((s) => {
      const stat = statsMap[s._id.toString()] || { total: 0, present: 0 };
      const percent =
        stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0;
      return { ...s.toObject(), attendancePercent: percent };
    });

    res.json({
      success: true,
      data: { ...group.toObject(), students: studentsWithStats },
    });
  } catch (error) {
    next(error);
  }
};

exports.createGroup = async (req, res, next) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

exports.updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!group) {
      return next(new ErrorResponse('Guruh topilmadi', 404));
    }

    res.json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );

    if (!group) {
      return next(new ErrorResponse('Guruh topilmadi', 404));
    }

    res.json({ success: true, message: 'Guruh yakunlandi', data: group });
  } catch (error) {
    next(error);
  }
};

exports.addStudentToGroup = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return next(new ErrorResponse('Guruh topilmadi', 404));
    }

    if (group.students.length >= group.maxStudents) {
      return next(new ErrorResponse('Guruh to\'lgan', 400));
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return next(new ErrorResponse('O\'quvchi topilmadi', 404));
    }

    if (student.group) {
      await Group.findByIdAndUpdate(student.group, {
        $pull: { students: student._id },
      });
    }

    group.students.push(student._id);
    await group.save();

    student.group = group._id;
    student.level = group.level;
    await student.save();

    res.json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

exports.removeStudentFromGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return next(new ErrorResponse('Guruh topilmadi', 404));
    }

    group.students = group.students.filter(
      (s) => s.toString() !== req.params.sid
    );
    await group.save();

    await Student.findByIdAndUpdate(req.params.sid, { group: null });

    res.json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

exports.getSchedule = async (req, res, next) => {
  try {
    const groups = await Group.find({ status: 'active' })
      .populate('teacher', 'firstName lastName')
      .select('name language level schedule teacher');

    res.json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};
