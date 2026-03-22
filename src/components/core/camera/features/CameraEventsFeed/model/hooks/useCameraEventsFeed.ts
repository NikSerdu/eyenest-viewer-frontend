import { useMemo, useState } from 'react'

import type { EventResponse } from '@api/generated'
import { useGetEventsByCameraId } from '@/api/hooks'

import { filterCameraEvents } from '../../../../entities/event'

const sortByCreatedAtDesc = (a: EventResponse, b: EventResponse) =>
	new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

export const useCameraEventsFeed = (cameraId: string) => {
	const { data, isLoading, isError } = useGetEventsByCameraId(cameraId)
	const [eventType, setEventType] = useState<string>('all')
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')

	const sortedEvents = useMemo(
		() => [...(data ?? [])].sort(sortByCreatedAtDesc),
		[data],
	)

	const filteredEvents = useMemo(
		() =>
			filterCameraEvents(sortedEvents, {
				eventType,
				dateFrom,
				dateTo,
			}),
		[sortedEvents, eventType, dateFrom, dateTo],
	)

	const resetFilters = () => {
		setEventType('all')
		setDateFrom('')
		setDateTo('')
	}

	return {
		sortedEvents,
		filteredEvents,
		eventType,
		setEventType,
		dateFrom,
		setDateFrom,
		dateTo,
		setDateTo,
		resetFilters,
		isLoading,
		isError,
	}
}
