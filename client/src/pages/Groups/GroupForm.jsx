import { Modal, Form, Input, InputNumber, Select, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useGetTeachersQuery,
} from '../../features/api/apiSlice';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dayLabels = {
  Monday: 'Dushanba',
  Tuesday: 'Seshanba',
  Wednesday: 'Chorshanba',
  Thursday: 'Payshanba',
  Friday: 'Juma',
  Saturday: 'Shanba',
  Sunday: 'Yakshanba',
};

const GroupForm = ({ open, onClose, group, onSuccess }) => {
  const [form] = Form.useForm();
  const { data: teachersData } = useGetTeachersQuery();
  const [createGroup, { isLoading: creating }] = useCreateGroupMutation();
  const [updateGroup, { isLoading: updating }] = useUpdateGroupMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      };

      if (group) {
        await updateGroup({ id: group._id, ...data }).unwrap();
        message.success('Guruh yangilandi');
      } else {
        await createGroup(data).unwrap();
        message.success('Guruh qo\'shildi');
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
      title={group ? 'Guruhni tahrirlash' : 'Yangi guruh'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={creating || updating}
      okText="Saqlash"
      cancelText="Bekor qilish"
      width={600}
      afterOpenChange={(visible) => {
        if (visible && group) {
          form.setFieldsValue({
            ...group,
            teacher: group.teacher?._id || group.teacher,
            startDate: group.startDate ? dayjs(group.startDate) : null,
            endDate: group.endDate ? dayjs(group.endDate) : null,
          });
        } else if (!visible) form.resetFields();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Guruh nomi" rules={[{ required: true }]}>
          <Input placeholder="ENG-B1-01" />
        </Form.Item>
        <Form.Item name="language" label="Til" rules={[{ required: true }]}>
          <Select
            options={['English', 'Russian', 'Chinese', 'French', 'German'].map((l) => ({
              value: l,
              label: l,
            }))}
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
        <Form.Item name="teacher" label="O'qituvchi">
          <Select
            allowClear
            options={teachersData?.data?.map((t) => ({
              value: t._id,
              label: `${t.firstName} ${t.lastName}`,
            }))}
          />
        </Form.Item>
        <Form.Item name="monthlyFee" label="Oylik to'lov (UZS)" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="maxStudents" label="Maks. o'quvchilar" initialValue={12}>
          <InputNumber style={{ width: '100%' }} min={1} max={30} />
        </Form.Item>
        <Form.Item name="startDate" label="Boshlanish sanasi">
          <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
        </Form.Item>
        <Form.List name="schedule" initialValue={[{ day: 'Monday', startTime: '09:00', endTime: '11:00', room: '' }]}>
          {(fields, { add, remove }) => (
            <>
              <label>Dars jadvali</label>
              {fields.map(({ key, name, ...rest }) => (
                <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Form.Item {...rest} name={[name, 'day']} style={{ flex: 1, marginBottom: 0 }}>
                    <Select
                      options={days.map((d) => ({ value: d, label: dayLabels[d] }))}
                    />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'startTime']} style={{ width: 90, marginBottom: 0 }}>
                    <Input placeholder="09:00" />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'endTime']} style={{ width: 90, marginBottom: 0 }}>
                    <Input placeholder="11:00" />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'room']} style={{ width: 80, marginBottom: 0 }}>
                    <Input placeholder="Xona" />
                  </Form.Item>
                  <Button type="link" danger onClick={() => remove(name)}>×</Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                + Dars qo'shish
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default GroupForm;
