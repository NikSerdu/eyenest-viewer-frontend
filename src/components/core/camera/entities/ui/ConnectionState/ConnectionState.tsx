import type { FC } from 'react'
import { useConnectionState } from '@livekit/components-react'

const translateConnectionState = (state: string) => {
	switch (state) {
		case 'connecting':
			return 'Подключение…'
		case 'connected':
			return 'Подключено'
		case 'reconnecting':
			return 'Переподключение…'
		case 'disconnected':
			return 'Отключено'
		default:
			return 'Неизвестно'
	}
}

const stateStyles: Record<string, string> = {
	connecting: 'bg-yellow-500/90 text-white',
	connected: 'bg-green-600/90 text-white',
	reconnecting: 'bg-orange-500/90 text-white',
	disconnected: 'bg-red-600/90 text-white',
}

export const ConnectionStateBadge: FC = () => {
	const state = useConnectionState()
	const label = translateConnectionState(state)
	const style = stateStyles[state] ?? 'bg-gray-600/90 text-white'

	return (
		<div
			className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium shadow-md backdrop-blur ${style}`}
		>
			<span className='relative flex h-2 w-2'>
				<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75' />
				<span className='relative inline-flex h-2 w-2 rounded-full bg-white' />
			</span>
			{label}
		</div>
	)
}
