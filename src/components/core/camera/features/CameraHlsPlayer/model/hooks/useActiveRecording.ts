import { useEffect, useMemo } from 'react'

import { useGetAllRecordings } from '@/api/hooks'

import {
	buildRecordingPlaylistUrl,
	getRecordingPlaylistName,
	recordingPlaybackStore,
} from '@/components/core/camera/entities'

export const useActiveRecording = (cameraId?: string, fileId?: string) => {
	const selectedRecording = recordingPlaybackStore(
		state => state.selectedRecording,
	)
	const setSelectedRecording = recordingPlaybackStore(
		state => state.setSelectedRecording,
	)

	const shouldFetchRecordings = Boolean(cameraId && fileId)
	const { data: recordings, isLoading, isFetched } = useGetAllRecordings(
		cameraId ?? '',
		{
			enabled: shouldFetchRecordings,
		},
	)

	const fallbackRecording = useMemo(
		() => recordings?.find(recording => recording.id === fileId) ?? null,
		[recordings, fileId],
	)

	const activeRecording =
		selectedRecording && selectedRecording.id === fileId
			? selectedRecording
			: fallbackRecording

	useEffect(() => {
		if (!fallbackRecording || selectedRecording?.id === fallbackRecording.id) {
			return
		}

		setSelectedRecording(fallbackRecording)
	}, [fallbackRecording, selectedRecording?.id, setSelectedRecording])

	const playlistUrl = useMemo(() => {
		if (!activeRecording) {
			return ''
		}

		return buildRecordingPlaylistUrl(getRecordingPlaylistName(activeRecording))
	}, [activeRecording])

	return {
		activeRecording,
		isLoading: shouldFetchRecordings && isLoading,
		isNotFound: shouldFetchRecordings && isFetched && !activeRecording,
		playlistUrl,
	}
}
