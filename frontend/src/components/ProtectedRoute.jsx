import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // 1. Not logged in -> Kick to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // 2. Logged in, but wrong role -> Redirect to their correct dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'vendor') return <Navigate to="/vendor" replace />;
    return <Navigate to="/user" replace />;
  }

  // 3. Authorized -> Render the component
  return children;
};

export default ProtectedRoute;