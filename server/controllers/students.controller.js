const ExcelJS = require('exceljs');
const Student = require('../models/Student');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Group = require('../models/Group');
const ErrorResponse = require('../utils/errorResponse');

const buildStudentFilter = (query, user) => {
  const filter = {};

  if (query.group) filter.group = query.group;
  if (query.level) filter.level = query.level;
  if (query.status) filter.status = query.status;
  else filter.status = { $ne: 'archived' };

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
    ];
  }

  if (user.role === 'teacher' && user.linkedId) {
    return Group.find({ teacher: user.linkedId }).then((groups) => {
      const groupIds = groups.map((g) => g._id);
      filter.group = filter.group
        ? filter.group
        : { $in: groupIds };
      return filter;
    });
  }

  return Promise.resolve(filter);
};

exports.getStudents = async (req, res, next) => {
  try {
    const filter = await buildStudentFilter(req.query, req.user);
    const students = await Student.find(filter)
      .populate('group', 'name language level monthlyFee')
      .sort({ createdAt: -1 });

    const studentIds = students.map((s) => s._id);
    const currentMonth = new Date().toISOString().slice(0, 7);
    const payments = await Payment.find({
      student: { $in: studentIds },
      month: currentMonth,
    });

    const paymentMap = {};
    payments.forEach((p) => {
      paymentMap[p.student.toString()] = p.status;
    });

    const data = students.map((s) => ({
      ...s.toObject(),
      paymentStatus: paymentMap[s._id.toString()] || 'unpaid',
    }));

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      'group',
      'name language level teacher monthlyFee'
    );

    if (!student) {
      return next(new ErrorResponse('O\'quvchi topilmadi', 404));
    }

    const [payments, grades, attendance] = await Promise.all([
      Payment.find({ student: student._id }).populate('group', 'name').sort({ month: -1 }),
      Grade.find({ student: student._id }).populate('group', 'name').sort({ date: -1 }),
      Attendance.find({ student: student._id }).sort({ date: -1 }),
    ]);

    const presentCount = attendance.filter((a) =>
      ['present', 'late'].includes(a.status)
    ).length;
    const attendancePercent =
      attendance.length > 0
        ? Math.round((presentCount / attendance.length) * 100)
        : 0;

    const avgGrade =
      grades.length > 0
        ? Math.round(
            grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) /
              grades.length
          )
        : 0;

    const unpaidPayments = payments.filter((p) =>
      ['unpaid', 'partial'].includes(p.status)
    );

    res.json({
      success: true,
      data: {
        student,
        payments,
        grades,
        attendance,
        stats: {
          attendancePercent,
          avgGrade,
          unpaidCount: unpaidPayments.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);

    if (student.group) {
      await Group.findByIdAndUpdate(student.group, {
        $addToSet: { students: student._id },
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Yangi o\'quvchi: ${student.firstName} ${student.lastName}`);
    }

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const oldStudent = await Student.findById(req.params.id);
    if (!oldStudent) {
      return next(new ErrorResponse('O\'quvchi topilmadi', 404));
    }

    if (req.body.group && oldStudent.group?.toString() !== req.body.group) {
      if (oldStudent.group) {
        await Group.findByIdAndUpdate(oldStudent.group, {
          $pull: { students: oldStudent._id },
        });
      }
      await Group.findByIdAndUpdate(req.body.group, {
        $addToSet: { students: oldStudent._id },
      });
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: 'archived' },
      { new: true }
    );

    if (!student) {
      return next(new ErrorResponse('O\'quvchi topilmadi', 404));
    }

    if (student.group) {
      await Group.findByIdAndUpdate(student.group, {
        $pull: { students: student._id },
      });
    }

    res.json({ success: true, message: 'O\'quvchi arxivlandi', data: student });
  } catch (error) {
    next(error);
  }
};

exports.exportStudents = async (req, res, next) => {
  try {
    const filter = await buildStudentFilter(req.query, req.user);
    const students = await Student.find(filter).populate('group', 'name');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('O\'quvchilar');

    sheet.columns = [
      { header: 'Ism', key: 'firstName', width: 15 },
      { header: 'Familiya', key: 'lastName', width: 15 },
      { header: 'Telefon', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Guruh', key: 'group', width: 15 },
      { header: 'Daraja', key: 'level', width: 10 },
      { header: 'Holat', key: 'status', width: 12 },
    ];

    students.forEach((s) => {
      sheet.addRow({
        firstName: s.firstName,
        lastName: s.lastName,
        phone: s.phone,
        email: s.email || '',
        group: s.group?.name || '',
        level: s.level,
        status: s.status,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=oquvchilar.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};
