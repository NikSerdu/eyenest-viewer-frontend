import type { FC } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

interface CameraAudioControlsProps {
	isMuted: boolean
	onToggleMute: () => void
}

export const CameraAudioControls: FC<CameraAudioControlsProps> = ({
	isMuted,
	onToggleMute,
}) => (
	<div className='pointer-events-none absolute bottom-3 right-3 z-10'>
		<button
			type='button'
			onClick={onToggleMute}
			aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
			title={isMuted ? 'Включить звук' : 'Выключить звук'}
			className='pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/85 text-slate-100 shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-slate-800/90'
		>
			{isMuted ? (
				<VolumeX className='h-5 w-5' aria-hidden='true' />
			) : (
				<Volume2 className='h-5 w-5' aria-hidden='true' />
			)}
		</button>
	</div>
)

