import type { FC } from 'react'
interface IProps {
	message: string
}
export const ConnectionErrorBanner: FC<IProps> = ({ message }) => {
	return (
		<div className='absolute bottom-2 left-2 right-2 py-2 px-3 rounded bg-red-900/80 text-red-200 text-sm text-center'>
			{message}
		</div>
	)
}
