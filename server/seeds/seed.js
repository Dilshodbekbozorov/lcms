require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Group = require('../models/Group');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB ulandi');
};

const clearData = async () => {
  await Promise.all([
    User.deleteMany(),
    Teacher.deleteMany(),
    Student.deleteMany(),
    Group.deleteMany(),
    Payment.deleteMany(),
    Attendance.deleteMany(),
    Grade.deleteMany(),
  ]);
  console.log('Eski ma\'lumotlar tozalandi');
};

const seed = async () => {
  try {
    await connectDB();
    await clearData();

    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@lcms.uz',
      password: 'Admin1234!',
      role: 'admin',
      isActive: true,
    });

    const teachersData = [
      {
        firstName: 'Sardor',
        lastName: 'Karimov',
        phone: '+998901234567',
        email: 'sardor@lcms.uz',
        languages: ['English'],
        levels: ['B1', 'B2', 'C1'],
        salary: 5000000,
        password: 'Teacher123!',
      },
      {
        firstName: 'Dilnoza',
        lastName: 'Rahimova',
        phone: '+998901234568',
        email: 'dilnoza@lcms.uz',
        languages: ['Russian'],
        levels: ['A1', 'A2', 'B1'],
        salary: 4500000,
        password: 'Teacher123!',
      },
      {
        firstName: 'Jasur',
        lastName: 'Toshmatov',
        phone: '+998901234569',
        email: 'jasur@lcms.uz',
        languages: ['Chinese'],
        levels: ['A1', 'A2'],
        salary: 4800000,
        password: 'Teacher123!',
      },
    ];

    const teachers = [];
    for (const t of teachersData) {
      const { password, ...teacherInfo } = t;
      const teacher = await Teacher.create(teacherInfo);
      await User.create({
        name: `${teacher.firstName} ${teacher.lastName}`,
        email: teacher.email,
        password,
        role: 'teacher',
        linkedId: teacher._id,
      });
      teachers.push(teacher);
    }

    const groupsData = [
      {
        name: 'ENG-B1-01',
        language: 'English',
        level: 'B1',
        teacher: teachers[0]._id,
        maxStudents: 12,
        monthlyFee: 1200000,
        schedule: [
          { day: 'Monday', startTime: '09:00', endTime: '11:00', room: '101' },
          { day: 'Wednesday', startTime: '09:00', endTime: '11:00', room: '101' },
          { day: 'Friday', startTime: '09:00', endTime: '11:00', room: '101' },
        ],
        startDate: new Date('2024-01-15'),
        status: 'active',
      },
      {
        name: 'ENG-B2-01',
        language: 'English',
        level: 'B2',
        teacher: teachers[0]._id,
        maxStudents: 10,
        monthlyFee: 1500000,
        schedule: [
          { day: 'Tuesday', startTime: '14:00', endTime: '16:00', room: '102' },
          { day: 'Thursday', startTime: '14:00', endTime: '16:00', room: '102' },
        ],
        startDate: new Date('2024-02-01'),
        status: 'active',
      },
      {
        name: 'RUS-A1-01',
        language: 'Russian',
        level: 'A1',
        teacher: teachers[1]._id,
        maxStudents: 12,
        monthlyFee: 1000000,
        schedule: [
          { day: 'Monday', startTime: '11:00', endTime: '13:00', room: '201' },
          { day: 'Wednesday', startTime: '11:00', endTime: '13:00', room: '201' },
        ],
        startDate: new Date('2024-01-20'),
        status: 'active',
      },
      {
        name: 'RUS-A2-01',
        language: 'Russian',
        level: 'A2',
        teacher: teachers[1]._id,
        maxStudents: 12,
        monthlyFee: 1100000,
        schedule: [
          { day: 'Tuesday', startTime: '10:00', endTime: '12:00', room: '202' },
          { day: 'Thursday', startTime: '10:00', endTime: '12:00', room: '202' },
        ],
        startDate: new Date('2024-03-01'),
        status: 'active',
      },
      {
        name: 'CHN-A1-01',
        language: 'Chinese',
        level: 'A1',
        teacher: teachers[2]._id,
        maxStudents: 8,
        monthlyFee: 1300000,
        schedule: [
          { day: 'Saturday', startTime: '10:00', endTime: '12:00', room: '301' },
        ],
        startDate: new Date('2024-02-15'),
        status: 'active',
      },
      {
        name: 'CHN-A2-01',
        language: 'Chinese',
        level: 'A2',
        teacher: teachers[2]._id,
        maxStudents: 8,
        monthlyFee: 1400000,
        schedule: [
          { day: 'Saturday', startTime: '14:00', endTime: '16:00', room: '301' },
        ],
        startDate: new Date('2024-03-15'),
        status: 'active',
      },
    ];

    const groups = await Group.insertMany(groupsData);

    const firstNames = [
      'Ali', 'Vali', 'Gulnora', 'Bobur', 'Madina',
      'Javohir', 'Nilufar', 'Rustam', 'Sevara', 'Kamol',
      'Diyora', 'Shahzod', 'Maftuna', 'Bekzod', 'Zarina',
      'Otabek', 'Feruza', 'Sherzod', 'Laylo', 'Aziz',
      'Nodira', 'Jasmina', 'Timur', 'Mohira', 'Sardor',
      'Dilbar', 'Farhod', 'Malika', 'Ulugbek', 'Shoira',
    ];
    const lastNames = [
      'Alimov', 'Valiyev', 'Karimova', 'Rahimov', 'Toshmatova',
      'Yusupov', 'Nazarova', 'Saidov', 'Ergasheva', 'Qodirov',
      'Mirzayeva', 'Xolmatov', 'Ismoilova', 'Abdullayev', 'Rustamova',
      'Juraev', 'Sobirova', 'Mamatov', 'Xasanova', 'Olimov',
      'Raxmonova', 'Tursunova', 'Berdiyev', 'Qosimova', 'Nurmatov',
      'Axmedova', 'Sattorov', 'Yuldasheva', 'Eshmatov', 'Fayziyeva',
    ];

    const students = [];
    let nameIndex = 0;

    for (const group of groups) {
      const groupStudents = [];
      for (let i = 0; i < 5; i++) {
        const student = await Student.create({
          firstName: firstNames[nameIndex],
          lastName: lastNames[nameIndex],
          phone: `+99890${String(1000000 + nameIndex).slice(1)}`,
          email: `student${nameIndex + 1}@mail.uz`,
          birthDate: new Date(2000 + (nameIndex % 10), nameIndex % 12, (nameIndex % 28) + 1),
          gender: nameIndex % 2 === 0 ? 'male' : 'female',
          group: group._id,
          level: group.level,
          status: 'active',
        });
        groupStudents.push(student._id);
        students.push(student);
        nameIndex++;
      }
      group.students = groupStudents;
      await group.save();
    }

    const months = [];
    const now = new Date();
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toISOString().slice(0, 7));
    }

    const paymentStatuses = ['paid', 'paid', 'paid', 'unpaid', 'partial'];
    for (const student of students) {
      const group = groups.find((g) => g._id.equals(student.group));
      for (const month of months) {
        const status = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
        const amount =
          status === 'paid'
            ? group.monthlyFee
            : status === 'partial'
            ? Math.round(group.monthlyFee * 0.5)
            : 0;

        await Payment.create({
          student: student._id,
          group: group._id,
          amount,
          month,
          paymentMethod: status !== 'unpaid' ? ['cash', 'card', 'transfer'][Math.floor(Math.random() * 3)] : undefined,
          status,
          paidAt: status !== 'unpaid' ? new Date(`${month}-15`) : undefined,
          receivedBy: status !== 'unpaid' ? admin._id : undefined,
        });
      }
    }

    const attendanceStatuses = ['present', 'present', 'present', 'absent', 'late', 'excused'];
    for (let dayOffset = 14; dayOffset >= 0; dayOffset -= 2) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);

      for (const group of groups) {
        const groupStudentIds = group.students;
        for (const studentId of groupStudentIds) {
          const status =
            attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
          await Attendance.create({
            group: group._id,
            student: studentId,
            date,
            status,
            markedBy: admin._id,
          });
        }
      }
    }

    const gradeTypes = ['test', 'homework', 'oral', 'midterm'];
    for (const student of students) {
      for (let i = 0; i < 3; i++) {
        await Grade.create({
          student: student._id,
          group: student.group,
          type: gradeTypes[i % gradeTypes.length],
          score: 60 + Math.floor(Math.random() * 35),
          maxScore: 100,
          date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
          gradedBy: admin._id,
          comment: 'Yaxshi natija',
        });
      }
    }

    console.log('Seed ma\'lumotlari muvaffaqiyatli yuklandi!');
    console.log(`Admin: admin@lcms.uz / Admin1234!`);
    console.log(`O\'qituvchilar: ${teachers.length}, Guruhlar: ${groups.length}, O\'quvchilar: ${students.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed xatosi:', error);
    process.exit(1);
  }
};

seed();
