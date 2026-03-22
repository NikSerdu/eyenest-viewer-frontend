const EVENT_TYPE_LABELS_RU: Record<string, string> = {
	CAMERA_JOIN: 'Камера подключена',
	CAMERA_LEAVE: 'Камера отключена',
	START_RECORDING: 'Начало записи',
	STOP_RECORDING: 'Остановка записи',
	MOTION_DETECTED: 'Обнаружено движение',
	MOTION_ON: 'Детекция движения начата',
	MOTION_OFF: 'Детекция движения остановлена',
}

export const getEventTypeLabelRu = (eventType: string) =>
	EVENT_TYPE_LABELS_RU[eventType] ?? eventType

export const KNOWN_CAMERA_EVENT_TYPES = [
	'CAMERA_JOIN',
	'CAMERA_LEAVE',
	'START_RECORDING',
	'STOP_RECORDING',
	'MOTION_DETECTED',
	'MOTION_ON',
	'MOTION_OFF',
] as const
