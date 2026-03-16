import type { FC } from 'react'
import {
	LiveKitRoom,
	RoomAudioRenderer,
	ConnectionState,
} from '@livekit/components-react'
import {
	CameraAudioControls,
	ConnectionErrorBanner,
	VideoStatus,
} from '@/components/core/camera/entities'

import { useAudioControls } from '../model/hooks/useAudioControls'
import { useCameraViewer } from '../model/hooks/useCameraViewer'
import { ViewerVideo } from './ViewerVideo'

interface IProps {
	roomID: string
}

export const CameraVideo: FC<IProps> = ({ roomID }) => {
	const { isMuted, volume, toggleMute, handleVolumeChange } = useAudioControls()
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
		<div className='relative w-full h-full max-h-[calc(100vh-170px)] min-h-[240px] rounded-lg overflow-hidden bg-slate-900'>
			<LiveKitRoom
				key={roomID}
				serverUrl={import.meta.env.VITE_LIVEKIT_URL}
				token={token}
				connect
				onError={handleRoomError}
				onDisconnected={handleDisconnected}
			>
				<RoomAudioRenderer muted={isMuted || volume === 0} volume={volume} />

				<div className='pointer-events-none absolute top-2 left-2 z-10'>
					<ConnectionState className='pointer-events-auto inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-100 shadow-md' />
				</div>

				<ViewerVideo />

				<CameraAudioControls
					isMuted={isMuted}
					volume={volume}
					onToggleMute={toggleMute}
					onVolumeChange={handleVolumeChange}
				/>

				{connectionError && <ConnectionErrorBanner message={connectionError} />}
			</LiveKitRoom>
		</div>
	)
}
