export const ROUTES = {
	CAMERAS: {
		ROOT: '/',
		CAMERA_DETAILS: ':cameraId',
		CAMERA_EVENTS: ':cameraId/events',
		CAMERA_RECORDINGS: ':cameraId/recordings',
	},
	AUTH: '/auth',
	LOCATIONS: '/locations',
	ACTIVITY: '/activity',
	RECORDINGS: '/recordings',
	ACCOUNT_SETTINGS: '/account/settings',
} as const
