import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Form, Input, InputNumber, message, Spin, Steps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './pages.css';

const { Title, Paragraph } = Typography;

const Onboarding = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_URL}/api/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (!data.paymentDone) {
            navigate('/payment', { replace: true }); 
          } else if (data.onboardingCompleted) {
            navigate('/dashboard', { replace: true }); 
          } else {
             setPageLoading(false);
          }
        }
      } catch (error) {
        setPageLoading(false);
      }
    };
    checkAccess();
  }, [navigate]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/onboarding`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        message.success('Onboarding complete!');
        navigate('/dashboard');
      } else {
        const data = await response.json();
        message.error(data.message || 'Failed to save your details.');
      }
    } catch (error) {
      message.error('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  if (pageLoading) {
    return <div className="placeholder-container"><Spin size="large" /></div>;
  }

  return (
    <div className="placeholder-container">
      <Card className="placeholder-card" style={{ width: '600px', padding: '20px', textAlign: 'left' }}>
        <Steps 
          current={2} 
          style={{ marginBottom: '32px' }}
          items={[
            { title: 'Sign Up' },
            { title: 'Payment' },
            { title: 'Onboarding' }
          ]} 
        />
        
        <Title level={3} style={{ marginTop: 0, textAlign: 'center' }}>Welcome Aboard!</Title>
        <Paragraph style={{ textAlign: 'center', marginBottom: '24px', color: '#666' }}>
          Please complete your profile so we can personalize your experience.
        </Paragraph>
        
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="college" 
            label="College Name" 
            rules={[{ required: true, message: 'Please enter your college name' }]}
          >
            <Input size="large" placeholder="e.g., Stanford University" />
          </Form.Item>
          
          <Form.Item 
            name="graduationYear" 
            label="Graduation Year" 
            rules={[{ required: true, message: 'Please enter your graduation year' }]}
          >
            <InputNumber size="large" style={{ width: '100%' }} placeholder="e.g., 2024" />
          </Form.Item>
          
          <Form.Item 
            name="careerGoal" 
            label="Career Goal" 
            rules={[{ required: true, message: 'Please tell us your career goal' }]}
          >
            <Input.TextArea size="large" rows={3} placeholder="e.g., I want to become a Full Stack Developer..." />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: '10px' }}>
            <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
              Complete Onboarding
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Onboarding;
