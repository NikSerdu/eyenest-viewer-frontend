export const ROUTES = {
	CAMERAS: {
		ROOT: '/',
		CAMERA_DETAILS: ':cameraId',
		CAMERA_HLS: ':cameraId/:fileId',
	},
	AUTH: '/auth',
	LOCATIONS: '/locations',
	ACTIVITY: '/activity',
	RECORDINGS: '/recordings',
} as const
