import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-stone">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
