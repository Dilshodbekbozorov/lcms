import { useState } from 'react';
import { Card, Select, Table, Button, Modal, Form, Input, InputNumber, DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import PageHeader from '../../components/ui/PageHeader';
import {
  useGetGroupsQuery,
  useGetGroupQuery,
  useGetGradesQuery,
  useCreateGradeMutation,
  useDeleteGradeMutation,
} from '../../features/api/apiSlice';
import { formatDate, statusLabels } from '../../utils/formatters';

const GradesPage = () => {
  const [groupId, setGroupId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();

  const { data: groupsData } = useGetGroupsQuery();
  const { data: groupData } = useGetGroupQuery(groupId, { skip: !groupId });
  const { data: gradesData, refetch } = useGetGradesQuery(
    { group: groupId },
    { skip: !groupId }
  );
  const [createGrade, { isLoading }] = useCreateGradeMutation();
  const [deleteGrade] = useDeleteGradeMutation();

  const handleAddGrade = (student) => {
    setSelectedStudent(student);
    form.setFieldsValue({ student: student._id, group: groupId, date: dayjs() });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createGrade({
        ...values,
        date: values.date?.toISOString(),
      }).unwrap();
      message.success('Baho qo\'shildi');
      setFormOpen(false);
      form.resetFields();
      refetch();
    } catch (err) {
      message.error(err.data?.message || 'Xatolik');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGrade(id).unwrap();
      message.success('Baho o\'chirildi');
      refetch();
    } catch (err) {
      message.error(err.data?.message || 'Xatolik');
    }
  };

  const studentColumns = [
    {
      title: 'O\'quvchi',
      render: (_, r) => `${r.firstName} ${r.lastName}`,
    },
    {
      title: 'Amallar',
      render: (_, r) => (
        <Button size="small" type="primary" onClick={() => handleAddGrade(r)}>
          Baho qo'shish
        </Button>
      ),
    },
  ];

  const gradeColumns = [
    {
      title: 'O\'quvchi',
      render: (_, r) => `${r.student?.firstName} ${r.student?.lastName}`,
    },
    { title: 'Turi', dataIndex: 'type', render: (t) => statusLabels[t] },
    { title: 'Ball', render: (_, r) => `${r.score}/${r.maxScore}` },
    { title: 'Sana', dataIndex: 'date', render: formatDate },
    { title: 'Izoh', dataIndex: 'comment' },
    {
      title: 'Amallar',
      render: (_, r) => (
        <Button size="small" danger onClick={() => handleDelete(r._id)}>
          O'chirish
        </Button>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <PageHeader title="Baholar" subtitle="O'quvchi baholarini boshqarish" />

      <Card style={{ marginBottom: 24 }}>
        <Select
          placeholder="Guruhni tanlang"
          style={{ width: 250 }}
          value={groupId}
          onChange={setGroupId}
          options={groupsData?.data?.map((g) => ({
            value: g._id,
            label: g.name,
          }))}
        />
      </Card>

      {groupId && (
        <>
          <Card title="O'quvchilar" style={{ marginBottom: 24 }}>
            <Table
              columns={studentColumns}
              dataSource={groupData?.data?.students || []}
              rowKey="_id"
              pagination={false}
            />
          </Card>

          <Card title="Baho tarixi">
            <Table
              columns={gradeColumns}
              dataSource={gradesData?.data || []}
              rowKey="_id"
            />
          </Card>
        </>
      )}

      <Modal
        title={`Baho qo'shish - ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        onOk={handleSubmit}
        confirmLoading={isLoading}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="student" hidden><Input /></Form.Item>
          <Form.Item name="group" hidden><Input /></Form.Item>
          <Form.Item name="type" label="Turi" rules={[{ required: true }]}>
            <Select
              options={['test', 'homework', 'oral', 'midterm', 'final'].map((t) => ({
                value: t,
                label: statusLabels[t],
              }))}
            />
          </Form.Item>
          <Form.Item name="score" label="Ball" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="maxScore" label="Maks. ball" initialValue={100}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="date" label="Sana">
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item name="comment" label="Izoh">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GradesPage;
