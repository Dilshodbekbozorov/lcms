import { Modal, Form, Input, InputNumber, Select, Switch, message } from 'antd';
import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from '../../features/api/apiSlice';

const TeacherForm = ({ open, onClose, teacher, onSuccess }) => {
  const [form] = Form.useForm();
  const [createTeacher, { isLoading: creating }] = useCreateTeacherMutation();
  const [updateTeacher, { isLoading: updating }] = useUpdateTeacherMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = { ...values, createUser: values.createUser || false };

      if (teacher) {
        await updateTeacher({ id: teacher._id, ...data }).unwrap();
        message.success('O\'qituvchi yangilandi');
      } else {
        await createTeacher(data).unwrap();
        message.success('O\'qituvchi qo\'shildi');
      }
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (err) {
      if (err.data?.message) message.error(err.data.message);
    }
  };

  return (
    <Modal
      title={teacher ? 'O\'qituvchini tahrirlash' : 'Yangi o\'qituvchi'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={creating || updating}
      okText="Saqlash"
      cancelText="Bekor qilish"
      afterOpenChange={(visible) => {
        if (visible && teacher) {
          form.setFieldsValue(teacher);
        } else if (!visible) form.resetFields();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="firstName" label="Ism" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Familiya" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Telefon" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="languages" label="Tillar">
          <Select
            mode="multiple"
            options={['English', 'Russian', 'Chinese', 'French', 'German'].map((l) => ({
              value: l,
              label: l,
            }))}
          />
        </Form.Item>
        <Form.Item name="levels" label="Darajalar">
          <Select
            mode="multiple"
            options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => ({
              value: l,
              label: l,
            }))}
          />
        </Form.Item>
        <Form.Item name="salary" label="Maosh (UZS)">
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        {!teacher && (
          <>
            <Form.Item name="createUser" label="Tizimga kirish hisobi yaratish" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev, cur) => prev.createUser !== cur.createUser}
            >
              {({ getFieldValue }) =>
                getFieldValue('createUser') ? (
                  <Form.Item name="password" label="Parol" rules={[{ required: true, min: 6 }]}>
                    <Input.Password />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default TeacherForm;
