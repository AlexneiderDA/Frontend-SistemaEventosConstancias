// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loader mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1C8443]"></div>
      </div>
    );
  }

  // Si requiere autenticación y no está autenticado, redirigir
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si no requiere autenticación pero está autenticado, redirigir al dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/user/inicio" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;