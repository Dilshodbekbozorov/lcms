import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token } = useSelector((state) => state.auth);

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const isAuthenticated = !!token && !!user;

  return { user, token, isAdmin, isTeacher, isStudent, isAuthenticated };
};
