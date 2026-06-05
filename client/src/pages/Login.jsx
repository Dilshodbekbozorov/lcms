import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/api/apiSlice';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result.data));
      message.success('Muvaffaqiyatli kirdingiz!');
      navigate('/dashboard');
    } catch (err) {
      message.error(err.data?.message || 'Kirish xatosi');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
      }}
    >
      <Card style={{ width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: '#1677ff',
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 16,
            }}
          >
            LCMS
          </div>
          <Title level={3} style={{ margin: 0 }}>
            Til O'quv Markazi
          </Title>
          <Text type="secondary">Boshqaruv tizimiga kirish</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email kiriting' },
              { type: 'email', message: 'To\'g\'ri email kiriting' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Parol kiriting' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Parol" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Kirish
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ fontSize: 12 }}>
          Demo: admin@lcms.uz / Admin1234!
        </Text>
      </Card>
    </div>
  );
};

export default Login;
