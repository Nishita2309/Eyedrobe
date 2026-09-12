import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/authentication/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f7]">
        <div className="text-center">
          <div className="text-4xl">👗</div>
          <p className="mt-3 text-sm text-[#777]">
            Loading EyeDrope...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}