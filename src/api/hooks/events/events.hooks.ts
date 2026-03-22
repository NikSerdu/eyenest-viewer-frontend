import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { EventResponse } from '@api/generated'
import { getEventsByCameraId } from '@api/requests'

export const useGetEventsByCameraId = (
	cameraId: string,
	options?: Omit<
		UseQueryOptions<EventResponse[], unknown>,
		'queryKey' | 'queryFn'
	>,
) =>
	useQuery({
		queryKey: ['get events by camera id', cameraId],
		queryFn: () => getEventsByCameraId(cameraId),
		...options,
	})
