import { authInstance } from '@/api/axios/authInstance'
import type { RecordingResponse } from '@/api/generated/recordingResponse'
import type { GetAllRecordingsResponse } from '@api/generated'
import type { DeleteRecordingRequest } from '@api/generated/deleteRecordingRequest'
import { isAxiosError } from 'axios'

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

function parseFilenameFromContentDisposition(
	header: string | undefined,
	fallback: string,
) {
	if (!header) {
		return fallback
	}
	const star = /filename\*=UTF-8''([^;\n]+)/i.exec(header)
	if (star?.[1]) {
		try {
			return decodeURIComponent(star[1].trim())
		} catch {
			return fallback
		}
	}
	const quoted = /filename="([^"]+)"/i.exec(header)
	if (quoted?.[1]) {
		return quoted[1]
	}
	const plain = /filename=([^;\n]+)/i.exec(header)
	if (plain?.[1]) {
		return plain[1].trim().replace(/^"|"$/g, '')
	}
	return fallback
}

async function messageFromErrorBlob(blob: Blob): Promise<string> {
	const text = await blob.text()
	try {
		const d = JSON.parse(text) as Record<string, unknown>
		if (typeof d.message === 'string' && d.message.trim()) {
			return d.message.trim()
		}
		const details = d.details
		if (typeof details === 'string' && details.trim()) {
			return details.trim()
		}
	} catch {
		/* not JSON */
	}
	return 'Не удалось скачать запись'
}

/** ZIP с HLS (плейлист и сегменты) для активной записи; куки авторизации обязательны. */
export const downloadRecordingArchive = async (
	cameraId: string,
	recordingId: string,
) => {
	const fallbackName = `recording-${recordingId}.zip`
	try {
		const response = await authInstance.get<Blob>('/video/download', {
			params: { cameraId, recordingId },
			responseType: 'blob',
		})
		const filename = parseFilenameFromContentDisposition(
			response.headers['content-disposition'],
			fallbackName,
		)
		return { blob: response.data, filename }
	} catch (e) {
		if (isAxiosError(e) && e.response?.data instanceof Blob) {
			const message = await messageFromErrorBlob(e.response.data)
			throw Object.assign(new Error(message), { cause: e })
		}
		throw e
	}
}
