import type { FC } from 'react'
import { useEffect } from 'react'
import {
	useTracks,
	VideoTrack,
	type TrackReference,
} from '@livekit/components-react'
import { Track } from 'livekit-client'

export const CameraPreviewContent: FC<{
	onStatusChange?: (online: boolean) => void
}> = ({ onStatusChange }) => {
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: false },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],
		{ onlySubscribed: true },
	)

	const trackRef = tracks
		.filter((t): t is TrackReference => !!t.publication)
		.sort(t => (t.publication.source === Track.Source.ScreenShare ? -1 : 1))[0]

	const hasCameraTrack = tracks.some(
		t => !!t.publication && t.publication.source === Track.Source.Camera,
	)

	useEffect(() => {
		if (onStatusChange) {
			onStatusChange(hasCameraTrack)
		}
	}, [hasCameraTrack, onStatusChange])

	if (!trackRef) {
		return (
			<div className='flex items-center justify-center w-full h-full min-h-[240px] bg-slate-900 rounded-lg text-slate-400 text-sm'>
				Ожидание трансляции с камеры…
			</div>
		)
	}

	return (
		<div className='w-full h-full bg-black'>
			<VideoTrack
				trackRef={trackRef}
				className='h-full w-full object-contain'
			/>
		</div>
	)
}
