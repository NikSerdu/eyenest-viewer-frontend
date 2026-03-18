import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

export const useHlsPlayback = (playlistUrl: string) => {
	const videoRef = useRef<HTMLVideoElement | null>(null)

	useEffect(() => {
		const video = videoRef.current
		const playVideo = () => {
			void video?.play().catch(() => undefined)
		}

		if (!video || !playlistUrl) {
			return
		}

		if (Hls.isSupported()) {
			const hls = new Hls({
				enableWorker: true,
			})

			hls.loadSource(playlistUrl)
			hls.attachMedia(video)
			hls.on(Hls.Events.MANIFEST_PARSED, playVideo)

			return () => {
				hls.destroy()
				video.removeAttribute('src')
				video.load()
			}
		}

		if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.addEventListener('loadedmetadata', playVideo)
			video.src = playlistUrl

			return () => {
				video.removeEventListener('loadedmetadata', playVideo)
				video.removeAttribute('src')
				video.load()
			}
		}
	}, [playlistUrl])

	return {
		videoRef,
	}
}
