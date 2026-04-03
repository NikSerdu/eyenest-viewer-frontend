type EyenestWindowEnv = {
	VITE_SERVER_URL?: string
	VITE_LIVEKIT_URL?: string
	/** Базовый URL до бакета livekit в MinIO (HLS), с завершающим слэшем. В Docker: тот же хост, порт 8900. */
	VITE_MINIO_HLS_BASE_URL?: string
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

const DEFAULT_MINIO_HLS_BASE = 'http://localhost:9000/livekit/'

export function getViteMinioHlsBaseUrl(): string {
	const w = readWindowEnv()?.VITE_MINIO_HLS_BASE_URL
	if (w) return w.endsWith('/') ? w : `${w}/`
	const e = import.meta.env.VITE_MINIO_HLS_BASE_URL as string | undefined
	if (e) return e.endsWith('/') ? e : `${e}/`
	return DEFAULT_MINIO_HLS_BASE
}
