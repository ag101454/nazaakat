// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import LoadingScreen from '../../animations/loadingScreen';

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useAuthStore();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}