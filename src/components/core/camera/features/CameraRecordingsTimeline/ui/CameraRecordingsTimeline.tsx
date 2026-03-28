import {
	Box,
	Button,
	Dialog,
	Flex,
	Heading,
	Portal,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { CalendarRange, CircleDashed } from 'lucide-react'
import { type FC, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDeleteRecording, useGetAllRecordings } from '@/api/hooks'
import {
	EYENEST_STITCHED_RECORDING_ID,
	RecordingTimelineCard,
	recordingPlaybackStore,
	type CameraRecording,
} from '../../../entities'

export type CameraRecordingsTimelineEmbed = {
	selectedId: string | null
	onSelectRecording: (recording: CameraRecording) => void
}

interface CameraRecordingsTimelineProps {
	cameraId: string
	/** Встроенный плеер на странице записей: без перехода на отдельный URL */
	embed?: CameraRecordingsTimelineEmbed
}

export const CameraRecordingsTimeline: FC<CameraRecordingsTimelineProps> = ({
	cameraId,
	embed,
}) => {
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const [recordingToDelete, setRecordingToDelete] =
		useState<CameraRecording | null>(null)
	const selectedRecording = recordingPlaybackStore(
		state => state.selectedRecording,
	)
	const setSelectedRecording = recordingPlaybackStore(
		state => state.setSelectedRecording,
	)
	const clearSelectedRecording = recordingPlaybackStore(
		state => state.clearSelectedRecording,
	)

	const isEmbed = Boolean(embed)
	const { data, isLoading, isError } = useGetAllRecordings(cameraId)

	const { mutate: removeRecording, isPending: isDeletingRecording } =
		useDeleteRecording({
			onSuccess: (_, variables) => {
				void queryClient.invalidateQueries({
					queryKey: ['get all recordings', cameraId],
				})
				void queryClient.invalidateQueries({
					queryKey: ['get events by camera id', cameraId],
				})
				void queryClient.invalidateQueries({
					queryKey: ['stitched chapters', cameraId],
				})
				if (!isEmbed && selectedRecording?.id === variables.recordingId) {
					clearSelectedRecording()
				}
				setRecordingToDelete(null)
			},
		})

	/** Системная склейка не показывается в списке — только реальные сегменты */
	const listRecordings = useMemo(() => {
		const raw = [...(data ?? [])]
		return raw
			.filter(r => r.id !== EYENEST_STITCHED_RECORDING_ID)
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)
	}, [data])

	const handleOpenRecording = (recording: CameraRecording) => {
		if (embed) {
			embed.onSelectRecording(recording)
			return
		}
		setSelectedRecording(recording)
		navigate(`/${cameraId}/${recording.id}`)
	}

	const confirmDeleteRecording = () => {
		if (!recordingToDelete) {
			return
		}
		removeRecording({ recordingId: recordingToDelete.id })
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
							{listRecordings.length} записей
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
						<Text fontSize='sm' color='red.600'>
							Не удалось загрузить записи.
						</Text>
					</Flex>
				)}

				{!isLoading && !isError && listRecordings.length === 0 && (
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

				{listRecordings.length > 0 && (
					<Box
						borderWidth='1px'
						borderColor='gray.100'
						borderRadius='lg'
						overflow='hidden'
						bg='whiteAlpha.500'
					>
						<Stack gap={0}>
							{listRecordings.map((recording, index) => {
								const isSelected = embed
									? embed.selectedId === recording.id
									: selectedRecording?.id === recording.id

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
											onDeletePress={() => setRecordingToDelete(recording)}
										/>
									</Box>
								)
							})}
						</Stack>
					</Box>
				)}
			</Stack>

			<Dialog.Root
				role='alertdialog'
				open={Boolean(recordingToDelete)}
				onOpenChange={({ open }) => {
					if (!open) {
						setRecordingToDelete(null)
					}
				}}
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Удалить запись?</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Text fontSize='sm' color='gray.600'>
									Запись будет удалена безвозвратно. Это действие нельзя
									отменить.
								</Text>
							</Dialog.Body>
							<Dialog.Footer>
								<Button
									variant='outline'
									onClick={() => setRecordingToDelete(null)}
								>
									Отмена
								</Button>
								<Button
									colorPalette='red'
									loading={isDeletingRecording}
									onClick={confirmDeleteRecording}
								>
									Удалить
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</Box>
	)
}
