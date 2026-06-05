import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import {
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useGetStudentsQuery,
  useGetGroupsQuery,
} from '../../features/api/apiSlice';

const PaymentForm = ({ open, onClose, payment, defaultMonth, onSuccess }) => {
  const [form] = Form.useForm();
  const { data: studentsData } = useGetStudentsQuery();
  const { data: groupsData } = useGetGroupsQuery();
  const [createPayment, { isLoading: creating }] = useCreatePaymentMutation();
  const [updatePayment, { isLoading: updating }] = useUpdatePaymentMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        month: values.month?.format('YYYY-MM') || defaultMonth,
        paidAt: values.paidAt?.toISOString(),
      };

      if (payment?._id) {
        await updatePayment({ id: payment._id, ...data }).unwrap();
        message.success('To\'lov yangilandi');
      } else {
        await createPayment(data).unwrap();
        message.success('To\'lov qayd etildi');
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
      title="To'lov qayd etish"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={creating || updating}
      okText="Saqlash"
      cancelText="Bekor qilish"
      afterOpenChange={(visible) => {
        if (visible) {
          if (payment) {
            form.setFieldsValue({
              ...payment,
              student: payment.student?._id || payment.student,
              group: payment.group?._id || payment.group,
              month: dayjs(payment.month),
              paidAt: payment.paidAt ? dayjs(payment.paidAt) : dayjs(),
            });
          } else {
            form.setFieldsValue({ month: dayjs(defaultMonth), paidAt: dayjs() });
          }
        } else {
          form.resetFields();
        }
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="student" label="O'quvchi" rules={[{ required: true }]}>
          <Select
            showSearch
            optionFilterProp="label"
            options={studentsData?.data?.map((s) => ({
              value: s._id,
              label: `${s.firstName} ${s.lastName}`,
            }))}
          />
        </Form.Item>
        <Form.Item name="group" label="Guruh" rules={[{ required: true }]}>
          <Select
            options={groupsData?.data?.map((g) => ({
              value: g._id,
              label: g.name,
            }))}
          />
        </Form.Item>
        <Form.Item name="amount" label="Summa (UZS)" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="month" label="Oy" rules={[{ required: true }]}>
          <DatePicker picker="month" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="paymentMethod" label="To'lov usuli">
          <Select
            options={[
              { value: 'cash', label: 'Naqd' },
              { value: 'card', label: 'Karta' },
              { value: 'transfer', label: 'O\'tkazma' },
            ]}
          />
        </Form.Item>
        <Form.Item name="status" label="Holat" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'paid', label: 'To\'langan' },
              { value: 'partial', label: 'Qisman' },
              { value: 'unpaid', label: 'To\'lanmagan' },
            ]}
          />
        </Form.Item>
        <Form.Item name="paidAt" label="To'langan sana">
          <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
        </Form.Item>
        <Form.Item name="note" label="Izoh">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentForm;
