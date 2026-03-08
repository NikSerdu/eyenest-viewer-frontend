import type { FC } from 'react'
import { CameraVideo } from '../features/CameraVideo/ui/CameraVideo'
import { Navigate, useParams } from 'react-router-dom'

export const CameraDetails: FC = () => {
	const { cameraID } = useParams<{ cameraID: string }>()
	if (!cameraID) {
		return <Navigate to={'/'} />
	}
	return (
		<>
			<CameraVideo roomID={cameraID} />
		</>
	)
}
