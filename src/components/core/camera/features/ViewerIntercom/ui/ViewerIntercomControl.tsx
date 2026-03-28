import { TrackToggle } from '@livekit/components-react'
import { Track } from 'livekit-client'
import type { FC } from 'react'

/**
 * Публикация микрофона зрителя в комнату камеры (интерком).
 * Требует JWT с canPublishSources: microphone (camera-service).
 */
export const ViewerIntercomControl: FC = () => {
	return (
		<div className='pointer-events-none absolute top-3 right-3 z-10 max-w-[min(100%-1.5rem,16rem)]'>
			<div className='pointer-events-auto rounded-xl bg-slate-950/85 px-3 py-2 shadow-lg ring-1 ring-white/10 backdrop-blur-sm'>
				<p className='mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400'>
					Говорить на камеру
				</p>
				<TrackToggle
					source={Track.Source.Microphone}
					initialState={false}
					showIcon
					className='flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800/90 px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-700/90 data-[lk-enabled=true]:bg-emerald-900/80 data-[lk-enabled=true]:text-emerald-100'
				>
					<span className='tabular-nums'>Микрофон</span>
				</TrackToggle>
				<p className='mt-2 text-[10px] leading-snug text-slate-500'>
					Звук пойдёт на устройство с камерой, если там включён приём аудио.
				</p>
			</div>
		</div>
	)
}
