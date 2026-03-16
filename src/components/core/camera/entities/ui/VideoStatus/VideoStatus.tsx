import type { FC } from 'react'
interface IProps {
	type: 'loading' | 'error'
	message: string
}
export const VideoStatus: FC<IProps> = ({ type, message }) => {
	return (
		<div
			className={`flex items-center justify-center w-full min-h-[240px] rounded-lg text-sm ${type === 'loading' ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-900/50 text-red-400'}`}
		>
			{message}
		</div>
	)
}
