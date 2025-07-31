import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

export default function FallbackRedirect() {
  const token = useAuthStore((state) => state.token);

  return <Navigate to={token ? '/' : '/signin'} replace />;
}
