import { ROUTES } from '@/app/constants/routes'
import { Button } from '@chakra-ui/react'
import { Activity, Clock, Grid3x3, MapPin } from 'lucide-react'
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
	{
		href: ROUTES.ACTIVITY,
		title: 'Активность',
		icon: <Activity className='h-5 w-5' />,
	},
	{
		href: ROUTES.RECORDINGS,
		title: 'Записи',
		icon: <Clock className='h-5 w-5' />,
	},
]

export const Sidebar: FC = () => {
	const location = useLocation()
	const navigate = useNavigate()

	return (
		<aside className='fixed left-0 top-[112px] bottom-0 w-64 overflow-y-auto border-r border-slate-200/50 bg-white/60 backdrop-blur-xl'>
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
	)
}
