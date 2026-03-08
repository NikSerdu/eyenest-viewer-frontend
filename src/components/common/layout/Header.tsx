import { Bell, Settings, User } from 'lucide-react'
import { useState, type FC } from 'react'
import { Logo } from '../Logo/Logo'

export const Header: FC = () => {
	const [alertCount, setAlertCount] = useState<number>(3)
	return (
		<header className='sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm'>
			<div className='px-6 py-4'>
				<div className='flex items-center justify-between gap-6'>
					<div className='flex items-center gap-6'>
						<div className='flex items-center gap-3'>
							<Logo />
							<div>
								<h1 className='text-xl font-semibold tracking-tight text-slate-900'>
									EyeNest
								</h1>
								<p className='text-xs text-slate-500'>
									Система видеонаблюдения
								</p>
							</div>
						</div>
					</div>

					<div className='flex items-center gap-3'>
						<button
							type='button'
							className='group relative rounded-xl bg-slate-100/80 p-2.5 transition-all hover:bg-slate-200/80'
						>
							<Bell className='h-5 w-5 text-slate-600 group-hover:text-slate-900' />
							{alertCount > 0 && (
								<span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg'>
									{alertCount}
								</span>
							)}
						</button>

						<button
							type='button'
							className='rounded-xl bg-slate-100/80 p-2.5 transition-all hover:bg-slate-200/80'
						>
							<Settings className='h-5 w-5 text-slate-600' />
						</button>

						<button
							type='button'
							className='rounded-xl bg-slate-100/80 p-2.5 transition-all hover:bg-slate-200/80'
						>
							<User className='h-5 w-5 text-slate-600' />
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}
