import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import uzUZ from 'antd/locale/uz_UZ';
import PrivateRoute from './components/layout/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/Students/StudentList';
import StudentDetail from './pages/Students/StudentDetail';
import GroupList from './pages/Groups/GroupList';
import GroupDetail from './pages/Groups/GroupDetail';
import TeacherList from './pages/Teachers/TeacherList';
import PaymentList from './pages/Payments/PaymentList';
import AttendancePage from './pages/Attendance/AttendancePage';
import GradesPage from './pages/Grades/GradesPage';
import SchedulePage from './pages/Schedule/SchedulePage';
import ReportsPage from './pages/Reports/ReportsPage';
import SettingsPage from './pages/Settings/SettingsPage';

const App = () => {
  return (
    <ConfigProvider
      locale={uzUZ}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="students"
              element={
                <PrivateRoute roles={['admin', 'teacher']}>
                  <StudentList />
                </PrivateRoute>
              }
            />
            <Route
              path="students/:id"
              element={
                <PrivateRoute roles={['admin', 'teacher']}>
                  <StudentDetail />
                </PrivateRoute>
              }
            />
            <Route path="groups" element={<GroupList />} />
            <Route path="groups/:id" element={<GroupDetail />} />
            <Route
              path="teachers"
              element={
                <PrivateRoute roles={['admin']}>
                  <TeacherList />
                </PrivateRoute>
              }
            />
            <Route
              path="payments"
              element={
                <PrivateRoute roles={['admin', 'student']}>
                  <PaymentList />
                </PrivateRoute>
              }
            />
            <Route
              path="attendance"
              element={
                <PrivateRoute roles={['admin', 'teacher']}>
                  <AttendancePage />
                </PrivateRoute>
              }
            />
            <Route path="grades" element={<GradesPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route
              path="reports"
              element={
                <PrivateRoute roles={['admin']}>
                  <ReportsPage />
                </PrivateRoute>
              }
            />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
