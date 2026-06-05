import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Students', 'Student', 'Groups', 'Group', 'Teachers',
    'Payments', 'Attendance', 'Grades', 'Reports', 'Users',
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => '/auth/users',
      providesTags: ['Users'],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: '/auth/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),

    getStudents: builder.query({
      query: (params) => ({ url: '/students', params }),
      providesTags: ['Students'],
    }),
    getStudent: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: (r, e, id) => [{ type: 'Student', id }],
    }),
    createStudent: builder.mutation({
      query: (data) => ({ url: '/students', method: 'POST', body: data }),
      invalidatesTags: ['Students', 'Groups'],
    }),
    updateStudent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Students', 'Student', 'Groups'],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({ url: `/students/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Students', 'Groups'],
    }),

    getGroups: builder.query({
      query: (params) => ({ url: '/groups', params }),
      providesTags: ['Groups'],
    }),
    getGroup: builder.query({
      query: (id) => `/groups/${id}`,
      providesTags: (r, e, id) => [{ type: 'Group', id }],
    }),
    createGroup: builder.mutation({
      query: (data) => ({ url: '/groups', method: 'POST', body: data }),
      invalidatesTags: ['Groups'],
    }),
    updateGroup: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/groups/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Groups', 'Group'],
    }),
    deleteGroup: builder.mutation({
      query: (id) => ({ url: `/groups/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Groups'],
    }),
    getSchedule: builder.query({
      query: () => '/groups/schedule/all',
      providesTags: ['Groups'],
    }),

    getTeachers: builder.query({
      query: (params) => ({ url: '/teachers', params }),
      providesTags: ['Teachers'],
    }),
    createTeacher: builder.mutation({
      query: (data) => ({ url: '/teachers', method: 'POST', body: data }),
      invalidatesTags: ['Teachers'],
    }),
    updateTeacher: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/teachers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Teachers'],
    }),

    getPayments: builder.query({
      query: (params) => ({ url: '/payments', params }),
      providesTags: ['Payments'],
    }),
    createPayment: builder.mutation({
      query: (data) => ({ url: '/payments', method: 'POST', body: data }),
      invalidatesTags: ['Payments', 'Reports'],
    }),
    updatePayment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/payments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Payments', 'Reports'],
    }),
    getDebtors: builder.query({
      query: (params) => ({ url: '/payments/debtors', params }),
      providesTags: ['Payments'],
    }),
    getPaymentSummary: builder.query({
      query: (params) => ({ url: '/payments/summary', params }),
      providesTags: ['Payments'],
    }),

    getAttendance: builder.query({
      query: (params) => ({ url: '/attendance', params }),
      providesTags: ['Attendance'],
    }),
    bulkAttendance: builder.mutation({
      query: (data) => ({ url: '/attendance/bulk', method: 'POST', body: data }),
      invalidatesTags: ['Attendance', 'Group', 'Student'],
    }),
    getAttendanceStats: builder.query({
      query: (groupId) => `/attendance/stats/${groupId}`,
      providesTags: ['Attendance'],
    }),

    getGrades: builder.query({
      query: (params) => ({ url: '/grades', params }),
      providesTags: ['Grades'],
    }),
    createGrade: builder.mutation({
      query: (data) => ({ url: '/grades', method: 'POST', body: data }),
      invalidatesTags: ['Grades', 'Student'],
    }),
    deleteGrade: builder.mutation({
      query: (id) => ({ url: `/grades/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Grades', 'Student'],
    }),
    getGradeSummary: builder.query({
      query: (studentId) => `/grades/summary/${studentId}`,
    }),

    getDashboard: builder.query({
      query: () => '/reports/dashboard',
      providesTags: ['Reports'],
    }),
    getRevenue: builder.query({
      query: () => '/reports/revenue',
      providesTags: ['Reports'],
    }),
    getAttendanceReport: builder.query({
      query: () => '/reports/attendance',
      providesTags: ['Reports'],
    }),
    getGroupsReport: builder.query({
      query: () => '/reports/groups',
      providesTags: ['Reports'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useChangePasswordMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetScheduleQuery,
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useGetDebtorsQuery,
  useGetPaymentSummaryQuery,
  useGetAttendanceQuery,
  useBulkAttendanceMutation,
  useGetAttendanceStatsQuery,
  useGetGradesQuery,
  useCreateGradeMutation,
  useDeleteGradeMutation,
  useGetGradeSummaryQuery,
  useGetDashboardQuery,
  useGetRevenueQuery,
  useGetAttendanceReportQuery,
  useGetGroupsReportQuery,
} = apiSlice;
