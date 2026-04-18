import type { FC } from 'react'
import { Box, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { CameraCard } from '../CameraCard/CameraCard'
import { useGetLocations } from '@/api/hooks/camera/camera.hooks'
import { Building } from 'lucide-react'
export const CameraGrid: FC = ({}) => {
	const { data: locations } = useGetLocations()
	if (!locations) {
		return 'Загрузка...'
	}
	return (
		<Stack gap={{ base: 4, md: 6 }}>
			{locations.map(location => {
				return (
					<Stack key={location.id} gap={{ base: 3, md: 4 }}>
						<Flex align='center' gap={3} wrap='wrap'>
							<Box
								w={{ base: 9, md: 10 }}
								h={{ base: 9, md: 10 }}
								rounded='lg'
								bgGradient='to-br'
								gradientFrom={'brand.blue.500'}
								gradientTo={'brand.blue.700'}
								display='flex'
								alignItems='center'
								justifyContent='center'
								boxShadow='lg'
							>
								<Building className='w-5 h-5 text-white' />
							</Box>
							<Box>
								<Heading size={{ base: 'xs', md: 'sm' }} color='gray.900'>
									{location.name}
								</Heading>
								{location.cameras && (
									<Text fontSize={{ base: '11px', md: 'xs' }} color='gray.500'>
										{location.cameras.length}{' '}
										{location.cameras.length === 1 ? 'камера' : 'камеры'}
									</Text>
								)}
							</Box>
						</Flex>

						{location.cameras && (
							<SimpleGrid columns={{ base: 1, md: 2, '2xl': 3 }} gap={{ base: 3, md: 4 }}>
								{location.cameras.map(camera => (
									<CameraCard
										key={camera.id}
										camera={camera}
										isExpanded={false}
									/>
								))}
							</SimpleGrid>
						)}
					</Stack>
				)
			})}
		</Stack>
	)
}
