import { useMemo, type FC } from 'react'
import { User } from 'lucide-react'

import { useGetUser, useGetUserNotificationSettings } from '@/api/hooks'

export const AccountProfileCard: FC = () => {
	const { data: user } = useGetUser()
	const { data: notificationSettings } = useGetUserNotificationSettings()

	const accountCards = useMemo(
		() => [
			{ title: 'ID пользователя', value: user?.id ?? '-' },
			{ title: 'Email', value: user?.email ?? '-' },
		
		],
		[user, notificationSettings],
	)

	return (
		<div className='rounded-2xl bg-white/60 backdrop-blur-xl border border-slate-200/50 shadow-lg p-4 md:p-6 space-y-4 md:space-y-6'>
			<div className='text-center'>
				<div className='mx-auto flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'>
					<User className='h-10 w-10 md:h-12 md:w-12' />
				</div>
				<h3 className='text-slate-900 mt-4 text-lg font-semibold'>Профиль</h3>
				<p className='text-sm text-slate-500 break-all'>{user?.email ?? 'Нет данных'}</p>
			</div>

			<div className='space-y-3'>
				{accountCards.map(card => (
					<div key={card.title} className='p-4 rounded-xl bg-slate-50'>
						<p className='text-xs text-slate-500 mb-1'>{card.title}</p>
						<p className='text-sm text-slate-900 break-all'>{card.value}</p>
					</div>
				))}
			</div>
		</div>
	)
}
