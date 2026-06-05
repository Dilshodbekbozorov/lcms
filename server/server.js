require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const studentsRoutes = require('./routes/students.routes');
const groupsRoutes = require('./routes/groups.routes');
const teachersRoutes = require('./routes/teachers.routes');
const paymentsRoutes = require('./routes/payments.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const gradesRoutes = require('./routes/grades.routes');
const reportsRoutes = require('./routes/reports.routes');

connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'LCMS API ishlayapti' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentsRoutes);
app.use('/api/v1/groups', groupsRoutes);
app.use('/api/v1/teachers', teachersRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/grades', gradesRoutes);
app.use('/api/v1/reports', reportsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishga tushdi`);
});
