import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useGetAllRecordings } from '@/api/hooks'

import {
	buildRecordingPlaylistUrl,
	recordingPlaybackStore,
	type CameraRecording,
} from '@/components/core/camera/entities'
import { recordingEndMs } from '@/components/core/camera/features/CameraRecordingsTimeline/model/lib/recordingsDayTimeline'

/** На случай ответа от старых версий API со синтетической записью */
const LEGACY_STITCHED_ID = '__eyenest_stitched__'

export const useRecordingsPlaylistPlayback = (cameraId: string) => {
	const { data, isLoading, isError } = useGetAllRecordings(cameraId)

	const recordings = useMemo(() => {
		const raw = [...(data ?? [])].filter(r => r.id !== LEGACY_STITCHED_ID)
		raw.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		)
		return raw
	}, [data])

	/** От старой к новой: индекс 0 — самая старая, для подписи «Запись N из M» */
	const recordingsChronological = useMemo(
		() =>
			[...recordings].sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			),
		[recordings],
	)

	const [activeId, setActiveId] = useState<string | null>(null)
	const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
	const [playheadTick, setPlayheadTick] = useState(0)
	const pendingSeekSecRef = useRef<number | null>(null)
	const storeSyncedRef = useRef(false)

	useEffect(() => {
		storeSyncedRef.current = false
	}, [cameraId])

	useEffect(() => {
		if (recordings.length === 0 || storeSyncedRef.current) {
			return
		}
		const fromStore = recordingPlaybackStore.getState().selectedRecording
		if (fromStore?.id && recordings.some(r => r.id === fromStore.id)) {
			setActiveId(fromStore.id)
		}
		storeSyncedRef.current = true
	}, [recordings])

	const resolvedActiveId = useMemo(() => {
		if (recordings.length === 0) {
			return null
		}
		if (activeId && recordings.some(r => r.id === activeId)) {
			return activeId
		}
		return recordings[0].id
	}, [recordings, activeId])

	const chronoIndex = useMemo(() => {
		if (!resolvedActiveId) {
			return 0
		}
		const i = recordingsChronological.findIndex(
			r => r.id === resolvedActiveId,
		)
		return Math.max(0, i)
	}, [recordingsChronological, resolvedActiveId])

	const activeRecording = useMemo(
		() => recordings.find(r => r.id === resolvedActiveId) ?? null,
		[recordings, resolvedActiveId],
	)

	const playlistUrl = useMemo(() => {
		if (!activeRecording) {
			return ''
		}
		return buildRecordingPlaylistUrl(activeRecording, cameraId)
	}, [activeRecording, cameraId])

	useEffect(() => {
		if (!videoEl || !activeRecording) {
			return
		}
		const onTime = () => {
			setPlayheadTick(t => t + 1)
		}
		videoEl.addEventListener('timeupdate', onTime)
		onTime()
		return () => videoEl.removeEventListener('timeupdate', onTime)
	}, [videoEl, activeRecording?.id])

	useEffect(() => {
		if (pendingSeekSecRef.current == null || !videoEl) {
			return
		}
		const sec = pendingSeekSecRef.current
		const apply = () => {
			videoEl.currentTime = sec
			pendingSeekSecRef.current = null
		}
		videoEl.addEventListener('loadeddata', apply, { once: true })
		return () => videoEl.removeEventListener('loadeddata', apply)
	}, [videoEl, activeRecording?.id, playlistUrl])

	const playheadWallMs = useMemo(() => {
		if (!videoEl || !activeRecording) {
			return null
		}
		void playheadTick
		return (
			new Date(activeRecording.createdAt).getTime() +
			videoEl.currentTime * 1000
		)
	}, [videoEl, activeRecording, playheadTick])

	const selectRecording = useCallback((recording: CameraRecording) => {
		recordingPlaybackStore.getState().setSelectedRecording(recording)
		pendingSeekSecRef.current = null
		setActiveId(recording.id)
	}, [])

	/** Стрелка влево — более старая запись */
	const goOlder = useCallback(() => {
		pendingSeekSecRef.current = null
		if (chronoIndex <= 0) {
			return
		}
		const next = recordingsChronological[chronoIndex - 1]
		recordingPlaybackStore.getState().setSelectedRecording(next)
		setActiveId(next.id)
	}, [recordingsChronological, chronoIndex])

	/** Стрелка вправо — более новая запись */
	const goNewer = useCallback(() => {
		pendingSeekSecRef.current = null
		if (chronoIndex >= recordingsChronological.length - 1) {
			return
		}
		const next = recordingsChronological[chronoIndex + 1]
		recordingPlaybackStore.getState().setSelectedRecording(next)
		setActiveId(next.id)
	}, [recordingsChronological, chronoIndex])

	const canGoOlder = chronoIndex > 0
	const canGoNewer =
		recordingsChronological.length > 0 &&
		chronoIndex < recordingsChronological.length - 1

	const seekToWallMs = useCallback(
		(wallMs: number) => {
			let targetRec: CameraRecording | null = null
			let offsetSec = 0
			let foundContained = false

			for (const rec of recordings) {
				const rs = new Date(rec.createdAt).getTime()
				const re = recordingEndMs(rec)
				if (wallMs >= rs && wallMs <= re) {
					targetRec = rec
					offsetSec = (wallMs - rs) / 1000
					foundContained = true
					break
				}
			}

			if (!foundContained) {
				let best: {
					rec: CameraRecording
					wallMs: number
					dist: number
				} | null = null
				for (const rec of recordings) {
					const rs = new Date(rec.createdAt).getTime()
					const re = recordingEndMs(rec)
					const clamped = Math.min(Math.max(wallMs, rs), re)
					const dist = Math.abs(wallMs - clamped)
					if (!best || dist < best.dist) {
						best = { rec, wallMs: clamped, dist }
					}
				}
				if (!best) {
					return
				}
				targetRec = best.rec
				offsetSec =
					(best.wallMs - new Date(best.rec.createdAt).getTime()) / 1000
			}

			if (!targetRec) {
				return
			}

			recordingPlaybackStore.getState().setSelectedRecording(targetRec)

			if (targetRec.id === resolvedActiveId && videoEl) {
				videoEl.currentTime = offsetSec
				return
			}

			pendingSeekSecRef.current = offsetSec
			setActiveId(targetRec.id)
		},
		[recordings, videoEl, resolvedActiveId],
	)

	/** 1 = самая старая запись */
	const chronoRecordingNumber = chronoIndex + 1

	return {
		recordings,
		realRecordings: recordings,
		activeRecording,
		playlistUrl,
		selectRecording,
		goOlder,
		goNewer,
		isLoading,
		isError,
		hasRecordings: recordings.length > 0,
		onVideoElement: setVideoEl,
		chronoRecordingNumber,
		recordingTotal: recordings.length,
		canGoOlder,
		canGoNewer,
		playheadWallMs,
		seekToWallMs,
		resolvedActiveId,
	}
}
