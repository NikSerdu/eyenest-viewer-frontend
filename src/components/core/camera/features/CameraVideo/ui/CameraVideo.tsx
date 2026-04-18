import type { FC } from 'react'
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react'
import {
	CameraAudioControls,
	ConnectionErrorBanner,
	VideoStatus,
} from '@/components/core/camera/entities'
import { ViewerIntercomControl } from '@/components/core/camera/features'

import { useAudioControls } from '../model/hooks/useAudioControls'
import { useCameraViewer } from '../model/hooks/useCameraViewer'
import { ViewerVideo } from './ViewerVideo'

interface IProps {
	roomID: string
}

export const CameraVideo: FC<IProps> = ({ roomID }) => {
	const { isMuted, volume, toggleMute } = useAudioControls()
	const {
		token,
		isLoading,
		isError,
		connectionError,
		handleRoomError,
		handleDisconnected,
	} = useCameraViewer(roomID)

	if (!roomID) return null

	if (isLoading && !token)
		return <VideoStatus type='loading' message='Загрузка видео…' />

	if (isError || !token)
		return <VideoStatus type='error' message='Ошибка загрузки видео' />

	return (
		<div className='relative w-full rounded-lg overflow-hidden bg-slate-900'>
			<LiveKitRoom
				key={roomID}
				serverUrl={import.meta.env.VITE_LIVEKIT_URL}
				token={token}
				connect
				onError={handleRoomError}
				onDisconnected={handleDisconnected}
				style={{ display: 'contents' }}
			>
				<RoomAudioRenderer muted={isMuted || volume === 0} volume={volume} />

				<div className='relative w-full' style={{ minHeight: '220px' }}>
					<ViewerVideo />

					<ViewerIntercomControl />

					<CameraAudioControls
						isMuted={isMuted}
						onToggleMute={toggleMute}
					/>

					{connectionError && <ConnectionErrorBanner message={connectionError} />}
				</div>
			</LiveKitRoom>
		</div>
	)
}
