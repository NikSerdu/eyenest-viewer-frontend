import type { FC } from 'react'
import { LiveKitRoom } from '@livekit/components-react'
import { VideoStatus } from '@/components/core/camera/entities'
import { useCameraViewer } from '../../../../CameraVideo/model/hooks/useCameraViewer'
import { CameraPreviewContent } from './CameraPreviewContent'

interface CameraVideoPreviewProps {
	roomID: string
	onStatusChange?: (online: boolean) => void
}

export const CameraVideoPreview: FC<CameraVideoPreviewProps> = ({
	roomID,
	onStatusChange,
}) => {
	const { token, isLoading, isError } = useCameraViewer(roomID)

	if (!roomID) return null

	if (isLoading && !token)
		return <VideoStatus type='loading' message='Загрузка превью…' />

	if (isError || !token)
		return <VideoStatus type='error' message='Ошибка загрузки превью' />

	return (
		<div className='w-full h-full'>
			<LiveKitRoom
				key={roomID}
				serverUrl={import.meta.env.VITE_LIVEKIT_URL}
				token={token}
				connect
				className='w-full h-full'
			>
				<CameraPreviewContent onStatusChange={onStatusChange} />
			</LiveKitRoom>
		</div>
	)
}
