import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectRoute = ({ children }) => {
  const role = localStorage.getItem('role');

  if (role === 'admin') {
    return <Navigate to="/admin-dashboard" />;
  } else if (role === 'user') {
    return <Navigate to="/user-dashboard" />;
  }

  return children;
};

export default RedirectRoute;
