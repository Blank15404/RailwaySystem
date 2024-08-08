import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectRoute = ({ children }) => {
  const role = localStorage.getItem('role');

  if (role === 'admin') {
    return <Navigate to="/adminhome" />;
  } else if (role === 'user') {
    return <Navigate to="/userhome" />;
  }

  return children;
};

export default RedirectRoute;
