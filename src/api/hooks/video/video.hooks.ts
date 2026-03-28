import {
	useMutation,
	useQuery,
	type UseMutationOptions,
	type UseQueryOptions,
} from '@tanstack/react-query'

import type {
	DeleteRecordingRequest,
	GetAllRecordingsResponse,
	RecordingResponse,
} from '@api/generated'
import {
	deleteRecording,
	getAllRecordings,
	getStitchedChapters,
} from '@api/requests'

export const useGetAllRecordings = (
	cameraId: string,
	options?: Omit<
		UseQueryOptions<GetAllRecordingsResponse[], unknown>,
		'queryKey' | 'queryFn'
	>,
) =>
	useQuery({
		queryKey: ['get all recordings', cameraId],
		queryFn: () => getAllRecordings(cameraId),
		...options,
	})

export const useGetStitchedChapters = (
	cameraId: string,
	options?: Omit<
		UseQueryOptions<
			Awaited<ReturnType<typeof getStitchedChapters>>,
			unknown
		>,
		'queryKey' | 'queryFn'
	>,
) =>
	useQuery({
		queryKey: ['stitched chapters', cameraId],
		queryFn: () => getStitchedChapters(cameraId),
		retry: false,
		...options,
	})

export const useDeleteRecording = (
	options?: Omit<
		UseMutationOptions<RecordingResponse, unknown, DeleteRecordingRequest>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['delete recording'],
		mutationFn: deleteRecording,
		...options,
	})
