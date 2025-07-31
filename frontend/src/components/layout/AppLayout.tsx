import { Button, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Route, Routes, useNavigate } from 'react-router-dom';
import DashboardPage from '../../pages/DashboardPage';
import type { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { LogoutOutlined } from '@ant-design/icons';
import FallbackRedirect from '../router/FallbackRedirect';
import { useAuthStore } from '../../store/auth';
import ApprovalPage from '../../pages/ApprovalPage';
import UsersPage from '../../pages/UsersPage';

const AppLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
    localStorage.setItem('path', path);
  };

  const allTabs: ItemType<MenuItemType>[] = [
    { key: '/dashboard', label: 'Dashboard', onClick: () => navigateTo('/dashboard') },
    { key: '/approval', label: 'Awaiting for Approval', onClick: () => navigateTo('/approval') },
    { key: '/users', label: 'Users Management', onClick: () => navigateTo('/users') },
  ];

  const accessibleTabs = allTabs.filter((tab) => {
    if (user?.role === 'admin') {
      return ['/dashboard', '/approval', '/users'].includes(String(tab?.key));
    } else if (user?.role === 'publisher') {
      return ['/dashboard', '/approval'].includes(String(tab?.key));
    } else {
      return ['/dashboard'].includes(String(tab?.key));
    }
  });

  return (
    <>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white' }}>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={[localStorage.getItem('path') || '/dashboard']}
          items={accessibleTabs}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Button icon={<LogoutOutlined />} onClick={() => logout()}>
          Leave
        </Button>
      </Header>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/approval" element={<ApprovalPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="*" element={<FallbackRedirect />} />
      </Routes>
    </>
  );
};

export default AppLayout;
