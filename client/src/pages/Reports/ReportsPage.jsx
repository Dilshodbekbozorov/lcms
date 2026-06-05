import { Card, Table, Row, Col } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import PageHeader from '../../components/ui/PageHeader';
import {
  useGetRevenueQuery,
  useGetAttendanceReportQuery,
  useGetGroupsReportQuery,
} from '../../features/api/apiSlice';
import { formatCurrency, formatMonth } from '../../utils/formatters';

const ReportsPage = () => {
  const { data: revenue } = useGetRevenueQuery();
  const { data: attendance } = useGetAttendanceReportQuery();
  const { data: groupsReport } = useGetGroupsReportQuery();

  const revenueData = revenue?.data?.map((r) => ({
    month: formatMonth(r.month),
    revenue: r.revenue,
  })) || [];

  const attendanceData = attendance?.data?.map((a) => ({
    name: a.groupName,
    rate: a.attendanceRate,
  })) || [];

  const groupColumns = [
    { title: 'Guruh', dataIndex: 'name' },
    { title: 'Til', dataIndex: 'language' },
    { title: 'Daraja', dataIndex: 'level' },
    { title: 'O\'qituvchi', dataIndex: 'teacher' },
    {
      title: 'To\'ldirish',
      render: (_, r) => `${r.studentCount}/${r.maxStudents} (${r.fillRate}%)`,
    },
    {
      title: 'Oylik to\'lov',
      dataIndex: 'monthlyFee',
      render: formatCurrency,
    },
  ];

  const topStudentColumns = [
    {
      title: 'O\'quvchi',
      render: (_, r) => `${r.student?.firstName} ${r.student?.lastName}`,
    },
    { title: 'O\'rtacha baho', dataIndex: 'average', render: (v) => `${v}%` },
    { title: 'Baholar soni', dataIndex: 'gradeCount' },
  ];

  return (
    <div>
      <PageHeader title="Hisobotlar" subtitle="Markaz statistikasi va tahlili" />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Oylik daromad">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#1677ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Davomat foizi (guruhlar bo'yicha)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="rate" fill="#52c41a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="Guruhlar to'ldirish darajasi">
            <Table
              columns={groupColumns}
              dataSource={groupsReport?.data?.groups || []}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Eng yaxshi o'quvchilar">
            <Table
              columns={topStudentColumns}
              dataSource={groupsReport?.data?.topStudents || []}
              rowKey={(r) => r.student?._id}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsPage;
