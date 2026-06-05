const Student = require('../models/Student');
const Group = require('../models/Group');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');

const getLastMonths = (count = 6) => {
  const months = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7));
  }
  return months;
};

const getDayName = (date) => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[date.getDay()];
};

exports.getDashboard = async (req, res, next) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const today = new Date();
    const todayName = getDayName(today);

    const [
      totalStudents,
      activeGroups,
      monthlyPayments,
      unpaidPayments,
      recentPayments,
      allGroups,
    ] = await Promise.all([
      Student.countDocuments({ status: 'active' }),
      Group.countDocuments({ status: 'active' }),
      Payment.find({ month: currentMonth, status: { $in: ['paid', 'partial'] } }),
      Payment.countDocuments({
        month: currentMonth,
        status: { $in: ['unpaid', 'partial'] },
      }),
      Payment.find({ status: 'paid' })
        .populate('student', 'firstName lastName')
        .populate('group', 'name')
        .sort({ paidAt: -1 })
        .limit(5),
      Group.find({ status: 'active' })
        .populate('teacher', 'firstName lastName')
        .select('name schedule language room'),
    ]);

    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    const todaySchedule = allGroups
      .filter((g) => g.schedule?.some((s) => s.day === todayName))
      .map((g) => {
        const slot = g.schedule.find((s) => s.day === todayName);
        return {
          groupName: g.name,
          language: g.language,
          startTime: slot.startTime,
          endTime: slot.endTime,
          room: slot.room,
          teacher: g.teacher
            ? `${g.teacher.firstName} ${g.teacher.lastName}`
            : '',
        };
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json({
      success: true,
      data: {
        totalStudents,
        activeGroups,
        monthlyRevenue,
        unpaidCount: unpaidPayments,
        todaySchedule,
        recentPayments,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getRevenue = async (req, res, next) => {
  try {
    const months = getLastMonths(6);
    const data = [];

    for (const month of months) {
      const payments = await Payment.find({
        month,
        status: { $in: ['paid', 'partial'] },
      });
      const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
      data.push({ month, revenue });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceReport = async (req, res, next) => {
  try {
    const groups = await Group.find({ status: 'active' });
    const data = [];

    for (const group of groups) {
      const records = await Attendance.find({ group: group._id });
      const present = records.filter((r) =>
        ['present', 'late'].includes(r.status)
      ).length;
      const rate =
        records.length > 0 ? Math.round((present / records.length) * 100) : 0;

      data.push({
        groupId: group._id,
        groupName: group.name,
        language: group.language,
        totalRecords: records.length,
        attendanceRate: rate,
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getGroupsReport = async (req, res, next) => {
  try {
    const groups = await Group.find()
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');

    const data = groups.map((g) => ({
      _id: g._id,
      name: g.name,
      language: g.language,
      level: g.level,
      teacher: g.teacher
        ? `${g.teacher.firstName} ${g.teacher.lastName}`
        : 'Tayinlanmagan',
      studentCount: g.students.length,
      maxStudents: g.maxStudents,
      fillRate: Math.round((g.students.length / g.maxStudents) * 100),
      monthlyFee: g.monthlyFee,
      status: g.status,
    }));

    const grades = await Grade.find().populate('student', 'firstName lastName');
    const studentScores = {};

    grades.forEach((g) => {
      const id = g.student._id.toString();
      if (!studentScores[id]) {
        studentScores[id] = {
          student: g.student,
          scores: [],
        };
      }
      studentScores[id].scores.push((g.score / g.maxScore) * 100);
    });

    const topStudents = Object.values(studentScores)
      .map((s) => ({
        student: s.student,
        average: Math.round(
          s.scores.reduce((a, b) => a + b, 0) / s.scores.length
        ),
        gradeCount: s.scores.length,
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 10);

    res.json({
      success: true,
      data: { groups: data, topStudents },
    });
  } catch (error) {
    next(error);
  }
};
