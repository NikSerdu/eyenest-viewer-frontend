import { authInstance } from '@/api/axios/authInstance'
import type { GetAllRecordingsResponse } from '@api/generated'

export const getAllRecordings = (cameraId: string) =>
	authInstance
		.get<GetAllRecordingsResponse[]>('/video/getAllRecordings', {
			params: { cameraId },
		})
		.then(response => response.data)
