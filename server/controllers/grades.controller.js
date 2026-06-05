const Grade = require('../models/Grade');
const ErrorResponse = require('../utils/errorResponse');

exports.getGrades = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.group) filter.group = req.query.group;

    if (req.user.role === 'student' && req.user.linkedId) {
      filter.student = req.user.linkedId;
    }

    const grades = await Grade.find(filter)
      .populate('student', 'firstName lastName')
      .populate('group', 'name')
      .populate('gradedBy', 'name')
      .sort({ date: -1 });

    res.json({ success: true, count: grades.length, data: grades });
  } catch (error) {
    next(error);
  }
};

exports.createGrade = async (req, res, next) => {
  try {
    const grade = await Grade.create({
      ...req.body,
      gradedBy: req.user._id,
    });

    const populated = await Grade.findById(grade._id)
      .populate('student', 'firstName lastName')
      .populate('group', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('student', 'firstName lastName')
      .populate('group', 'name');

    if (!grade) {
      return next(new ErrorResponse('Baho topilmadi', 404));
    }

    res.json({ success: true, data: grade });
  } catch (error) {
    next(error);
  }
};

exports.deleteGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) {
      return next(new ErrorResponse('Baho topilmadi', 404));
    }
    res.json({ success: true, message: 'Baho o\'chirildi' });
  } catch (error) {
    next(error);
  }
};

exports.getGradeSummary = async (req, res, next) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId });

    const byType = {};
    grades.forEach((g) => {
      if (!byType[g.type]) byType[g.type] = [];
      byType[g.type].push((g.score / g.maxScore) * 100);
    });

    const typeAverages = Object.entries(byType).map(([type, scores]) => ({
      type,
      average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length,
    }));

    const overallAverage =
      grades.length > 0
        ? Math.round(
            grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) /
              grades.length
          )
        : 0;

    res.json({
      success: true,
      data: { overallAverage, byType: typeAverages, totalGrades: grades.length },
    });
  } catch (error) {
    next(error);
  }
};
