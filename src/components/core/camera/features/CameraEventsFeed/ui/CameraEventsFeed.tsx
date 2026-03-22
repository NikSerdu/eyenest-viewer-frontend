import {
	Box,
	Button,
	Flex,
	Heading,
	Input,
	NativeSelect,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react'
import { Bell, CircleDashed } from 'lucide-react'
import type { FC } from 'react'

import {
	EventListItem,
	getEventTypeLabelRu,
	KNOWN_CAMERA_EVENT_TYPES,
} from '../../../entities/event'
import { useCameraEventsFeed } from '../model/hooks'

interface CameraEventsFeedProps {
	cameraId: string
}

export const CameraEventsFeed: FC<CameraEventsFeedProps> = ({ cameraId }) => {
	const {
		sortedEvents,
		filteredEvents,
		eventType,
		setEventType,
		dateFrom,
		setDateFrom,
		dateTo,
		setDateTo,
		resetFilters,
		isLoading,
		isError,
	} = useCameraEventsFeed(cameraId)

	const hasActiveFilters =
		eventType !== 'all' || Boolean(dateFrom) || Boolean(dateTo)

	return (
		<Box
			borderRadius='xl'
			bg='whiteAlpha.700'
			backdropFilter='blur(12px)'
			borderWidth='1px'
			borderColor='gray.200'
			boxShadow='md'
			p={{ base: 2.5, md: 3 }}
		>
			<Stack gap={3}>
				<Flex justify='space-between' align='center' gap={3} wrap='wrap'>
					<Flex align='center' gap={2.5}>
						<Box
							boxSize={8}
							borderRadius='lg'
							bgGradient='to-br'
							gradientFrom='brand.blue.500'
							gradientTo='brand.blue.700'
							display='flex'
							alignItems='center'
							justifyContent='center'
							color='white'
							boxShadow='sm'
						>
							<Bell size={14} />
						</Box>
						<Heading size='xs'>События</Heading>
					</Flex>

					<Box
						px={2.5}
						py={1}
						borderRadius='full'
						bg='gray.50'
						borderWidth='1px'
						borderColor='gray.200'
					>
						<Text fontSize='xs' fontWeight='semibold' color='gray.700'>
							{filteredEvents.length}
							{filteredEvents.length !== sortedEvents.length
								? ` из ${sortedEvents.length}`
								: ''}{' '}
							событий
						</Text>
					</Box>
				</Flex>

				<Stack gap={2}>
					<Flex gap={3} wrap='wrap' align='flex-end'>
						<Box minW={{ base: '100%', sm: '200px' }} flex={1}>
							<Text fontSize='xs' fontWeight='medium' color='gray.600' mb={1}>
								Тип события
							</Text>
							<NativeSelect.Root size='sm'>
								<NativeSelect.Field
									value={eventType}
									onChange={e => setEventType(e.currentTarget.value)}
								>
									<option value='all'>Все типы</option>
									{KNOWN_CAMERA_EVENT_TYPES.map(type => (
										<option key={type} value={type}>
											{getEventTypeLabelRu(type)}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</Box>

						<Box minW={{ base: '100%', sm: '160px' }} flex={1}>
							<Text fontSize='xs' fontWeight='medium' color='gray.600' mb={1}>
								Дата с
							</Text>
							<Input
								size='sm'
								type='date'
								value={dateFrom}
								onChange={e => setDateFrom(e.currentTarget.value)}
							/>
						</Box>

						<Box minW={{ base: '100%', sm: '160px' }} flex={1}>
							<Text fontSize='xs' fontWeight='medium' color='gray.600' mb={1}>
								Дата по
							</Text>
							<Input
								size='sm'
								type='date'
								value={dateTo}
								onChange={e => setDateTo(e.currentTarget.value)}
							/>
						</Box>

						{hasActiveFilters && (
							<Button size='sm' variant='ghost' onClick={resetFilters}>
								Сбросить
							</Button>
						)}
					</Flex>
				</Stack>

				{isLoading && (
					<Flex
						minH='96px'
						borderRadius='lg'
						borderWidth='1px'
						borderStyle='dashed'
						borderColor='gray.200'
						bg='gray.50'
						align='center'
						justify='center'
						gap={3}
					>
						<Spinner color='brand.blue.500' />
						<Text fontSize='sm' color='gray.600'>
							Загрузка...
						</Text>
					</Flex>
				)}

				{isError && (
					<Flex
						minH='96px'
						borderRadius='lg'
						borderWidth='1px'
						borderStyle='dashed'
						borderColor='red.200'
						bg='red.50'
						align='center'
						justify='center'
						p={4}
					>
						<Text fontSize='sm' color='red.600'>
							Не удалось загрузить события.
						</Text>
					</Flex>
				)}

				{!isLoading && !isError && sortedEvents.length === 0 && (
					<Flex
						minH='96px'
						direction='column'
						gap={2}
						borderRadius='lg'
						borderWidth='1px'
						borderStyle='dashed'
						borderColor='gray.200'
						bg='gray.50'
						align='center'
						justify='center'
						p={4}
						textAlign='center'
					>
						<CircleDashed size={22} color='var(--chakra-colors-gray-400)' />
						<Text fontSize='sm' fontWeight='semibold' color='gray.700'>
							Событий пока нет.
						</Text>
					</Flex>
				)}

				{!isLoading && !isError && sortedEvents.length > 0 && filteredEvents.length === 0 && (
					<Flex
						minH='72px'
						borderRadius='lg'
						borderWidth='1px'
						borderStyle='dashed'
						borderColor='gray.200'
						bg='gray.50'
						align='center'
						justify='center'
						p={4}
					>
						<Text fontSize='sm' color='gray.600'>
							Нет событий по выбранным фильтрам.
						</Text>
					</Flex>
				)}

				{filteredEvents.length > 0 && (
					<Box
						borderWidth='1px'
						borderColor='gray.100'
						borderRadius='lg'
						overflow='hidden'
						bg='whiteAlpha.500'
					>
						<Stack gap={0}>
							{filteredEvents.map((event, index) => (
								<Box
									key={event.id}
									borderTopWidth={index === 0 ? '0' : '1px'}
									borderColor='gray.100'
									px={1}
								>
									<EventListItem event={event} />
								</Box>
							))}
						</Stack>
					</Box>
				)}
			</Stack>
		</Box>
	)
}
