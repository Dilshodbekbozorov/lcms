import { Card, Statistic } from 'antd';

const StatCard = ({ title, value, prefix, suffix, color, loading }) => (
  <Card loading={loading} style={{ borderTop: `3px solid ${color || '#1677ff'}` }}>
    <Statistic title={title} value={value} prefix={prefix} suffix={suffix} />
  </Card>
);

export default StatCard;
