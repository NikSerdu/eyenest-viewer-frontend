import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { GetAllRecordingsResponse } from '@api/generated'
import { getAllRecordings } from '@api/requests'

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
