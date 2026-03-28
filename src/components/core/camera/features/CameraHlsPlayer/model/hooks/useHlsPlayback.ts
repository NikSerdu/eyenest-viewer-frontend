import Hls from 'hls.js'
import { useCallback, useEffect, useRef } from 'react'

export const useHlsPlayback = (
	playlistUrl: string,
	onVideoElement?: (el: HTMLVideoElement | null) => void,
) => {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const onVideoElementRef = useRef(onVideoElement)
	onVideoElementRef.current = onVideoElement

	const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
		videoRef.current = node
		onVideoElementRef.current?.(node)
	}, [])

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
				xhrSetup: (xhr, url) => {
					if (url.includes('stitchedPlaylist')) {
						xhr.withCredentials = true
					}
				},
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
		setVideoRef,
	}
}
