import { Layout, Menu } from 'antd';
import { DashboardOutlined, UnorderedListOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';


const { Sider } = Layout;

const AppSider: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'debts',
      icon: <UnorderedListOutlined />,
      label: 'Debts',
      onClick: () => navigate('/debts'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Sider width={200} className="site-layout-background">
      <div style={{ padding: 16, color: 'white', fontSize: 16 }}>
        <h4 style={{margin:0, textAlign:"center"}} >LOGO</h4>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default AppSider;