import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  console.log('AdminRoute - Loading:', loading);
  console.log('AdminRoute - isAuthenticated:', isAuthenticated);
  console.log('AdminRoute - User:', user);
  
  if (loading) {
    return <div className="p-8">Loading admin panel...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
