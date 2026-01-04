import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return user?.isLoggedIn ? children : <Navigate to="/register" />;
};

export default PrivateRoute;