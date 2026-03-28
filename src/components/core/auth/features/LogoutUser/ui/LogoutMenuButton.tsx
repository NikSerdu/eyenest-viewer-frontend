import type { FC } from 'react'

import { useLogoutUser } from '../model/hooks/useLogoutUser'

type LogoutMenuButtonProps = {
	onCloseMenu?: () => void
	className?: string
}

export const LogoutMenuButton: FC<LogoutMenuButtonProps> = ({
	onCloseMenu,
	className,
}) => {
	const { mutate, isPending } = useLogoutUser()

	return (
		<button
			type='button'
			className={className}
			disabled={isPending}
			onClick={() => {
				onCloseMenu?.()
				mutate()
			}}
		>
			{isPending ? 'Выход...' : 'Выйти'}
		</button>
	)
}
