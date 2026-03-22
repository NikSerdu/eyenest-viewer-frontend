import type { EventResponse } from '@api/generated'

export const isEventInDateRange = (
	createdAtIso: string,
	dateFrom: string,
	dateTo: string,
) => {
	const d = new Date(createdAtIso)
	if (Number.isNaN(d.getTime())) {
		return false
	}

	if (dateFrom) {
		const start = new Date(`${dateFrom}T00:00:00.000`)
		if (d < start) {
			return false
		}
	}

	if (dateTo) {
		const end = new Date(`${dateTo}T23:59:59.999`)
		if (d > end) {
			return false
		}
	}

	return true
}

export const filterCameraEvents = (
	events: EventResponse[],
	options: { eventType: string; dateFrom: string; dateTo: string },
) => {
	const { eventType, dateFrom, dateTo } = options

	return events.filter(event => {
		if (eventType !== 'all' && event.eventType !== eventType) {
			return false
		}

		return isEventInDateRange(event.createdAt, dateFrom, dateTo)
	})
}
