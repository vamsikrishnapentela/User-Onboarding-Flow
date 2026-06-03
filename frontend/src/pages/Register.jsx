import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import './pages.css';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        message.success('Account created! Welcome aboard.');
        navigate('/payment');
      } else {
        message.error(data.message || 'Registration failed.');
      }
    } catch (error) {
      message.error('Network error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="placeholder-container">
      <Card className="placeholder-card" style={{ textAlign: 'left' }}>
        <Title level={3} style={{ marginTop: 0, textAlign: 'center' }}>Sign Up</Title>
        <p style={{ marginBottom: '24px', color: '#666', textAlign: 'center' }}>Create an account to get started.</p>
        
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="name" 
            label="Name" 
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input size="large" placeholder="Your full name" />
          </Form.Item>
          
          <Form.Item 
            name="email" 
            label="Email" 
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            label="Password" 
            rules={[{ required: true, message: 'Please enter a password' }]}
          >
            <Input.Password size="large" placeholder="Create a strong password" />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: '10px' }}>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Create Account
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          Already have an account? <Link to="/login">Log in here</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
