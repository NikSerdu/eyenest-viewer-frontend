import { useCallback, useEffect, useMemo, useState } from 'react'

import { useGetAllRecordings, useGetStitchedChapters } from '@/api/hooks'
import type { StitchedChapterDto } from '@/api/requests/video/video'

import {
	buildRecordingPlaylistUrl,
	EYENEST_STITCHED_RECORDING_ID,
	getRecordingPlaylistName,
	type CameraRecording,
} from '@/components/core/camera/entities'
import { recordingEndMs } from '@/components/core/camera/features/CameraRecordingsTimeline/model/lib/recordingsDayTimeline'

function chapterIndexAtTime(
	chapters: StitchedChapterDto[],
	t: number,
): number {
	for (let i = chapters.length - 1; i >= 0; i--) {
		if (t + 0.08 >= chapters[i].startSec) {
			return i
		}
	}
	return 0
}

export const useRecordingsPlaylistPlayback = (cameraId: string) => {
	const { data, isLoading, isError } = useGetAllRecordings(cameraId)

	const recordings = useMemo(() => {
		const raw = [...(data ?? [])]
		const stitched = raw.find(r => r.id === EYENEST_STITCHED_RECORDING_ID)
		const rest = raw
			.filter(r => r.id !== EYENEST_STITCHED_RECORDING_ID)
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)
		return stitched ? [stitched, ...rest] : rest
	}, [data])

	const realRecordings = useMemo(
		() => recordings.filter(r => r.id !== EYENEST_STITCHED_RECORDING_ID),
		[recordings],
	)

	const stitchedEntry = useMemo(
		() =>
			recordings.find(r => r.id === EYENEST_STITCHED_RECORDING_ID) ?? null,
		[recordings],
	)

	const chaptersQuery = useGetStitchedChapters(cameraId, {
		enabled: Boolean(cameraId && stitchedEntry),
	})

	const chapters = chaptersQuery.data?.chapters ?? []
	const orderedChapters = useMemo(
		() => [...chapters].sort((a, b) => a.startSec - b.startSec),
		[chapters],
	)

	const chapterNavReady =
		Boolean(stitchedEntry) &&
		!chaptersQuery.isError &&
		orderedChapters.length > 0

	const [legacyActiveId, setLegacyActiveId] = useState<string | null>(null)
	const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
	const [stitchedHighlightId, setStitchedHighlightId] = useState<string | null>(
		null,
	)
	const [playheadTick, setPlayheadTick] = useState(0)

	const resolvedLegacyActiveId = useMemo(() => {
		if (realRecordings.length === 0) {
			return null
		}
		if (legacyActiveId && realRecordings.some(r => r.id === legacyActiveId)) {
			return legacyActiveId
		}
		return realRecordings[0].id
	}, [realRecordings, legacyActiveId])

	const playlistUrl = useMemo(() => {
		if (stitchedEntry) {
			return buildRecordingPlaylistUrl(
				getRecordingPlaylistName(stitchedEntry),
			)
		}
		const rec = realRecordings.find(r => r.id === resolvedLegacyActiveId)
		if (!rec) {
			return ''
		}
		return buildRecordingPlaylistUrl(getRecordingPlaylistName(rec))
	}, [stitchedEntry, realRecordings, resolvedLegacyActiveId])

	useEffect(() => {
		if (!chapterNavReady) {
			return
		}
		if (
			stitchedHighlightId &&
			orderedChapters.some(c => c.recordingId === stitchedHighlightId)
		) {
			return
		}
		setStitchedHighlightId(orderedChapters[0].recordingId)
	}, [chapterNavReady, orderedChapters, stitchedHighlightId])

	useEffect(() => {
		if (!videoEl || !chapterNavReady) {
			return
		}
		const onTime = () => {
			const idx = chapterIndexAtTime(orderedChapters, videoEl.currentTime)
			setStitchedHighlightId(orderedChapters[idx].recordingId)
			setPlayheadTick(t => t + 1)
		}
		videoEl.addEventListener('timeupdate', onTime)
		onTime()
		return () => videoEl.removeEventListener('timeupdate', onTime)
	}, [videoEl, chapterNavReady, orderedChapters])

	const activeRecording = useMemo(() => {
		if (chapterNavReady) {
			const id =
				stitchedHighlightId ?? orderedChapters[0]?.recordingId ?? null
			if (id) {
				return recordings.find(r => r.id === id) ?? null
			}
			return null
		}
		return (
			realRecordings.find(r => r.id === resolvedLegacyActiveId) ?? null
		)
	}, [
		chapterNavReady,
		stitchedHighlightId,
		orderedChapters,
		recordings,
		realRecordings,
		resolvedLegacyActiveId,
	])

	const seekToChapterRecording = useCallback(
		(recordingId: string) => {
			if (!chapterNavReady) {
				return
			}
			if (recordingId === EYENEST_STITCHED_RECORDING_ID) {
				if (videoEl) {
					videoEl.currentTime = 0
				}
				setStitchedHighlightId(orderedChapters[0]?.recordingId ?? null)
				return
			}
			const ch = orderedChapters.find(c => c.recordingId === recordingId)
			if (!ch) {
				return
			}
			if (videoEl) {
				videoEl.currentTime = ch.startSec
			}
			setStitchedHighlightId(recordingId)
		},
		[chapterNavReady, orderedChapters, videoEl],
	)

	const selectRecording = useCallback(
		(recording: CameraRecording) => {
			if (chapterNavReady) {
				seekToChapterRecording(recording.id)
				return
			}
			if (recording.id === EYENEST_STITCHED_RECORDING_ID) {
				return
			}
			setLegacyActiveId(recording.id)
		},
		[chapterNavReady, seekToChapterRecording],
	)

	const chapterIdx = useMemo(() => {
		if (!chapterNavReady || !videoEl) {
			return stitchedHighlightId
				? Math.max(
						0,
						orderedChapters.findIndex(
							c => c.recordingId === stitchedHighlightId,
						),
					)
				: 0
		}
		void playheadTick
		return chapterIndexAtTime(orderedChapters, videoEl.currentTime)
	}, [
		chapterNavReady,
		videoEl,
		orderedChapters,
		stitchedHighlightId,
		playheadTick,
	])

	const goPrev = useCallback(() => {
		if (chapterNavReady && videoEl) {
			const idx = chapterIndexAtTime(orderedChapters, videoEl.currentTime)
			const next = Math.max(0, idx - 1)
			videoEl.currentTime = orderedChapters[next].startSec
			return
		}
		const idx = realRecordings.findIndex(
			r => r.id === resolvedLegacyActiveId,
		)
		if (idx <= 0) {
			return
		}
		setLegacyActiveId(realRecordings[idx - 1].id)
	}, [
		chapterNavReady,
		videoEl,
		orderedChapters,
		realRecordings,
		resolvedLegacyActiveId,
	])

	const goNext = useCallback(() => {
		if (chapterNavReady && videoEl) {
			const idx = chapterIndexAtTime(orderedChapters, videoEl.currentTime)
			const next = Math.min(orderedChapters.length - 1, idx + 1)
			videoEl.currentTime = orderedChapters[next].startSec
			return
		}
		const idx = realRecordings.findIndex(
			r => r.id === resolvedLegacyActiveId,
		)
		if (idx < 0 || idx >= realRecordings.length - 1) {
			return
		}
		setLegacyActiveId(realRecordings[idx + 1].id)
	}, [chapterNavReady, videoEl, orderedChapters, realRecordings, resolvedLegacyActiveId])

	const uiSelectedId = chapterNavReady
		? (stitchedHighlightId ??
			orderedChapters[0]?.recordingId ??
			EYENEST_STITCHED_RECORDING_ID)
		: (resolvedLegacyActiveId ?? '')

	const canPrev = useMemo(() => {
		if (chapterNavReady && videoEl) {
			void playheadTick
			return (
				chapterIndexAtTime(orderedChapters, videoEl.currentTime) > 0
			)
		}
		return (
			realRecordings.findIndex(r => r.id === resolvedLegacyActiveId) > 0
		)
	}, [
		chapterNavReady,
		videoEl,
		orderedChapters,
		playheadTick,
		realRecordings,
		resolvedLegacyActiveId,
	])

	const canNext = useMemo(() => {
		if (chapterNavReady && videoEl) {
			void playheadTick
			return (
				chapterIndexAtTime(orderedChapters, videoEl.currentTime) <
				orderedChapters.length - 1
			)
		}
		const idx = realRecordings.findIndex(
			r => r.id === resolvedLegacyActiveId,
		)
		return idx >= 0 && idx < realRecordings.length - 1
	}, [
		chapterNavReady,
		videoEl,
		orderedChapters,
		playheadTick,
		realRecordings,
		resolvedLegacyActiveId,
	])

	const playheadWallMs = useMemo(() => {
		if (!videoEl) {
			return null
		}
		void playheadTick
		if (chapterNavReady) {
			const t = videoEl.currentTime
			const idx = chapterIndexAtTime(orderedChapters, t)
			const ch = orderedChapters[idx]
			const rec = recordings.find(r => r.id === ch.recordingId)
			if (!rec) {
				return null
			}
			const offsetSec = t - ch.startSec
			return new Date(rec.createdAt).getTime() + offsetSec * 1000
		}
		const rec = realRecordings.find(r => r.id === resolvedLegacyActiveId)
		if (!rec) {
			return null
		}
		return new Date(rec.createdAt).getTime() + videoEl.currentTime * 1000
	}, [
		videoEl,
		playheadTick,
		chapterNavReady,
		orderedChapters,
		recordings,
		realRecordings,
		resolvedLegacyActiveId,
	])

	const seekToWallMs = useCallback(
		(wallMs: number) => {
			let targetRec: CameraRecording | null = null
			let offsetSec = 0
			let foundContained = false

			for (const rec of realRecordings) {
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
				for (const rec of realRecordings) {
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

			if (chapterNavReady) {
				const ch = orderedChapters.find(
					c => c.recordingId === targetRec!.id,
				)
				if (ch && videoEl) {
					videoEl.currentTime = ch.startSec + offsetSec
					setStitchedHighlightId(targetRec.id)
				}
				return
			}

			setLegacyActiveId(targetRec.id)
			if (videoEl) {
				videoEl.currentTime = offsetSec
			}
		},
		[chapterNavReady, orderedChapters, realRecordings, videoEl],
	)

	return {
		recordings,
		activeRecording,
		playlistUrl,
		selectRecording,
		goPrev,
		goNext,
		isLoading,
		isError,
		hasRecordings: recordings.length > 0,
		hasStitchedEntry: Boolean(stitchedEntry),
		chapterNavReady,
		orderedChapters,
		chaptersLoading: chaptersQuery.isLoading,
		chaptersError: chaptersQuery.isError,
		onVideoElement: setVideoEl,
		uiSelectedId,
		currentChapterIndex: chapterIdx,
		chapterTotal: chapterNavReady ? orderedChapters.length : realRecordings.length,
		canPrev,
		canNext,
		showLegacyNav:
			!chapterNavReady && realRecordings.length > 1 && !stitchedEntry,
		realRecordings,
		playheadWallMs,
		seekToWallMs,
	}
}
