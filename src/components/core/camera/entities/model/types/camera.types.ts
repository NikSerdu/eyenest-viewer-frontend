export type CameraStatus = 'online' | 'offline'

export interface Camera {
	id: string
	name: string
	location: string
	status: CameraStatus
	recording: boolean
	imageUrl: string
	motion: boolean
	fps: number
}

