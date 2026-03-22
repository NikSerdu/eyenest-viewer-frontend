export const ROUTES = {
	CAMERAS: {
		ROOT: '/',
		CAMERA_DETAILS: ':cameraId',
		CAMERA_EVENTS: ':cameraId/events',
		CAMERA_RECORDINGS: ':cameraId/recordings',
		CAMERA_HLS: ':cameraId/:fileId',
	},
	AUTH: '/auth',
	LOCATIONS: '/locations',
	ACTIVITY: '/activity',
	RECORDINGS: '/recordings',
} as const
