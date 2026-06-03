import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Spin, Steps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './pages.css';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch latest user state to ensure they haven't skipped any required onboarding steps
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_URL}/api/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const userData = await response.json();
          
          if (!userData.paymentDone) {
            navigate('/payment', { replace: true });
          } else if (!userData.onboardingCompleted) {
            navigate('/onboarding', { replace: true });
          } else {
            // User has completed everything, safe to show the dashboard
            setUser(userData);
            setPageLoading(false);
          }
        } else {
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        navigate('/login', { replace: true });
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  if (pageLoading || !user) {
    return <div className="placeholder-container"><Spin size="large" /></div>;
  }

  return (
    <div className="placeholder-container">
      <Card className="placeholder-card" style={{ width: '600px', textAlign: 'left', padding: '20px' }}>
        <Steps 
          current={3} 
          style={{ marginBottom: '32px' }}
          items={[
            { title: 'Sign Up' },
            { title: 'Payment' },
            { title: 'Onboarding' }
          ]} 
        />
        
        <Title level={2} style={{ color: '#1890ff', marginTop: 0, textAlign: 'center' }}>Welcome, {user.name}!</Title>
        
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #eee' }}>
          <Title level={5} style={{ marginTop: 0, marginBottom: '16px' }}>Your Profile</Title>
          <Paragraph style={{ fontSize: '16px' }}><strong>Email:</strong> {user.email}</Paragraph>
          <Paragraph style={{ fontSize: '16px' }}><strong>College:</strong> {user.college}</Paragraph>
          <Paragraph style={{ fontSize: '16px' }}><strong>Graduation Year:</strong> {user.graduationYear}</Paragraph>
          <Paragraph style={{ fontSize: '16px' }}><strong>Career Goal:</strong> {user.careerGoal}</Paragraph>
        </div>

        <div style={{ background: '#fffbe6', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #ffe58f' }}>
          <Title level={5} style={{ marginTop: 0, marginBottom: '16px', color: '#d48806' }}>Security Audit Logs</Title>
          {user.auditLogs && user.auditLogs.length > 0 ? (
            user.auditLogs.map((log, index) => (
              <div key={index} style={{ marginBottom: '8px', fontFamily: 'monospace', fontSize: '13px' }}>
                <span style={{ color: '#d48806' }}>[{new Date(log.timestamp).toLocaleString()}]</span> <strong>{log.action}</strong>
              </div>
            ))
          ) : (
            <Paragraph type="secondary">No logs available.</Paragraph>
          )}
        </div>
        
        <Button danger type="primary" size="large" block onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Dashboard;
