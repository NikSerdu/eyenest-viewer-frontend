import { authInstance } from '@/api/axios/authInstance'
import type { EventResponse } from '@api/generated'

export const getEventsByCameraId = (cameraId: string) =>
	authInstance
		.get<EventResponse[]>('/events/getEventsByCameraId', {
			params: { cameraId },
		})
		.then(response => response.data)
