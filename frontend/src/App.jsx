import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Typography, Button, Space, Card } from 'antd';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

// A simple Homepage component
const Home = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <Card style={{ maxWidth: 600, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Title level={2}>Welcome to the MERN App</Title>
      <Paragraph>
        This is a basic homepage route. The frontend is built with React, Vite, React Router, and Ant Design.
      </Paragraph>
      <Space>
        <Link to="/about">
          <Button type="primary">Go to About Page</Button>
        </Link>
      </Space>
    </Card>
  </div>
);

// A simple About component to demonstrate routing
const About = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <Title level={2}>About Us</Title>
    <Paragraph>
      This route demonstrates React Router working smoothly!
    </Paragraph>
    <Link to="/">
      <Button>Back to Home</Button>
    </Link>
  </div>
);

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            My MERN App
          </Title>
        </Header>
        
        <Content style={{ padding: '50px' }}>
          <div style={{ background: '#fff', minHeight: 280, padding: 24, borderRadius: 8 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </Content>
        
        <Footer style={{ textAlign: 'center' }}>
          MERN Project Structure ©{new Date().getFullYear()} Created for You
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
