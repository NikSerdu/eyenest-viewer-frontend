import { createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../providers/AuthProvider'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AuthPage } from '@/components/core/auth'
import { ROUTES } from '../constants/routes'
import { PublicRoute } from './routes/PublicRoute'
import { CameraPage } from '@/components/core/camera'
import { CameraDetails } from '@/components/core/camera/pages/CameraDetails'
import { CameraEventsPage } from '@/components/core/camera/pages/CameraEventsPage'
import { CameraHlsPage } from '@/components/core/camera/pages/CameraHlsPage'
import { CameraRecordingsPage } from '@/components/core/camera/pages/CameraRecordingsPage'
import { LocationsPage } from '@/components/core/locations/pages/LocationsPage'

export const router = createBrowserRouter([
	{
		element: <AuthProvider />,
		children: [
			{
				element: <ProtectedRoute />,
				children: [
					{
						path: ROUTES.CAMERAS.ROOT,
						children: [
							{
								index: true,
								element: <CameraPage />,
							},
							{
								path: ROUTES.CAMERAS.CAMERA_DETAILS,
								element: <CameraDetails />,
							},
							{
								path: ROUTES.CAMERAS.CAMERA_EVENTS,
								element: <CameraEventsPage />,
							},
							{
								path: ROUTES.CAMERAS.CAMERA_RECORDINGS,
								element: <CameraRecordingsPage />,
							},
							{
								path: ROUTES.CAMERAS.CAMERA_HLS,
								element: <CameraHlsPage />,
							},
						],
					},

					{
						path: ROUTES.LOCATIONS,
						element: <LocationsPage />,
					},
					{
						path: ROUTES.ACTIVITY,
						element: <>Активность</>,
					},
					{
						path: ROUTES.RECORDINGS,
						element: <>Записи</>,
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
