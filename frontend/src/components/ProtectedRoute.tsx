import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = userStr ? JSON.parse(userStr) : null;

  // If no token or user data, redirect to login
  if (!token || !user) {
    return <Navigate to="/patient/login" replace />;
  }

  // If user role doesn't match allowed roles
  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'patient':
        return <Navigate to="/dashboard" replace />;
      case 'doctor':
        return <Navigate to="/doctor-dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 