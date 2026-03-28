import { ROUTES } from '@/app/constants/routes'
import { useLogout } from '@/api/hooks'
import { authStore } from '@auth/entities/model/store'
import { Bell, Settings, User } from 'lucide-react'
import { useEffect, useRef, useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../Logo/Logo'

export const Header: FC = () => {
	const navigate = useNavigate()
	const { setUser, setLoading } = authStore()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement | null>(null)
	const alertCount = 3

	const { mutate: logout, isPending: isLogoutPending } = useLogout({
		onSuccess: () => {
			setUser(null)
			setLoading(false)
			setIsMenuOpen(false)
			navigate(ROUTES.AUTH, { replace: true })
		},
	})

	useEffect(() => {
		if (!isMenuOpen) {
			return
		}

		const handleClickOutside = (event: MouseEvent) => {
			if (!menuRef.current) {
				return
			}

			if (!menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isMenuOpen])

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
							onClick={() => navigate(ROUTES.ACCOUNT_SETTINGS)}
						>
							<Settings className='h-5 w-5 text-slate-600' />
						</button>

						<div className='relative' ref={menuRef}>
							<button
								type='button'
								className='rounded-xl bg-slate-100/80 p-2.5 transition-all hover:bg-slate-200/80'
								onClick={() => setIsMenuOpen(prev => !prev)}
								aria-haspopup='menu'
								aria-expanded={isMenuOpen}
							>
								<User className='h-5 w-5 text-slate-600' />
							</button>

							{isMenuOpen && (
								<div className='absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg p-1 z-50'>
									<button
										type='button'
										className='flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'
										onClick={() => {
											setIsMenuOpen(false)
											navigate(ROUTES.ACCOUNT_SETTINGS)
										}}
									>
										Настройки
									</button>
									<button
										type='button'
										className='flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60'
										onClick={() => logout()}
										disabled={isLogoutPending}
									>
										{isLogoutPending ? 'Выход...' : 'Выйти'}
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
