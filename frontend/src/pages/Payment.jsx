import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, message, Spin, Steps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './pages.css';

const { Title, Paragraph } = Typography;

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_URL}/api/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.paymentDone) {
            if (data.onboardingCompleted) {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/onboarding', { replace: true });
            }
          } else {
            setPageLoading(false);
          }
        } else {
           setPageLoading(false);
        }
      } catch (error) {
         setPageLoading(false);
      }
    };
    
    checkPaymentStatus();
  }, [navigate]);

  const handleFakePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/pay`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (response.ok) {
        message.success('Payment successful! Proceeding to Onboarding...');
        navigate('/onboarding');
      } else {
        const data = await response.json();
        message.error(data.message || 'Payment failed.');
      }
    } catch (error) {
      message.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  if (pageLoading) {
    return <div className="placeholder-container"><Spin size="large" /></div>;
  }

  return (
    <div className="placeholder-container">
      <Card className="placeholder-card" style={{ width: '600px', padding: '20px' }}>
        <Steps 
          current={1} 
          style={{ marginBottom: '32px' }}
          items={[
            { title: 'Sign Up' },
            { title: 'Payment' },
            { title: 'Onboarding' }
          ]} 
        />
        
        <Title level={3} style={{ marginTop: 0 }}>Complete Your Payment</Title>
        
        <Paragraph type="secondary" style={{ marginBottom: '24px', fontSize: '16px' }}>
          To unlock your account and continue your onboarding, please complete this one-time secure payment.
          <br /><br />
          <em>(This is a simulation—no real money is involved!)</em>
        </Paragraph>
        
        <Button 
          type="primary" 
          size="large" 
          onClick={handleFakePayment} 
          loading={loading} 
          block
          style={{ height: '50px', fontSize: '18px', background: '#52c41a', borderColor: '#52c41a' }}
        >
          Pay ₹4,999
        </Button>
      </Card>
    </div>
  );
};

export default Payment;
