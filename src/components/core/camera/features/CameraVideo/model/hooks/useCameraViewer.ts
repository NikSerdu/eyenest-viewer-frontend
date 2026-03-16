import { useCallback, useState } from 'react'

import { useGetLiveKitViewerToken } from '@/api/hooks/camera/camera.hooks'

interface UseCameraViewerResult {
	token: string | null
	isLoading: boolean
	isError: boolean
	connectionError: string | null
	handleRoomError: (err: { message?: string } | Error | null) => void
	handleDisconnected: () => void
}

export const useCameraViewer = (roomID: string): UseCameraViewerResult => {
	const [connectionError, setConnectionError] = useState<string | null>(null)

	const { data, isLoading, isError } = useGetLiveKitViewerToken(roomID)

	const token = data?.token ?? null

	const handleRoomError = useCallback(
		(err: { message?: string } | Error | null) => {
			setConnectionError(err?.message ?? 'Ошибка подключения')
		},
		[],
	)

	const handleDisconnected = useCallback(() => {
		setConnectionError(null)
	}, [])

	return {
		token,
		isLoading,
		isError,
		connectionError,
		handleRoomError,
		handleDisconnected,
	}
}

