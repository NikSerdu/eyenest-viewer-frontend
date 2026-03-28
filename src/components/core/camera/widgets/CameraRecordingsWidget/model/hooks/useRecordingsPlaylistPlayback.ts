import { useCallback, useMemo, useState } from 'react'

import { useGetAllRecordings } from '@/api/hooks'

import {
	buildRecordingPlaylistUrl,
	getRecordingPlaylistName,
	type CameraRecording,
} from '@/components/core/camera/entities'

export const useRecordingsPlaylistPlayback = (cameraId: string) => {
	const { data, isLoading, isError } = useGetAllRecordings(cameraId)

	const recordings = useMemo(
		() =>
			[...(data ?? [])].sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			),
		[data],
	)

	const [activeId, setActiveId] = useState<string | null>(null)

	const resolvedActiveId = useMemo(() => {
		if (recordings.length === 0) {
			return null
		}
		if (activeId && recordings.some(r => r.id === activeId)) {
			return activeId
		}
		return recordings[0].id
	}, [recordings, activeId])

	const activeRecording = useMemo(
		() =>
			recordings.find(r => r.id === resolvedActiveId) ?? null,
		[recordings, resolvedActiveId],
	)

	const activeIndex = useMemo(
		() => recordings.findIndex(r => r.id === resolvedActiveId),
		[recordings, resolvedActiveId],
	)

	const playlistUrl = useMemo(() => {
		if (!activeRecording) {
			return ''
		}
		return buildRecordingPlaylistUrl(
			getRecordingPlaylistName(activeRecording),
		)
	}, [activeRecording])

	const selectRecording = useCallback((recording: CameraRecording) => {
		setActiveId(recording.id)
	}, [])

	const goPrev = useCallback(() => {
		if (activeIndex <= 0) {
			return
		}
		setActiveId(recordings[activeIndex - 1].id)
	}, [recordings, activeIndex])

	const goNext = useCallback(() => {
		if (activeIndex < 0 || activeIndex >= recordings.length - 1) {
			return
		}
		setActiveId(recordings[activeIndex + 1].id)
	}, [recordings, activeIndex])

	return {
		recordings,
		activeRecording,
		activeIndex,
		playlistUrl,
		selectRecording,
		goPrev,
		goNext,
		isLoading,
		isError,
		hasRecordings: recordings.length > 0,
	}
}
