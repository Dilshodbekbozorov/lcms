import { useState } from 'react';
import { Table, Button, Tag, Tabs, DatePicker, Card, Row, Col, Statistic, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PageHeader from '../../components/ui/PageHeader';
import PaymentForm from './PaymentForm';
import {
  useGetPaymentsQuery,
  useGetDebtorsQuery,
  useGetPaymentSummaryQuery,
} from '../../features/api/apiSlice';
import { formatCurrency, formatMonth, statusLabels, statusColors } from '../../utils/formatters';

const PaymentList = () => {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [formOpen, setFormOpen] = useState(false);
  const [editPayment, setEditPayment] = useState(null);

  const { data: payments, isLoading, refetch } = useGetPaymentsQuery({ month });
  const { data: debtors } = useGetDebtorsQuery({ month });
  const { data: summary } = useGetPaymentSummaryQuery({ month });

  const columns = [
    {
      title: 'O\'quvchi',
      render: (_, r) => `${r.student?.firstName} ${r.student?.lastName}`,
    },
    { title: 'Guruh', dataIndex: ['group', 'name'] },
    {
      title: 'Kutilgan',
      render: (_, r) => formatCurrency(r.group?.monthlyFee || r.amount),
    },
    { title: 'To\'langan', dataIndex: 'amount', render: formatCurrency },
    {
      title: 'Holat',
      dataIndex: 'status',
      render: (s) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>,
    },
    {
      title: 'Amallar',
      render: (_, r) => (
        <Button
          size="small"
          type="primary"
          onClick={() => {
            setEditPayment(r);
            setFormOpen(true);
          }}
        >
          To'lov qayd etish
        </Button>
      ),
    },
  ];

  const summaryData = summary?.data;

  const tabItems = [
    {
      key: 'all',
      label: 'Barcha to\'lovlar',
      children: (
        <Table
          columns={columns}
          dataSource={payments?.data || []}
          rowKey="_id"
          loading={isLoading}
        />
      ),
    },
    {
      key: 'debtors',
      label: `Qarzdorlar (${debtors?.count || 0})`,
      children: (
        <Table
          columns={columns}
          dataSource={debtors?.data || []}
          rowKey="_id"
        />
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <PageHeader
        title="To'lovlar"
        extra={
          <Space>
            <DatePicker
              picker="month"
              value={dayjs(month)}
              onChange={(d) => setMonth(d.format('YYYY-MM'))}
              format="MMMM YYYY"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditPayment(null);
                setFormOpen(true);
              }}
            >
              To'lov qayd etish
            </Button>
          </Space>
        }
      />

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Yig'ilgan"
              value={formatCurrency(summaryData?.totalCollected || 0)}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Kutilgan"
              value={formatCurrency(summaryData?.totalExpected || 0)}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Qarz"
              value={formatCurrency(summaryData?.outstanding || 0)}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs items={tabItems} />

      <PaymentForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditPayment(null);
        }}
        payment={editPayment}
        defaultMonth={month}
        onSuccess={refetch}
      />
    </div>
  );
};

export default PaymentList;
