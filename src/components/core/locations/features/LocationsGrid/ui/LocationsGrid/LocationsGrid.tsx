import type { FC } from 'react'
import { useState } from 'react'
import {
	Box,
	Button,
	Dialog,
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
import { useQueryClient } from '@tanstack/react-query'
import { Building, MoreVertical, Plus } from 'lucide-react'

import {
	useDeleteCamera,
	useDeleteLocation,
	useGetLocations,
} from '@/api/hooks/camera/camera.hooks'
import { LinkCameraModal } from '../../../LinkCamera'
import { AddCameraModal } from '../../../AddCamera'

type CameraToDelete = { id: string; name: string }
type LocationToDelete = { id: string; name: string }

export const LocationsGrid: FC = () => {
	const queryClient = useQueryClient()
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
	const [cameraToDelete, setCameraToDelete] = useState<CameraToDelete | null>(
		null,
	)
	const [locationToDelete, setLocationToDelete] = useState<LocationToDelete | null>(
		null,
	)

	const { data: locations, isLoading, isError } = useGetLocations()

	const { mutate: removeCamera, isPending: isDeletingCamera } = useDeleteCamera({
		onSuccess: (_, variables) => {
			void queryClient.invalidateQueries({ queryKey: ['get locations'] })
			void queryClient.invalidateQueries({
				queryKey: [`get camera by id ${variables.cameraId}`],
			})
			void queryClient.invalidateQueries({
				queryKey: ['get all recordings', variables.cameraId],
			})
			void queryClient.invalidateQueries({
				queryKey: ['get events by camera id', variables.cameraId],
			})
			setCameraToDelete(null)
		},
	})

	const { mutate: removeLocation, isPending: isDeletingLocation } = useDeleteLocation({
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['get locations'] })
			setLocationToDelete(null)
		},
	})

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

	const confirmDeleteCamera = () => {
		if (!cameraToDelete) {
			return
		}
		removeCamera({ cameraId: cameraToDelete.id })
	}

	const confirmDeleteLocation = () => {
		if (!locationToDelete) {
			return
		}
		removeLocation({ locationId: locationToDelete.id })
	}

	return (
		<>
			<SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={{ base: 3, md: 4 }}>
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
						<Box p={{ base: 4, md: 6 }} height='100%' display='flex' flexDirection='column'>
							<Flex align='flex-start' justify='space-between' mb={4} gap={2}>
								<Flex align='center' gap={3} minW={0}>
									<Box
										w={{ base: 10, md: 12 }}
										h={{ base: 10, md: 12 }}
										rounded='xl'
										bgGradient='to-br'
										gradientFrom='brand.blue.500'
										gradientTo='brand.blue.700'
										display='flex'
										alignItems='center'
										justifyContent='center'
										boxShadow='lg'
										flexShrink={0}
									>
										<Building className='w-5 h-5 md:w-6 md:h-6 text-white' />
									</Box>
									<Box minW={0}>
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

								<Menu.Root positioning={{ placement: 'bottom-end' }}>
									<Menu.Trigger asChild>
										<IconButton
											size='xs'
											variant='ghost'
											aria-label='Действия с локацией'
											flexShrink={0}
										>
											<MoreVertical className='w-4 h-4 text-gray-500' />
										</IconButton>
									</Menu.Trigger>
									<Portal>
										<Menu.Positioner>
											<Menu.Content>
												<Menu.Item
													value='delete-location'
													color='fg.error'
													onClick={() =>
														setLocationToDelete({
															id: location.id,
															name: location.name,
														})
													}
												>
													Удалить локацию
												</Menu.Item>
											</Menu.Content>
										</Menu.Positioner>
									</Portal>
								</Menu.Root>
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
																color='fg.error'
																onClick={() =>
																	setCameraToDelete({
																		id: camera.id,
																		name: camera.name,
																	})
																}
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
									size={{ base: 'sm', md: 'md' }}
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

			<Dialog.Root
				role='alertdialog'
				open={Boolean(cameraToDelete)}
				onOpenChange={({ open }) => {
					if (!open) {
						setCameraToDelete(null)
					}
				}}
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content mx={3}>
							<Dialog.Header>
								<Dialog.Title>Удалить камеру?</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Text fontSize='sm' color='gray.600'>
									Камера «{cameraToDelete?.name ?? ''}» и связанные с ней данные будут
									удалены безвозвратно.
								</Text>
							</Dialog.Body>
							<Dialog.Footer flexDirection={{ base: 'column-reverse', sm: 'row' }} gap={2}>
								<Button variant='outline' onClick={() => setCameraToDelete(null)}>
									Отмена
								</Button>
								<Button
									colorPalette='red'
									loading={isDeletingCamera}
									onClick={confirmDeleteCamera}
								>
									Удалить
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>

			<Dialog.Root
				role='alertdialog'
				open={Boolean(locationToDelete)}
				onOpenChange={({ open }) => {
					if (!open) {
						setLocationToDelete(null)
					}
				}}
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content mx={3}>
							<Dialog.Header>
								<Dialog.Title>Удалить локацию?</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Text fontSize='sm' color='gray.600'>
									Локация «{locationToDelete?.name ?? ''}» и все камеры в ней будут удалены
									безвозвратно.
								</Text>
							</Dialog.Body>
							<Dialog.Footer flexDirection={{ base: 'column-reverse', sm: 'row' }} gap={2}>
								<Button variant='outline' onClick={() => setLocationToDelete(null)}>
									Отмена
								</Button>
								<Button
									colorPalette='red'
									loading={isDeletingLocation}
									onClick={confirmDeleteLocation}
								>
									Удалить
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	)
}
