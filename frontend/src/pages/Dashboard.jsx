import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import './pages.css';

const Dashboard = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Smart Page Rule: Dashboard checks if the user has completed all previous steps
    const checkAccess = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/me', {
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
            // Everything is done, allow them to view the dashboard
            setPageLoading(false);
          }
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        navigate('/login', { replace: true });
      }
    };
    checkAccess();
  }, [navigate]);

  if (pageLoading) {
    return <div className="placeholder-container"><Spin size="large" /></div>;
  }

  return (
    <div className="placeholder-container">
      <div className="placeholder-card">
        <h2>Welcome Dashboard</h2>
        <p>This is a placeholder where the final user data will be proudly displayed.</p>
      </div>
    </div>
  );
};

export default Dashboard;
