import { useState } from 'react';
import { Table, Button, Input, Select, Tag, Space, message } from 'antd';
import { PlusOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import StudentForm from './StudentForm';
import {
  useGetStudentsQuery,
  useDeleteStudentMutation,
} from '../../features/api/apiSlice';
import { useGetGroupsQuery } from '../../features/api/apiSlice';
import { statusLabels, statusColors } from '../../utils/formatters';
import api from '../../utils/axios';

const StudentList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  const { data, isLoading, refetch } = useGetStudentsQuery(filters);
  const { data: groupsData } = useGetGroupsQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  const handleExport = async () => {
    try {
      const response = await api.get('/students/export', {
        params: filters,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'oquvchilar.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('Excel fayl yuklab olindi');
    } catch {
      message.error('Eksport xatosi');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id).unwrap();
      message.success('O\'quvchi arxivlandi');
      refetch();
    } catch (err) {
      message.error(err.data?.message || 'Xatolik');
    }
  };

  const columns = [
    {
      title: 'Ism',
      render: (_, r) => `${r.firstName} ${r.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    { title: 'Telefon', dataIndex: 'phone' },
    { title: 'Guruh', dataIndex: ['group', 'name'], render: (v) => v || '-' },
    { title: 'Daraja', dataIndex: 'level' },
    {
      title: 'Holat',
      dataIndex: 'status',
      render: (s) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>,
    },
    {
      title: 'To\'lov',
      dataIndex: 'paymentStatus',
      render: (s) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>,
    },
    {
      title: 'Amallar',
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/students/${r._id}`)}>
            Ko'rish
          </Button>
          <Button
            size="small"
            onClick={() => {
              setEditStudent(r);
              setFormOpen(true);
            }}
          >
            Tahrirlash
          </Button>
          <Button size="small" danger onClick={() => handleDelete(r._id)}>
            Arxiv
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <PageHeader
        title="O'quvchilar"
        extra={
          <Space>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Excel eksport
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditStudent(null);
                setFormOpen(true);
              }}
            >
              O'quvchi qo'shish
            </Button>
          </Space>
        }
      />

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Guruh"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => setFilters({ ...filters, group: v })}
          options={groupsData?.data?.map((g) => ({ value: g._id, label: g.name }))}
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
          options={['active', 'inactive', 'graduated'].map((s) => ({
            value: s,
            label: statusLabels[s],
          }))}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="_id"
        loading={isLoading}
        onRow={(r) => ({ onClick: () => navigate(`/students/${r._id}`), style: { cursor: 'pointer' } })}
      />

      <StudentForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditStudent(null);
        }}
        student={editStudent}
        onSuccess={refetch}
      />
    </div>
  );
};

export default StudentList;
