import type { CameraRecording } from '../types/recording.types'

const MINIO_HLS_BASE_URL = 'http://localhost:9000/livekit/'

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
	dateStyle: 'medium',
	timeStyle: 'short',
})

export const formatRecordingDateTime = (
	value?: string | null,
	fallback = 'Нет данных',
) => {
	if (!value) {
		return fallback
	}

	const date = new Date(value)

	if (Number.isNaN(date.getTime())) {
		return fallback
	}

	return dateTimeFormatter.format(date)
}

export const getRecordingStatusMeta = (status: number) => {
	switch (status) {
		case 0:
			return {
				label: 'Идет запись',
				accentColor: 'red.500',
				accentBg: 'red.50',
				accentBorder: 'red.200',
				description: 'Сегменты продолжают поступать в live-плейлист.',
			}
		case 1:
			return {
				label: 'Запись завершена',
				accentColor: 'green.500',
				accentBg: 'green.50',
				accentBorder: 'green.200',
				description: 'Плейлист финализирован и готов к просмотру.',
			}
		default:
			return {
				label: `Статус ${status}`,
				accentColor: 'gray.500',
				accentBg: 'gray.50',
				accentBorder: 'gray.200',
				description: 'Неизвестный статус. Подготовьте обработку новых состояний.',
			}
	}
}

export const getRecordingPlaylistName = (recording: CameraRecording) => {
	if (recording.status !== 0 || recording.playlistName.endsWith('-live.m3u8')) {
		return recording.playlistName
	}

	return recording.playlistName.replace(/\.m3u8$/, '-live.m3u8')
}

export const buildRecordingPlaylistUrl = (playlistName: string) => {
	try {
		return new URL(playlistName).toString()
	} catch {
		return new URL(playlistName.replace(/^\/+/, ''), MINIO_HLS_BASE_URL).toString()
	}
}
