import { isAxiosError } from 'axios'

const FALLBACK = 'Что-то пошло не так'

function stringifyDetails(value: unknown): string | null {
	if (typeof value === 'string' && value.trim()) {
		return value.trim()
	}
	if (Array.isArray(value)) {
		const parts = value
			.map(item => {
				if (typeof item === 'string') return item
				if (
					item &&
					typeof item === 'object' &&
					'message' in item &&
					typeof (item as { message: unknown }).message === 'string'
				) {
					return (item as { message: string }).message
				}
				return null
			})
			.filter(Boolean) as string[]
		if (parts.length) return parts.join(', ')
	}
	return null
}

export function getApiErrorMessage(error: unknown): string {
	if (!isAxiosError(error)) {
		return FALLBACK
	}

	const data = error.response?.data
	if (!data || typeof data !== 'object') {
		return FALLBACK
	}

	const d = data as Record<string, unknown>

	const fromDetails = stringifyDetails(d.details)
	if (fromDetails) return fromDetails

	const fromMessage = stringifyDetails(d.message)
	if (fromMessage) return fromMessage

	return FALLBACK
}
