import { TrackToggle } from '@livekit/components-react'
import { Track } from 'livekit-client'
import type { FC } from 'react'

/**
 * Публикация микрофона зрителя в комнату камеры (интерком).
 * Требует JWT с canPublishSources: microphone (camera-service).
 */
export const ViewerIntercomControl: FC = () => {
	return (
		<div className='pointer-events-none absolute bottom-3 right-16 z-10'>
			<TrackToggle
				source={Track.Source.Microphone}
				initialState={false}
				showIcon
				className='pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/85 text-slate-100 shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-slate-800/90 data-[lk-enabled=true]:bg-emerald-900/80 data-[lk-enabled=true]:text-emerald-100'
			/>
		</div>
	)
}
