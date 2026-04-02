type EyenestWindowEnv = {
	VITE_SERVER_URL?: string
	VITE_LIVEKIT_URL?: string
}

declare global {
	interface Window {
		__EYENEST_ENV__?: EyenestWindowEnv
	}
}

function readWindowEnv(): EyenestWindowEnv | undefined {
	if (typeof window === 'undefined') return undefined
	return window.__EYENEST_ENV__
}

/** В Docker за Caddy /env.js задаёт URL до API и LiveKit без пересборки под IP. */
export function getViteServerUrl(): string {
	const w = readWindowEnv()?.VITE_SERVER_URL
	if (w) return w
	return import.meta.env.VITE_SERVER_URL ?? ''
}

export function getViteLiveKitUrl(): string {
	const w = readWindowEnv()?.VITE_LIVEKIT_URL
	if (w) return w
	return import.meta.env.VITE_LIVEKIT_URL ?? ''
}
