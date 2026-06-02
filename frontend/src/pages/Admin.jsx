import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Statistic, Row, Col, Table, Tag, Modal, Input, Select, Timeline, Spin, message } from 'antd';
import { DashboardOutlined, UserOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';
import { API_URL } from '../config';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 403) {
        // Kick unauthorized users back to the dashboard!
        message.error('Access Denied: You must be an admin to view this page.');
        window.location.href = '/dashboard';
      } else {
        message.error('Failed to fetch user data');
      }
    } catch (error) {
      message.error('Network error');
    }
    setLoading(false);
  };

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    setActiveMenu(e.key);
  };

  const showModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  // 1. Dashboard Stats
  const totalUsers = users.length;
  const paidUsers = users.filter(u => u.paymentDone).length;
  const completedUsers = users.filter(u => u.onboardingCompleted).length;
  const conversionRate = totalUsers === 0 ? 0 : Math.round((completedUsers / totalUsers) * 100);

  // 2. Users Table Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.college && user.college.toLowerCase().includes(searchText.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'paid') matchesStatus = user.paymentDone;
    if (statusFilter === 'onboarded') matchesStatus = user.onboardingCompleted;
    if (statusFilter === 'incomplete') matchesStatus = !user.onboardingCompleted;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Payment', key: 'payment', render: (_, r) => r.paymentDone ? <Tag color="green">Paid</Tag> : <Tag color="red">Pending</Tag> },
    { title: 'Onboarded', key: 'onboarded', render: (_, r) => r.onboardingCompleted ? <Tag color="green">Done</Tag> : <Tag color="red">Pending</Tag> },
    { title: 'Created At', key: 'created', render: (_, r) => new Date(r.createdAt).toLocaleDateString() },
    { title: 'Action', key: 'action', render: (_, r) => <a onClick={() => showModal(r)}>View</a> }
  ];

  // 3. Activity Feed Logic
  const activities = [];
  users.forEach(u => {
    if (u.auditLogs) {
      u.auditLogs.forEach(log => {
        activities.push({
          userName: u.name,
          action: log.action,
          timestamp: new Date(log.timestamp)
        });
      });
    }
  });
  
  activities.sort((a, b) => b.timestamp - a.timestamp);

  const getActionText = (action) => {
    if (action === 'REGISTERED') return 'Registered';
    if (action === 'PAYMENT_COMPLETED') return 'Completed Payment';
    if (action === 'ONBOARDING_COMPLETED') return 'Completed Onboarding';
    return action;
  };

  const getActionColor = (action) => {
    if (action === 'REGISTERED') return 'blue';
    if (action === 'PAYMENT_COMPLETED') return 'gold';
    if (action === 'ONBOARDING_COMPLETED') return 'green';
    return 'gray';
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '20px', fontSize: '18px', fontWeight: 'bold', color: '#1890ff', textAlign: 'center' }}>
          Admin Panel
        </div>
        <Menu mode="inline" selectedKeys={[activeMenu]} onClick={handleMenuClick}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Overview</Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>Users Table</Menu.Item>
          <Menu.Item key="activity" icon={<HistoryOutlined />}>Activity Feed</Menu.Item>
          <div style={{ marginTop: '20px', borderTop: '1px solid #f0f0f0' }}></div>
          <Menu.Item key="logout" icon={<LogoutOutlined />} danger>Logout Admin</Menu.Item>
        </Menu>
      </Sider>
      
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ margin: 0, lineHeight: '64px' }}>CRM Dashboard</h2>
        </Header>
        
        <Content style={{ margin: '24px', background: '#fff', padding: '24px', borderRadius: '8px', minHeight: 280 }}>
          
          {activeMenu === 'dashboard' && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Dashboard Overview</h3>
              <Row gutter={16}>
                <Col span={6}>
                  <Card>
                    <Statistic title="Total Users" value={totalUsers} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic title="Paid Users" value={paidUsers} valueStyle={{ color: '#fa8c16' }} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic title="Completed Users" value={completedUsers} valueStyle={{ color: '#52c41a' }} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic title="Conversion Rate" value={`${conversionRate}%`} valueStyle={{ color: '#1890ff' }} />
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {activeMenu === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>User Management</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
                    <Select.Option value="all">All Users</Select.Option>
                    <Select.Option value="paid">Paid Users</Select.Option>
                    <Select.Option value="onboarded">Onboarded Users</Select.Option>
                    <Select.Option value="incomplete">Incomplete Users</Select.Option>
                  </Select>
                  <Search 
                    placeholder="Search name, email, college" 
                    onChange={e => setSearchText(e.target.value)} 
                    style={{ width: 250 }} 
                  />
                </div>
              </div>
              <Table 
                columns={columns} 
                dataSource={filteredUsers} 
                rowKey="_id" 
                pagination={{ pageSize: 10 }} 
              />
            </div>
          )}

          {activeMenu === 'activity' && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Recent Activity</h3>
              <Card style={{ maxWidth: '600px' }}>
                <Timeline>
                  {activities.map((act, idx) => (
                    <Timeline.Item key={idx} color={getActionColor(act.action)}>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{act.userName} {getActionText(act.action)}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                        {act.timestamp.toLocaleDateString()} at {act.timestamp.toLocaleTimeString()}
                      </p>
                    </Timeline.Item>
                  ))}
                  {activities.length === 0 && <p>No recent activity found.</p>}
                </Timeline>
              </Card>
            </div>
          )}
          
        </Content>
      </Layout>

      <Modal title="User Profile" open={isModalVisible} onCancel={handleCancel} footer={null}>
        {selectedUser && (
          <div>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>College:</strong> {selectedUser.college || 'N/A'}</p>
            <p><strong>Graduation Year:</strong> {selectedUser.graduationYear || 'N/A'}</p>
            <p><strong>Career Goal:</strong> {selectedUser.careerGoal || 'N/A'}</p>
            <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Admin;
