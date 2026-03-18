import { Box, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import { CalendarRange, CircleDashed } from 'lucide-react'
import { type FC, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGetAllRecordings } from '@/api/hooks'
import {
	RecordingTimelineCard,
	recordingPlaybackStore,
	type CameraRecording,
} from '../../../entities'

interface CameraRecordingsTimelineProps {
	cameraId: string
}

export const CameraRecordingsTimeline: FC<CameraRecordingsTimelineProps> = ({
	cameraId,
}) => {
	const navigate = useNavigate()
	const selectedRecording = recordingPlaybackStore(state => state.selectedRecording)
	const setSelectedRecording = recordingPlaybackStore(
		state => state.setSelectedRecording,
	)
	const { data, isLoading, isError } = useGetAllRecordings(cameraId)

	const recordings = useMemo(
		() =>
			[...(data ?? [])].sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			),
		[data],
	)

	const handleOpenRecording = (recording: CameraRecording) => {
		setSelectedRecording(recording)
		navigate(`/${cameraId}/${recording.id}`)
	}

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
							<CalendarRange size={14} />
						</Box>

						<Box>
							<Heading size='xs'>Записи</Heading>
						</Box>
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
							{recordings.length} записей
						</Text>
					</Box>
				</Flex>

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
						<Text fontSize='sm' color='red.600'>Не удалось загрузить записи.</Text>
					</Flex>
				)}

				{!isLoading && !isError && recordings.length === 0 && (
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
							Записей пока нет.
						</Text>
					</Flex>
				)}

				{recordings.length > 0 && (
					<Box
						borderWidth='1px'
						borderColor='gray.100'
						borderRadius='lg'
						overflow='hidden'
						bg='whiteAlpha.500'
					>
						<Stack gap={0}>
						{recordings.map((recording, index) => {
							const isSelected = selectedRecording?.id === recording.id

							return (
								<Box
									key={recording.id}
									borderTopWidth={index === 0 ? '0' : '1px'}
									borderColor='gray.100'
									px={1}
									py={0.5}
								>
									<RecordingTimelineCard
										recording={recording}
										isSelected={isSelected}
										onClick={() => handleOpenRecording(recording)}
									/>
								</Box>
							)
						})}
						</Stack>
					</Box>
				)}
			</Stack>
		</Box>
	)
}
