const Teacher = require('../models/Teacher');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.getTeachers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const teachers = await Teacher.find(filter).sort({ lastName: 1 });
    res.json({ success: true, count: teachers.length, data: teachers });
  } catch (error) {
    next(error);
  }
};

exports.getTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return next(new ErrorResponse('O\'qituvchi topilmadi', 404));
    }
    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

exports.createTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.create(req.body);

    if (req.body.createUser && req.body.password) {
      await User.create({
        name: `${teacher.firstName} ${teacher.lastName}`,
        email: teacher.email,
        password: req.body.password,
        role: 'teacher',
        linkedId: teacher._id,
      });
    }

    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

exports.updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!teacher) {
      return next(new ErrorResponse('O\'qituvchi topilmadi', 404));
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive' },
      { new: true }
    );

    if (!teacher) {
      return next(new ErrorResponse('O\'qituvchi topilmadi', 404));
    }

    res.json({ success: true, message: 'O\'qituvchi nofaol qilindi', data: teacher });
  } catch (error) {
    next(error);
  }
};
