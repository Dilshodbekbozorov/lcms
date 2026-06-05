import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useGetGroupsQuery,
} from '../../features/api/apiSlice';

const StudentForm = ({ open, onClose, student, onSuccess }) => {
  const [form] = Form.useForm();
  const { data: groupsData } = useGetGroupsQuery();
  const [createStudent, { isLoading: creating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: updating }] = useUpdateStudentMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        birthDate: values.birthDate?.toISOString(),
      };

      if (student) {
        await updateStudent({ id: student._id, ...data }).unwrap();
        message.success('O\'quvchi yangilandi');
      } else {
        await createStudent(data).unwrap();
        message.success('O\'quvchi qo\'shildi');
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
      title={student ? 'O\'quvchini tahrirlash' : 'Yangi o\'quvchi'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={creating || updating}
      okText="Saqlash"
      cancelText="Bekor qilish"
      afterOpenChange={(visible) => {
        if (visible && student) {
          form.setFieldsValue({
            ...student,
            group: student.group?._id || student.group,
            birthDate: student.birthDate ? dayjs(student.birthDate) : null,
          });
        } else if (!visible) {
          form.resetFields();
        }
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
        <Form.Item name="email" label="Email">
          <Input type="email" />
        </Form.Item>
        <Form.Item name="birthDate" label="Tug'ilgan sana">
          <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
        </Form.Item>
        <Form.Item name="gender" label="Jinsi">
          <Select
            options={[
              { value: 'male', label: 'Erkak' },
              { value: 'female', label: 'Ayol' },
            ]}
          />
        </Form.Item>
        <Form.Item name="level" label="Daraja" rules={[{ required: true }]}>
          <Select
            options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => ({
              value: l,
              label: l,
            }))}
          />
        </Form.Item>
        <Form.Item name="group" label="Guruh">
          <Select
            allowClear
            options={groupsData?.data?.map((g) => ({
              value: g._id,
              label: g.name,
            }))}
          />
        </Form.Item>
        <Form.Item name="notes" label="Izoh">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentForm;
