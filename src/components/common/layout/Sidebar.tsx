import { ROUTES } from '@/app/constants/routes'
import { Button } from '@chakra-ui/react'
import { Grid3x3, MapPin } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { FC } from 'react'

const menuItems = [
	{
		href: ROUTES.CAMERAS.ROOT,
		title: 'Камеры',
		icon: <Grid3x3 className='h-5 w-5' />,
	},
	{
		href: ROUTES.LOCATIONS,
		title: 'Локации',
		icon: <MapPin className='h-5 w-5' />,
	},
]

export const Sidebar: FC = () => {
	const location = useLocation()
	const navigate = useNavigate()

	return (
		<>
			<nav className='lg:hidden border-b border-slate-200/70 bg-white/80 backdrop-blur-xl'>
				<div className='flex gap-2 overflow-x-auto px-3 py-2'>
					{menuItems.map(item => {
						const isActive = location.pathname === item.href

						return (
							<Button
								key={`mobile-${item.href}`}
								onClick={() => navigate(item.href)}
								variant={isActive ? 'primary' : 'ghost'}
								colorScheme={isActive ? 'blue' : undefined}
								size='sm'
								whiteSpace='nowrap'
								flexShrink={0}
							>
								{item.icon} {item.title}
							</Button>
						)
					})}
				</div>
			</nav>

			<aside className='hidden lg:block sticky top-0 self-start h-screen w-64 shrink-0 overflow-y-auto border-r border-slate-200/50 bg-white/60 backdrop-blur-xl'>
				<div className='flex h-full flex-col p-4'>
					<div className='space-y-2'>
						{menuItems.map(item => {
							const isActive = location.pathname === item.href

							return (
								<Button
									key={item.href}
									onClick={() => navigate(item.href)}
									variant={isActive ? 'primary' : 'ghost'}
									justifyContent='flex-start'
									w='100%'
									colorScheme={isActive ? 'blue' : undefined}
								>
									{item.icon} {item.title}
								</Button>
							)
						})}
					</div>
				</div>
			</aside>
		</>
	)
}
