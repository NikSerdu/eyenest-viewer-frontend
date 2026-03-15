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
	console.log(locations)
	return (
		<Stack gap={6}>
			{locations.map(location => {
				return (
					<Stack key={location.id} gap={4}>
						<Flex align='center' gap={3}>
							<Box
								w={10}
								h={10}
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
								<Heading size='sm' color='gray.900'>
									{location.name}
								</Heading>
								{location.cameras && (
									<Text fontSize='xs' color='gray.500'>
										{location.cameras.length}{' '}
										{location.cameras.length === 1 ? 'камера' : 'камеры'}
									</Text>
								)}
							</Box>
						</Flex>

						{location.cameras && (
							<SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
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
