import type { CameraRecording } from '../types/recording.types'

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
				description:
					'Неизвестный статус. Подготовьте обработку новых состояний.',
			}
	}
}

export const buildRecordingPlaylistUrl = (
	recording: CameraRecording,
	cameraId: string,
) => {
	const params = new URLSearchParams({
		recordingId: recording.id,
		cameraId,
	})
	return `${import.meta.env.VITE_SERVER_URL}/video/playlist?${params.toString()}`
}
