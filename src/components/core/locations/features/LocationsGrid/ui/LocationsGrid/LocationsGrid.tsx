import type { FC } from 'react'
import { useState } from 'react'
import {
	Box,
	Button,
	Flex,
	SimpleGrid,
	Spinner,
	Stack,
	Text,
	Heading,
	IconButton,
	Menu,
	Portal,
} from '@chakra-ui/react'
import { Building, MoreVertical, Plus } from 'lucide-react'
import { useGetLocations } from '@/api/hooks/camera/camera.hooks'
import { LinkCameraModal } from '../../../LinkCamera'
import { AddCameraModal } from '../../../AddCamera'

export const LocationsGrid: FC = () => {
	const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null)
	const [selectedCameraName, setSelectedCameraName] = useState<
		string | undefined
	>()
	const [selectedLocationName, setSelectedLocationName] = useState<
		string | undefined
	>()
	const [selectedLocationIdForAdd, setSelectedLocationIdForAdd] = useState<
		string | null
	>(null)
	const [linkToken, setLinkToken] = useState<string | undefined>()

	const { data: locations, isLoading, isError } = useGetLocations()

	if (isLoading) {
		return (
			<Flex justify='center' align='center' py={10}>
				<Spinner />
			</Flex>
		)
	}

	if (isError || !locations) {
		return (
			<Box
				rounded='2xl'
				bg='white'
				borderWidth='1px'
				borderColor='gray.200'
				px={6}
				py={8}
				textAlign='center'
			>
				<Text color='red.500'>Не удалось загрузить локации</Text>
			</Box>
		)
	}

	if (locations.length === 0) {
		return (
			<Box
				rounded='2xl'
				bg='white'
				borderWidth='1px'
				borderColor='gray.200'
				px={6}
				py={8}
				textAlign='center'
			>
				<Text color='gray.600'>У вас пока нет локаций</Text>
			</Box>
		)
	}

	return (
		<>
			<SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
				{locations.map(location => (
					<Box
						key={location.id}
						rounded='2xl'
						bg='white'
						borderWidth='1px'
						borderColor='gray.200'
						boxShadow='lg'
						overflow='hidden'
					>
						<Box p={6} height='100%' display='flex' flexDirection='column'>
							<Flex align='flex-start' justify='space-between' mb={4}>
								<Flex align='center' gap={3}>
									<Box
										w={12}
										h={12}
										rounded='xl'
										bgGradient='to-br'
										gradientFrom='brand.blue.500'
										gradientTo='brand.blue.700'
										display='flex'
										alignItems='center'
										justifyContent='center'
										boxShadow='lg'
									>
										<Building className='w-6 h-6 text-white' />
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
							</Flex>

							<Stack mt={'auto'} gap={2}>
								{location.cameras &&
									location.cameras.length > 0 &&
									location.cameras.map(camera => (
										<Flex
											key={camera.id}
											p={3}
											rounded='xl'
											bg='gray.50'
											align='center'
											justify='space-between'
											gap={3}
										>
											<Text fontSize='sm' color='gray.900'>
												{camera.name}
											</Text>
											<Menu.Root positioning={{ placement: 'bottom-end' }}>
												<Menu.Trigger asChild>
													<IconButton
														size='xs'
														variant='ghost'
														aria-label='Действия с камерой'
													>
														<MoreVertical className='w-4 h-4 text-gray-500' />
													</IconButton>
												</Menu.Trigger>
												<Portal>
													<Menu.Positioner>
														<Menu.Content>
															<Menu.Item
																value='delete'
																onClick={() => {
																	// TODO: удалить камеру из локации
																	console.log('Удалить камеру', camera.id)
																}}
															>
																Удалить
															</Menu.Item>
															<Menu.Item
																value='code'
																onClick={() => {
																	setSelectedCameraId(camera.id)
																	setSelectedCameraName(camera.name)
																	setSelectedLocationName(location.name)
																}}
															>
																Получить код
															</Menu.Item>
														</Menu.Content>
													</Menu.Positioner>
												</Portal>
											</Menu.Root>
										</Flex>
									))}

								<Button
									w='full'
									variant='outline'
									borderStyle='dashed'
									borderWidth='2px'
									borderColor='gray.200'
									color='gray.500'
									display='flex'
									alignItems='center'
									justifyContent='center'
									gap={2}
									_hover={{
										borderColor: 'blue.400',
										bg: 'blue.50',
										color: 'blue.600',
									}}
									onClick={() => {
										setSelectedLocationIdForAdd(location.id)
										setSelectedLocationName(location.name)
									}}
								>
									<Plus className='w-4 h-4' />
									<Text as='span' fontSize='sm'>
										Добавить камеру
									</Text>
								</Button>
							</Stack>
						</Box>
					</Box>
				))}
			</SimpleGrid>

			<AddCameraModal
				isOpen={Boolean(selectedLocationIdForAdd)}
				locationId={selectedLocationIdForAdd}
				locationName={selectedLocationName}
				onSuccess={({ token, cameraName }) => {
					setLinkToken(token)
					setSelectedCameraName(cameraName)
				}}
				onClose={() => {
					setSelectedLocationIdForAdd(null)
				}}
			/>

			<LinkCameraModal
				isOpen={Boolean(linkToken) || Boolean(selectedCameraId)}
				cameraId={selectedCameraId}
				token={linkToken}
				cameraName={selectedCameraName}
				locationName={selectedLocationName}
				onClose={() => {
					setSelectedCameraId(null)
					setSelectedCameraName(undefined)
					setSelectedLocationName(undefined)
					setLinkToken(undefined)
				}}
			/>
		</>
	)
}
