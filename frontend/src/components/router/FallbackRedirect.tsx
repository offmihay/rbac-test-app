import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

export default function FallbackRedirect() {
  const token = useAuthStore((state) => state.token);
  localStorage.removeItem('path');

  return <Navigate to={token ? '/dashboard' : '/signin'} replace />;
}
