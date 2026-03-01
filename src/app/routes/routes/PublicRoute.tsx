import { Navigate, Outlet } from 'react-router-dom'
import { authStore } from '@auth/entities/model/store'

export const PublicRoute = () => {
	const { user, isLoading } = authStore()

	if (isLoading) return null

	if (user) {
		return <Navigate to='/' replace />
	}

	return <Outlet />
}
