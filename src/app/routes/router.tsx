import { createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../providers/AuthProvider'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AuthPage } from '@/components/core/auth'
import { ROUTES } from '../constants/routes'
import { PublicRoute } from './routes/PublicRoute'

export const router = createBrowserRouter([
	{
		element: <AuthProvider />,
		children: [
			{
				element: <ProtectedRoute />,
				children: [
					{
						path: '/',
						element: <>Home page</>,
					},
				],
			},
			{
				element: <PublicRoute />,
				children: [
					{
						path: ROUTES.AUTH,
						element: <AuthPage />,
					},
				],
			},
		],
	},
])
