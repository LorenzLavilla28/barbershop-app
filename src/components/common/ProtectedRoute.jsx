import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
