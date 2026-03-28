import { useCallback, useEffect, useMemo, useState } from 'react'

import type { CameraRecording } from '@/components/core/camera/entities'
import { recordingEndMs } from '@/components/core/camera/features/CameraRecordingsTimeline/model/lib/recordingsDayTimeline'

/** Плейхед и seek по «настенному» времени для одной записи (без склейки). */
export const useSingleRecordingTimelinePlayback = (
	recording: CameraRecording | null,
) => {
	const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
	const [playheadTick, setPlayheadTick] = useState(0)

	useEffect(() => {
		if (!videoEl || !recording) {
			return
		}
		const onTime = () => {
			setPlayheadTick(t => t + 1)
		}
		videoEl.addEventListener('timeupdate', onTime)
		onTime()
		return () => videoEl.removeEventListener('timeupdate', onTime)
	}, [videoEl, recording?.id])

	const playheadWallMs = useMemo(() => {
		if (!videoEl || !recording) {
			return null
		}
		void playheadTick
		return new Date(recording.createdAt).getTime() + videoEl.currentTime * 1000
	}, [videoEl, recording, playheadTick])

	const seekToWallMs = useCallback(
		(wallMs: number) => {
			if (!videoEl || !recording) {
				return
			}
			const rs = new Date(recording.createdAt).getTime()
			const re = recordingEndMs(recording)
			const clamped = Math.min(Math.max(wallMs, rs), re)
			videoEl.currentTime = (clamped - rs) / 1000
		},
		[videoEl, recording],
	)

	return {
		onVideoElement: setVideoEl,
		playheadWallMs,
		seekToWallMs,
	}
}
