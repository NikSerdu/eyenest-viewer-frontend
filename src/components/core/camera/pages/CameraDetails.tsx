import type { FC } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { CameraDetailsWidget } from '../widgets'

export const CameraDetails: FC = () => {
	const { cameraId } = useParams<{ cameraId: string }>()

	if (!cameraId) {
		return <Navigate to={'/'} />
	}

	return <CameraDetailsWidget cameraId={cameraId} />
}
