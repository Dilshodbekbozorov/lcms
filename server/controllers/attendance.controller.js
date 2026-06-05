const Attendance = require('../models/Attendance');
const Group = require('../models/Group');
const ErrorResponse = require('../utils/errorResponse');

exports.getAttendance = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.group) filter.group = req.query.group;
    if (req.query.student) filter.student = req.query.student;

    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    if (req.query.date) {
      const d = new Date(req.query.date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: d, $lt: nextDay };
    }

    const records = await Attendance.find(filter)
      .populate('student', 'firstName lastName')
      .populate('group', 'name')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};

exports.bulkAttendance = async (req, res, next) => {
  try {
    const { groupId, date, records } = req.body;

    if (!groupId || !date || !records?.length) {
      return next(new ErrorResponse('Guruh, sana va yozuvlar talab qilinadi', 400));
    }

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const results = [];

    for (const record of records) {
      const existing = await Attendance.findOne({
        group: groupId,
        student: record.studentId,
        date: { $gte: dayStart, $lte: dayEnd },
      });

      if (existing) {
        existing.status = record.status;
        existing.note = record.note;
        existing.markedBy = req.user._id;
        await existing.save();
        results.push(existing);
      } else {
        const created = await Attendance.create({
          group: groupId,
          student: record.studentId,
          date: new Date(date),
          status: record.status,
          note: record.note,
          markedBy: req.user._id,
        });
        results.push(created);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Davomat qayd etildi: ${results.length} ta yozuv`);
    }

    res.status(201).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

exports.updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return next(new ErrorResponse('Davomat yozuvi topilmadi', 404));
    }

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceStats = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('students');
    if (!group) {
      return next(new ErrorResponse('Guruh topilmadi', 404));
    }

    const records = await Attendance.find({ group: group._id });
    const stats = group.students.map((student) => {
      const studentRecords = records.filter(
        (r) => r.student.toString() === student._id.toString()
      );
      const present = studentRecords.filter((r) =>
        ['present', 'late'].includes(r.status)
      ).length;
      const percent =
        studentRecords.length > 0
          ? Math.round((present / studentRecords.length) * 100)
          : 0;

      return {
        student: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
        },
        total: studentRecords.length,
        present,
        percent,
      };
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
