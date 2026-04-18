import Hls from 'hls.js'
import type {
	FragmentLoaderConstructor,
	FragmentLoaderContext,
	HlsConfig,
	LoaderCallbacks,
	LoaderConfiguration,
	LoaderContext,
} from 'hls.js'
import { useCallback, useEffect, useRef } from 'react'

const GATEWAY_SEGMENT_PATH = '/video/segment'

function createGatewayFragmentLoader() {
	const BaseLoader = Hls.DefaultConfig.loader

	return class GatewayFragmentLoader extends BaseLoader {
		constructor(config: HlsConfig) {
			super(config)
		}

		override load(
			context: FragmentLoaderContext,
			config: LoaderConfiguration,
			callbacks: LoaderCallbacks<FragmentLoaderContext>,
		): void {
			const segmentGatewayUrl = context.url
			if (!segmentGatewayUrl.includes(GATEWAY_SEGMENT_PATH)) {
				super.load(
					context,
					config,
					callbacks as LoaderCallbacks<LoaderContext>,
				)
				return
			}

			void fetch(segmentGatewayUrl, { credentials: 'include' })
				.then(async res => {
					if (!res.ok) {
						callbacks.onError(
							{ code: res.status, text: res.statusText },
							context,
							null,
							this.stats,
						)
						return
					}
					const payload = (await res.json()) as { url?: string }
					if (!payload.url) {
						callbacks.onError(
							{ code: 500, text: 'Invalid segment URL response' },
							context,
							null,
							this.stats,
						)
						return
					}
					super.load(
						{ ...context, url: payload.url },
						config,
						callbacks as LoaderCallbacks<LoaderContext>,
					)
				})
				.catch((err: unknown) => {
					const message = err instanceof Error ? err.message : 'Network error'
					callbacks.onError({ code: 0, text: message }, context, null, this.stats)
				})
		}
	}
}

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
			const gatewayOrigin = new URL(import.meta.env.VITE_SERVER_URL).origin

			const hls = new Hls({
				enableWorker: true,
				fLoader: createGatewayFragmentLoader() as unknown as FragmentLoaderConstructor,
				xhrSetup: (xhr, url) => {
					if (url.startsWith(gatewayOrigin) || url.startsWith('/')) {
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
