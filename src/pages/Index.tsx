
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect from the index page to the landing page
const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
