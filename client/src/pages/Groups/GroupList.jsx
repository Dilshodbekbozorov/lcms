import { useState } from 'react';
import { Row, Col, Card, Tag, Button, Select, Space } from 'antd';
import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import GroupForm from './GroupForm';
import { useGetGroupsQuery } from '../../features/api/apiSlice';
import { formatCurrency, statusLabels, statusColors } from '../../utils/formatters';

const GroupList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const { data, isLoading, refetch } = useGetGroupsQuery(filters);

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <PageHeader
        title="Guruhlar"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormOpen(true)}>
            Guruh qo'shish
          </Button>
        }
      />

      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Til"
          allowClear
          style={{ width: 140 }}
          onChange={(v) => setFilters({ ...filters, language: v })}
          options={['English', 'Russian', 'Chinese'].map((l) => ({
            value: l,
            label: l,
          }))}
        />
        <Select
          placeholder="Daraja"
          allowClear
          style={{ width: 120 }}
          onChange={(v) => setFilters({ ...filters, level: v })}
          options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => ({
            value: l,
            label: l,
          }))}
        />
        <Select
          placeholder="Holat"
          allowClear
          style={{ width: 130 }}
          onChange={(v) => setFilters({ ...filters, status: v })}
          options={['active', 'paused', 'completed'].map((s) => ({
            value: s,
            label: statusLabels[s],
          }))}
        />
      </Space>

      <Row gutter={[16, 16]}>
        {data?.data?.map((group) => (
          <Col xs={24} sm={12} lg={8} key={group._id}>
            <Card
              hoverable
              onClick={() => navigate(`/groups/${group._id}`)}
              title={group.name}
              extra={
                <Tag color={statusColors[group.status]}>
                  {statusLabels[group.status]}
                </Tag>
              }
            >
              <p><strong>Til:</strong> {group.language}</p>
              <p><strong>Daraja:</strong> {group.level}</p>
              <p>
                <strong>O'qituvchi:</strong>{' '}
                {group.teacher
                  ? `${group.teacher.firstName} ${group.teacher.lastName}`
                  : 'Tayinlanmagan'}
              </p>
              <p>
                <TeamOutlined /> {group.students?.length || 0} / {group.maxStudents} o'quvchi
              </p>
              <p><strong>Oylik to'lov:</strong> {formatCurrency(group.monthlyFee)}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <GroupForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default GroupList;
