import type { FC } from 'react'

interface CameraAudioControlsProps {
	isMuted: boolean
	volume: number
	onToggleMute: () => void
	onVolumeChange: (v: number) => void
}

export const CameraAudioControls: FC<CameraAudioControlsProps> = ({
	isMuted,
	volume,
	onToggleMute,
	onVolumeChange,
}) => (
	<div className='pointer-events-none absolute bottom-0 left-0 right-0 z-10 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent'>
		<div className='pointer-events-auto flex items-center justify-between gap-4 px-4 pb-3 pt-2 text-xs text-slate-100'>
			<button
				type='button'
				onClick={onToggleMute}
				className='inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 font-medium shadow hover:bg-slate-700/90 transition-colors'
			>
				<span
					className='h-2 w-2 rounded-full'
					style={{ backgroundColor: isMuted ? '#f97373' : '#4ade80' }}
				/>
				<span>{isMuted ? 'Звук выключен' : 'Звук включен'}</span>
			</button>

			<div className='flex flex-1 items-center justify-end gap-2'>
				<span className='text-slate-300'>Громкость</span>
				<input
					type='range'
					min={0}
					max={100}
					value={Math.round(volume * 100)}
					onChange={e => onVolumeChange(Number(e.target.value))}
					className='h-1 w-40 cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-400'
				/>
				<span className='w-10 text-right tabular-nums text-slate-200'>
					{Math.round(volume * 100)}%
				</span>
			</div>
		</div>
	</div>
)

