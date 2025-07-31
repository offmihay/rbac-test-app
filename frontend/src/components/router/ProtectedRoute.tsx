import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
