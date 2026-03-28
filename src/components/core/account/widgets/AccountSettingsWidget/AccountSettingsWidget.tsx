import type { FC } from 'react'

import { AccountNotificationSettings, AccountProfileCard } from '../../features'

export const AccountSettingsWidget: FC = () => {
	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-slate-900 mb-2 text-2xl font-semibold tracking-tight'>
					Настройки аккаунта
				</h2>
				<p className='text-slate-600'>
					Информация о пользователе и параметры уведомлений
				</p>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-1'>
					<AccountProfileCard />
				</div>
				<div className='lg:col-span-2'>
					<AccountNotificationSettings />
				</div>
			</div>
		</div>
	)
}
