import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isTeacher, isStudent } = useAuth();

  const items = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Boshqaruv paneli', show: true },
    { key: '/students', icon: <TeamOutlined />, label: 'O\'quvchilar', show: isAdmin || isTeacher },
    { key: '/groups', icon: <UsergroupAddOutlined />, label: 'Guruhlar', show: true },
    { key: '/teachers', icon: <SolutionOutlined />, label: 'O\'qituvchilar', show: isAdmin },
    { key: '/payments', icon: <DollarOutlined />, label: 'To\'lovlar', show: isAdmin || isStudent },
    { key: '/attendance', icon: <CheckCircleOutlined />, label: 'Davomat', show: isAdmin || isTeacher },
    { key: '/grades', icon: <TrophyOutlined />, label: 'Baholar', show: true },
    { key: '/schedule', icon: <CalendarOutlined />, label: 'Jadval', show: true },
    { key: '/reports', icon: <BarChartOutlined />, label: 'Hisobotlar', show: isAdmin },
    { key: '/settings', icon: <SettingOutlined />, label: 'Sozlamalar', show: true },
  ].filter((item) => item.show);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={240}
      style={{ background: '#001529', minHeight: '100vh' }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {collapsed ? 'LC' : 'LCMS'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
