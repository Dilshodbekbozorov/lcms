import { Card, Form, Input, Button, Table, Modal, Select, message, Tabs } from 'antd';
import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import {
  useChangePasswordMutation,
  useGetUsersQuery,
  useCreateUserMutation,
} from '../../features/api/apiSlice';
import { useAuth } from '../../hooks/useAuth';

const roleLabels = {
  admin: 'Administrator',
  teacher: 'O\'qituvchi',
  student: 'O\'quvchi',
};

const SettingsPage = () => {
  const { isAdmin } = useAuth();
  const [pwdForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [changePassword, { isLoading: changingPwd }] = useChangePasswordMutation();
  const { data: users, refetch } = useGetUsersQuery(undefined, { skip: !isAdmin });
  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();

  const handleChangePassword = async (values) => {
    try {
      await changePassword(values).unwrap();
      message.success('Parol muvaffaqiyatli o\'zgartirildi');
      pwdForm.resetFields();
    } catch (err) {
      message.error(err.data?.message || 'Xatolik');
    }
  };

  const handleCreateUser = async () => {
    try {
      const values = await userForm.validateFields();
      await createUser(values).unwrap();
      message.success('Foydalanuvchi yaratildi');
      userForm.resetFields();
      setUserModalOpen(false);
      refetch();
    } catch (err) {
      message.error(err.data?.message || 'Xatolik');
    }
  };

  const userColumns = [
    { title: 'Ism', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Rol', dataIndex: 'role', render: (r) => roleLabels[r] },
    {
      title: 'Holat',
      dataIndex: 'isActive',
      render: (v) => (v ? 'Faol' : 'Nofaol'),
    },
  ];

  const tabItems = [
    ...(isAdmin
      ? [
          {
            key: 'center',
            label: 'Markaz ma\'lumotlari',
            children: (
              <Card>
                <Form
                  layout="vertical"
                  initialValues={{
                    name: 'Til O\'quv Markazi',
                    address: 'Toshkent sh., Amir Temur ko\'chasi 15',
                    phone: '+998 71 123 45 67',
                  }}
                >
                  <Form.Item name="name" label="Markaz nomi">
                    <Input />
                  </Form.Item>
                  <Form.Item name="address" label="Manzil">
                    <Input />
                  </Form.Item>
                  <Form.Item name="phone" label="Telefon">
                    <Input />
                  </Form.Item>
                  <Button type="primary">Saqlash</Button>
                </Form>
              </Card>
            ),
          },
        ]
      : []),
    {
      key: 'password',
      label: 'Parolni o\'zgartirish',
      children: (
        <Card style={{ maxWidth: 400 }}>
          <Form form={pwdForm} layout="vertical" onFinish={handleChangePassword}>
            <Form.Item
              name="currentPassword"
              label="Joriy parol"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Yangi parol"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={changingPwd}>
              Parolni o'zgartirish
            </Button>
          </Form>
        </Card>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: 'users',
            label: 'Foydalanuvchilar',
            children: (
              <Card
                extra={
                  <Button type="primary" onClick={() => setUserModalOpen(true)}>
                    Foydalanuvchi qo'shish
                  </Button>
                }
              >
                <Table
                  columns={userColumns}
                  dataSource={users?.data || []}
                  rowKey="_id"
                  pagination={false}
                />
              </Card>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <PageHeader title="Sozlamalar" />
      <Tabs items={tabItems} />

      <Modal
        title="Yangi foydalanuvchi"
        open={userModalOpen}
        onCancel={() => setUserModalOpen(false)}
        onOk={handleCreateUser}
        confirmLoading={creatingUser}
        okText="Yaratish"
        cancelText="Bekor qilish"
      >
        <Form form={userForm} layout="vertical">
          <Form.Item name="name" label="Ism" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Parol" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'admin', label: 'Administrator' },
                { value: 'teacher', label: 'O\'qituvchi' },
                { value: 'student', label: 'O\'quvchi' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingsPage;
