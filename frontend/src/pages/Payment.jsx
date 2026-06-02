import React, { useState } from 'react';
import { Card, Typography, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './pages.css';

const { Title, Paragraph } = Typography;

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFakePayment = async () => {
    setLoading(true);
    try {
      // 1. Grab the JWT token from storage
      const token = localStorage.getItem('token');
      
      // 2. Call our secure payment API
      const response = await fetch('http://localhost:5000/api/pay', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Provide the token to prove we are logged in
        },
      });
      
      // 3. Handle the response
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

  return (
    <div className="placeholder-container">
      <Card className="placeholder-card" style={{ padding: '40px 20px' }}>
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
