import { useEffect, useRef, useState, type FC } from 'react'
import {
	LiveKitRoom,
	GridLayout,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks,
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import { useGetLiveKitViewerToken } from '@/api/hooks/camera/camera.hooks'

interface IProps {
	roomID: string
}

const LIVEKIT_URL = 'ws://localhost:7880'

const ViewerGrid: FC = () => {
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: false },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],
		{ onlySubscribed: true },
	)

	if (tracks.length === 0) {
		return (
			<div className='flex items-center justify-center w-full h-full min-h-[240px] bg-slate-900 rounded-lg text-slate-400 text-sm'>
				Ожидание трансляции с камеры…
			</div>
		)
	}

	return (
		<GridLayout
			tracks={tracks}
			className='w-full h-full min-h-[240px]'
			style={{ width: '100%', height: '100%' }}
		>
			<ParticipantTile />
		</GridLayout>
	)
}

export const CameraVideo: FC<IProps> = ({ roomID }) => {
	const [token, setToken] = useState<string | null>(null)
	const [connectionError, setConnectionError] = useState<string | null>(null)
	const {
		mutateAsync: getToken,
		isPending,
		isError,
	} = useGetLiveKitViewerToken()
	const getTokenRef = useRef(getToken)
	getTokenRef.current = getToken

	useEffect(() => {
		if (!roomID) return
		let cancelled = false
		setConnectionError(null)

		getTokenRef
			.current(roomID)
			.then(res => {
				if (!cancelled) setToken(res.token)
			})
			.catch(err => {
				console.error('Failed to get LiveKit token', err)
				if (!cancelled) setToken(null)
			})

		return () => {
			cancelled = true
			setToken(null)
		}
		// Только при смене комнаты; getToken не в deps, чтобы не переподключаться каждый рендер
	}, [roomID])

	if (!roomID) {
		return null
	}

	if (isPending && !token) {
		return (
			<div className='flex items-center justify-center w-full min-h-[240px] bg-slate-900/50 rounded-lg text-slate-400 text-sm'>
				Загрузка видео…
			</div>
		)
	}

	if (isError || !token) {
		return (
			<div className='flex items-center justify-center w-full min-h-[240px] bg-slate-900/50 rounded-lg text-red-400 text-sm'>
				Ошибка загрузки видео
			</div>
		)
	}

	return (
		<div className='relative w-full h-full min-h-[240px] rounded-lg overflow-hidden bg-slate-900'>
			<LiveKitRoom
				key={roomID}
				serverUrl={LIVEKIT_URL}
				token={token}
				connect
				onError={err =>
					setConnectionError(err?.message ?? 'Ошибка подключения')
				}
				onDisconnected={() => setConnectionError(null)}
			>
				<RoomAudioRenderer />
				<ViewerGrid />
				{connectionError && (
					<div className='absolute bottom-2 left-2 right-2 py-2 px-3 rounded bg-red-900/80 text-red-200 text-sm text-center'>
						{connectionError}
					</div>
				)}
			</LiveKitRoom>
		</div>
	)
}
