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
    // Smart Page Rule: Dashboard checks if the user has completed all previous steps
    const checkAccess = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_URL}/api/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (!data.paymentDone) {
            // Not paid yet? Force redirect to payment!
            navigate('/payment', { replace: true });
          } else if (!data.onboardingCompleted) {
            // Paid but didn't finish onboarding? Force redirect to onboarding!
            navigate('/onboarding', { replace: true });
          } else {
          
            setUser(data);
            setPageLoading(false);
          }
        } else {
          // Token is likely invalid or expired
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        navigate('/login', { replace: true });
      }
    };
    checkAccess();
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
            <Paragraph type="secondary">No logs available. (Older accounts might not have logs tracking enabled).</Paragraph>
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
