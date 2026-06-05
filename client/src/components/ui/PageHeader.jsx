import { Typography, Space } from 'antd';

const { Title } = Typography;

const PageHeader = ({ title, subtitle, extra }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      background: '#fff',
      padding: '16px 24px',
      borderRadius: 8,
    }}
  >
    <div>
      <Title level={3} style={{ margin: 0 }}>
        {title}
      </Title>
      {subtitle && (
        <Typography.Text type="secondary">{subtitle}</Typography.Text>
      )}
    </div>
    {extra && <Space>{extra}</Space>}
  </div>
);

export default PageHeader;
