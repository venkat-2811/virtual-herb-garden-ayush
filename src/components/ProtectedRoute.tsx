import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If role is required but user doesn't have it, redirect to dashboard
  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
