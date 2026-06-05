import { useParams } from 'react-router-dom';
import { Card, Tabs, Table, Tag, Row, Col, Statistic, Descriptions } from 'antd';
import PageHeader from '../../components/ui/PageHeader';
import { useGetStudentQuery } from '../../features/api/apiSlice';
import {
  formatCurrency,
  formatDate,
  formatMonth,
  statusLabels,
  statusColors,
} from '../../utils/formatters';

const StudentDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetStudentQuery(id);
  const { student, payments, grades, attendance, stats } = data?.data || {};

  const gradeColumns = [
    { title: 'Turi', dataIndex: 'type', render: (t) => statusLabels[t] },
    { title: 'Ball', render: (_, r) => `${r.score}/${r.maxScore}` },
    { title: 'Sana', dataIndex: 'date', render: formatDate },
    { title: 'Izoh', dataIndex: 'comment' },
  ];

  const paymentColumns = [
    { title: 'Oy', dataIndex: 'month', render: formatMonth },
    { title: 'Guruh', dataIndex: ['group', 'name'] },
    { title: 'Summa', dataIndex: 'amount', render: formatCurrency },
    {
      title: 'Holat',
      dataIndex: 'status',
      render: (s) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>,
    },
    { title: 'To\'langan sana', dataIndex: 'paidAt', render: formatDate },
  ];

  const attendanceColumns = [
    { title: 'Sana', dataIndex: 'date', render: formatDate },
    {
      title: 'Holat',
      dataIndex: 'status',
      render: (s) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>,
    },
    { title: 'Izoh', dataIndex: 'note' },
  ];

  const tabItems = [
    {
      key: 'overview',
      label: 'Umumiy',
      children: (
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic title="Davomat %" value={stats?.attendancePercent || 0} suffix="%" />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="O'rtacha baho" value={stats?.avgGrade || 0} suffix="%" />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="To'lanmagan" value={stats?.unpaidCount || 0} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'attendance',
      label: 'Davomat',
      children: (
        <Table
          columns={attendanceColumns}
          dataSource={attendance || []}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'grades',
      label: 'Baholar',
      children: (
        <Table
          columns={gradeColumns}
          dataSource={grades || []}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'payments',
      label: 'To\'lovlar',
      children: (
        <Table
          columns={paymentColumns}
          dataSource={payments || []}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <PageHeader
        title={student ? `${student.firstName} ${student.lastName}` : 'O\'quvchi'}
        subtitle="O'quvchi profili"
      />

      <Card loading={isLoading} style={{ marginBottom: 24 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Telefon">{student?.phone}</Descriptions.Item>
          <Descriptions.Item label="Email">{student?.email || '-'}</Descriptions.Item>
          <Descriptions.Item label="Guruh">{student?.group?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Daraja">{student?.level}</Descriptions.Item>
          <Descriptions.Item label="Holat">
            <Tag color={statusColors[student?.status]}>
              {statusLabels[student?.status]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tug'ilgan sana">
            {formatDate(student?.birthDate)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Tabs items={tabItems} />
    </div>
  );
};

export default StudentDetail;
