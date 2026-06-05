import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Tag, Button, Descriptions, Row, Col, Progress } from 'antd';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import PageHeader from '../../components/ui/PageHeader';
import GroupForm from './GroupForm';
import { useGetGroupQuery } from '../../features/api/apiSlice';
import { formatCurrency, formatDate, statusLabels, statusColors } from '../../utils/formatters';

const dayLabels = {
  Monday: 'Dushanba',
  Tuesday: 'Seshanba',
  Wednesday: 'Chorshanba',
  Thursday: 'Payshanba',
  Friday: 'Juma',
  Saturday: 'Shanba',
  Sunday: 'Yakshanba',
};

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const { data, isLoading, refetch } = useGetGroupQuery(id);
  const group = data?.data;

  const studentColumns = [
    {
      title: 'Ism',
      render: (_, r) => `${r.firstName} ${r.lastName}`,
    },
    { title: 'Telefon', dataIndex: 'phone' },
    {
      title: 'Davomat %',
      dataIndex: 'attendancePercent',
      render: (v) => <Progress percent={v || 0} size="small" />,
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <PageHeader
        title={group?.name || 'Guruh'}
        extra={
          <Button icon={<EditOutlined />} onClick={() => setFormOpen(true)}>
            Tahrirlash
          </Button>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Guruh ma'lumotlari" loading={isLoading}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Til">{group?.language}</Descriptions.Item>
              <Descriptions.Item label="Daraja">{group?.level}</Descriptions.Item>
              <Descriptions.Item label="Holat">
                <Tag color={statusColors[group?.status]}>
                  {statusLabels[group?.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Oylik to'lov">
                {formatCurrency(group?.monthlyFee)}
              </Descriptions.Item>
              <Descriptions.Item label="Boshlanish">
                {formatDate(group?.startDate)}
              </Descriptions.Item>
              <Descriptions.Item label="O'quvchilar">
                {group?.students?.length || 0} / {group?.maxStudents}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title="O'quvchilar"
            style={{ marginTop: 16 }}
            extra={
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => navigate(`/attendance?group=${id}`)}
              >
                Davomat olish
              </Button>
            }
          >
            <Table
              columns={studentColumns}
              dataSource={group?.students || []}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="O'qituvchi" loading={isLoading}>
            {group?.teacher ? (
              <Descriptions column={1}>
                <Descriptions.Item label="Ism">
                  {group.teacher.firstName} {group.teacher.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Telefon">{group.teacher.phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{group.teacher.email}</Descriptions.Item>
              </Descriptions>
            ) : (
              <p style={{ color: '#999' }}>O'qituvchi tayinlanmagan</p>
            )}
          </Card>

          <Card title="Haftalik jadval" style={{ marginTop: 16 }} loading={isLoading}>
            {group?.schedule?.map((s, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                <strong>{dayLabels[s.day]}</strong>
                <div style={{ color: '#666' }}>
                  {s.startTime} - {s.endTime} | Xona: {s.room || '-'}
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <GroupForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        group={group}
        onSuccess={refetch}
      />
    </div>
  );
};

export default GroupDetail;
