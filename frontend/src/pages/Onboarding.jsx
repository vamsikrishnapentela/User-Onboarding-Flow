import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import './pages.css';

const Onboarding = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Smart Page Rule: User cannot access onboarding unless payment is done.
    const checkAccess = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (!data.paymentDone) {
            // Block access, send back to payment
            navigate('/payment', { replace: true }); 
          } else if (data.onboardingCompleted) {
            // Already did onboarding, skip this page
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

  if (pageLoading) {
    return <div className="placeholder-container"><Spin size="large" /></div>;
  }

  return (
    <div className="placeholder-container">
      <div className="placeholder-card">
        <h2>Onboarding Page</h2>
        <p>This is a placeholder for the form where users will answer questions about their college and career goals.</p>
      </div>
    </div>
  );
};

export default Onboarding;
