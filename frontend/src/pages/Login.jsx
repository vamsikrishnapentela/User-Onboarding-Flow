import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import './pages.css';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Securely store the JWT provided by our backend
        localStorage.setItem('token', data.token);
        
        message.success('Welcome back!');
        
        // Smart Routing: Check if this user is an admin
        if (data.isAdmin) {
          navigate('/admin');
        } else {
          // Redirect to the dashboard (our route guards will handle redirecting if payment/onboarding is missing)
          navigate('/dashboard'); 
        }
      } else {
        message.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      message.error('Network error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="placeholder-container">
      <Card className="placeholder-card" style={{ textAlign: 'left' }}>
        <Title level={3} style={{ marginTop: 0, textAlign: 'center' }}>Welcome Back</Title>
        <p style={{ marginBottom: '24px', color: '#666', textAlign: 'center' }}>Please log in to your account.</p>
        
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="email" 
            label="Email" 
            rules={[{ required: true, type: 'email', message: 'Please enter your registered email' }]}
          >
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            label="Password" 
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password size="large" placeholder="Your password" />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: '10px' }}>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Log In
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          Don't have an account? <Link to="/register">Sign up here</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
