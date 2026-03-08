import { useEffect, useRef, useState, type FC } from 'react'
import { webRTCManager } from '../model/hooks/webRTCStore'

interface IProps {
	roomID: string
}

export const CameraVideo: FC<IProps> = ({ roomID }) => {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const [muted, setMuted] = useState(true)

	useEffect(() => {
		if (webRTCManager.cameraPeerConnections[roomID]) {
			console.log(webRTCManager.cameraPeerConnections[roomID])
			return
		}
		webRTCManager.handleJoin(roomID)
	}, [roomID])

	// Передаём реф в менеджер
	useEffect(() => {
		webRTCManager.provideMediaRef(roomID, videoRef.current)
	}, [roomID])

	// Функция для включения/выключения звука
	const toggleAudio = () => {
		if (!videoRef.current) return
		videoRef.current.muted = !videoRef.current.muted
		setMuted(videoRef.current.muted)
	}

	return (
		<div>
			<video
				width='100%'
				height='100%'
				ref={videoRef}
				autoPlay
				playsInline
				muted={muted} // управляется состоянием
			/>
			<button onClick={toggleAudio}>
				{muted ? 'Включить звук' : 'Выключить звук'}
			</button>
		</div>
	)
}
