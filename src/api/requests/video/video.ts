import { authInstance } from '@/api/axios/authInstance'
import type { RecordingResponse } from '@/api/generated/recordingResponse'
import type { GetAllRecordingsResponse } from '@api/generated'
import type { DeleteRecordingRequest } from '@api/generated/deleteRecordingRequest'

export const getAllRecordings = (cameraId: string) =>
	authInstance
		.get<GetAllRecordingsResponse[]>('/video/getAllRecordings', {
			params: { cameraId },
		})
		.then(response => response.data)

export const deleteRecording = (data: DeleteRecordingRequest) =>
	authInstance
		.delete<RecordingResponse>(`/video/deleteRecording`, { data })
		.then(response => response.data)
