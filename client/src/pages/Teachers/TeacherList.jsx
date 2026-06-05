import { useState } from 'react';
import { Table, Button, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '../../components/ui/PageHeader';
import TeacherForm from './TeacherForm';
import { useGetTeachersQuery } from '../../features/api/apiSlice';
import { formatCurrency, statusLabels, statusColors } from '../../utils/formatters';

const TeacherList = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const { data, isLoading, refetch } = useGetTeachersQuery();

  const columns = [
    {
      title: 'Ism',
      render: (_, r) => `${r.firstName} ${r.lastName}`,
    },
    { title: 'Telefon', dataIndex: 'phone' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Tillar',
      dataIndex: 'languages',
      render: (langs) => langs?.map((l) => <Tag key={l}>{l}</Tag>),
    },
    {
      title: 'Darajalar',
      dataIndex: 'levels',
      render: (levels) => levels?.join(', '),
    },
    {
      title: 'Maosh',
      dataIndex: 'salary',
      render: formatCurrency,
    },
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
          onClick={() => {
            setEditTeacher(r);
            setFormOpen(true);
          }}
        >
          Tahrirlash
        </Button>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <PageHeader
        title="O'qituvchilar"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditTeacher(null);
              setFormOpen(true);
            }}
          >
            O'qituvchi qo'shish
          </Button>
        }
      />

      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="_id"
        loading={isLoading}
      />

      <TeacherForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTeacher(null);
        }}
        teacher={editTeacher}
        onSuccess={refetch}
      />
    </div>
  );
};

export default TeacherList;
