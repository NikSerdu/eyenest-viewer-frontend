import { Navigate, Outlet } from 'react-router-dom'
import { authStore } from '@auth/entities/model/store'
import { Spinner } from '@chakra-ui/react'
import { Layout } from '@/components/common/layout'

export const ProtectedRoute = () => {
	const { user, isLoading } = authStore()

	if (isLoading) {
		return <Spinner />
	}

	if (!user) {
		return <Navigate to='/auth' replace />
	}

	return (
		<Layout>
			<Outlet />
		</Layout>
	)
}
