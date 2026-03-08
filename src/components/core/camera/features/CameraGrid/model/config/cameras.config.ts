import { Building2, Building, MapPin, Warehouse } from 'lucide-react'
import type { Camera } from '@/components/core/camera/entities'

export interface CamerasByLocation {
	locationId: string
	locationName: string
	icon: typeof Building2
	cameras: Camera[]
}

export const camerasByLocation: CamerasByLocation[] = [
	{
		locationId: 'building-a',
		locationName: 'Здание A',
		icon: Building2,
		cameras: [
			{
				id: 'cam-1',
				name: 'Главный вход',
				location: 'Здание A',
				status: 'online',
				recording: true,
				imageUrl:
					'https://images.unsplash.com/photo-1765845216362-0dde345d98aa?auto=format&fit=crop&q=80&w=1080',
				motion: true,
				fps: 30,
			},
			{
				id: 'cam-3',
				name: 'Холл',
				location: 'Здание A',
				status: 'online',
				recording: true,
				imageUrl:
					'https://images.unsplash.com/photo-1697538054827-5afb365a194f?auto=format&fit=crop&q=80&w=1080',
				motion: false,
				fps: 25,
			},
			{
				id: 'cam-4_1',
				name: 'Холл',
				location: 'Здание A',
				status: 'online',
				recording: true,
				imageUrl:
					'https://images.unsplash.com/photo-1697538054827-5afb365a194f?auto=format&fit=crop&q=80&w=1080',
				motion: false,
				fps: 25,
			},
		],
	},
	{
		locationId: 'building-b',
		locationName: 'Здание B',
		icon: Building,
		cameras: [
			{
				id: 'cam-4',
				name: 'Серверная',
				location: 'Здание B',
				status: 'offline',
				recording: false,
				imageUrl:
					'https://images.unsplash.com/photo-1766575125176-016f80b9801d?auto=format&fit=crop&q=80&w=1080',
				motion: false,
				fps: 0,
			},
		],
	},
	{
		locationId: 'exterior',
		locationName: 'Уличная территория',
		icon: MapPin,
		cameras: [
			{
				id: 'cam-2',
				name: 'Парковка',
				location: 'Улица',
				status: 'online',
				recording: true,
				imageUrl:
					'https://images.unsplash.com/photo-1656644177899-a83d045640e9?auto=format&fit=crop&q=80&w=1080',
				motion: false,
				fps: 30,
			},
		],
	},
	{
		locationId: 'warehouse',
		locationName: 'Склад',
		icon: Warehouse,
		cameras: [
			{
				id: 'cam-5',
				name: 'Погрузочная зона',
				location: 'Склад',
				status: 'online',
				recording: true,
				imageUrl:
					'https://images.unsplash.com/photo-1708596718852-5aa3947ccdf5?auto=format&fit=crop&q=80&w=1080',
				motion: true,
				fps: 30,
			},
		],
	},
	{
		locationId: 'floor-3',
		locationName: 'Этаж 3',
		icon: Building2,
		cameras: [
			{
				id: 'cam-6',
				name: 'Конференц-зал',
				location: 'Этаж 3',
				status: 'online',
				recording: false,
				imageUrl:
					'https://images.unsplash.com/photo-1637665662134-db459c1bbb46?auto=format&fit=crop&q=80&w=1080',
				motion: false,
				fps: 25,
			},
		],
	},
]
