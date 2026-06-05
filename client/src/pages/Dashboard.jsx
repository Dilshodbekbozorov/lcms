import { Row, Col, Card, Table, Tag, Button, Space } from 'antd';
import { TeamOutlined, UsergroupAddOutlined, DollarOutlined, WarningOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/ui/StatCard';
import PageHeader from '../components/ui/PageHeader';
import { useGetDashboardQuery, useGetRevenueQuery } from '../features/api/apiSlice';
import { formatCurrency, formatDate, formatMonth, statusLabels, statusColors } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { data: dashboard, isLoading } = useGetDashboardQuery(undefined, { skip: !isAdmin });
  const { data: revenue } = useGetRevenueQuery(undefined, { skip: !isAdmin });

  const stats = dashboard?.data;
  const revenueData = revenue?.data?.map((r) => ({
    month: formatMonth(r.month),
    revenue: r.revenue,
  })) || [];

  const paymentColumns = [
    {
      title: 'O\'quvchi',
      render: (_, r) => `${r.student?.firstName} ${r.student?.lastName}`,
    },
    { title: 'Guruh', dataIndex: ['group', 'name'] },
    {
      title: 'Summa',
      dataIndex: 'amount',
      render: (v) => formatCurrency(v),
    },
    {
      title: 'Sana',
      dataIndex: 'paidAt',
      render: formatDate,
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      render: (s) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>,
    },
  ];

  if (!isAdmin) {
    return (
      <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
        <PageHeader title="Boshqaruv paneli" subtitle="Xush kelibsiz!" />
        <p>O'z guruhlaringiz va baholaringizni ko'rish uchun menyudan foydalaning.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Boshqaruv paneli"
        subtitle="Til o'quv markazi statistikasi"
        extra={
          <Space>
            <Button icon={<PlusOutlined />} onClick={() => navigate('/students')}>
              O'quvchi qo'shish
            </Button>
            <Button type="primary" icon={<DollarOutlined />} onClick={() => navigate('/payments')}>
              To'lov qayd etish
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Jami o'quvchilar"
            value={stats?.totalStudents || 0}
            prefix={<TeamOutlined />}
            color="#1677ff"
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Faol guruhlar"
            value={stats?.activeGroups || 0}
            prefix={<UsergroupAddOutlined />}
            color="#52c41a"
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Oylik daromad"
            value={formatCurrency(stats?.monthlyRevenue || 0)}
            prefix={<DollarOutlined />}
            color="#722ed1"
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="To'lanmagan"
            value={stats?.unpaidCount || 0}
            prefix={<WarningOutlined />}
            color="#fa8c16"
            loading={isLoading}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Oylik daromad (6 oy)" style={{ marginBottom: 16 }}>
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
        <Col xs={24} lg={10}>
          <Card title="Bugungi darslar" style={{ marginBottom: 16 }}>
            {stats?.todaySchedule?.length > 0 ? (
              stats.todaySchedule.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 0',
                    borderBottom: i < stats.todaySchedule.length - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  <strong>{s.groupName}</strong>
                  <div style={{ color: '#666', fontSize: 13 }}>
                    {s.startTime} - {s.endTime} | {s.room} | {s.teacher}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#999' }}>Bugun darslar yo'q</p>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="So'nggi to'lovlar">
        <Table
          columns={paymentColumns}
          dataSource={stats?.recentPayments || []}
          rowKey="_id"
          pagination={false}
          loading={isLoading}
          size="small"
        />
      </Card>
    </div>
  );
};

export default Dashboard;
