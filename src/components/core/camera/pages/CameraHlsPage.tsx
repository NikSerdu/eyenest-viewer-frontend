import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import type { FC } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { RecordingStatus, formatRecordingDateTime } from '../entities'
import {
	CameraHlsPlayer,
	RecordingsDayTimeline,
	useActiveRecording,
	useSingleRecordingTimelinePlayback,
} from '../features'

export const CameraHlsPage: FC = () => {
	const { cameraId, fileId } = useParams<{ cameraId: string; fileId: string }>()
	const navigate = useNavigate()
	const { activeRecording, isLoading, isNotFound, playlistUrl } =
		useActiveRecording(cameraId, fileId)

	const recordingTimeline = useSingleRecordingTimelinePlayback(activeRecording)

	if (!cameraId) {
		return <Navigate to='/' />
	}

	if (isLoading) {
		return (
			<Flex direction='column' gap={6}>
				<Flex justify='space-between' align='center' wrap='wrap' gap={3}>
					<Box>
						<Heading size='lg'>Видео с камеры</Heading>
					</Box>

					<Button
						variant='outline'
						onClick={() => navigate(`/${cameraId}/recordings`)}
					>
						Назад к записям
					</Button>
				</Flex>

				<Box
					p={4}
					borderWidth='1px'
					borderColor='gray.200'
					borderRadius='2xl'
					bg='white'
				>
					<Text fontSize='sm' color='gray.600'>
						Загрузка записи...
					</Text>
				</Box>
			</Flex>
		)
	}

	if (isNotFound || !activeRecording) {
		return <Navigate to={`/${cameraId}`} />
	}

	return (
		<Flex direction='column' gap={6}>
			<Flex justify='space-between' align='center' wrap='wrap' gap={3}>
				<Box>
					<Heading size='lg'>Видео с камеры</Heading>
				</Box>

				<Button
					variant='outline'
					onClick={() => navigate(`/${cameraId}/recordings`)}
				>
					Назад к записям
				</Button>
			</Flex>

			<Stack gap={{ base: 4, md: 6 }}>
				<RecordingsDayTimeline
					cameraId={cameraId}
					recordings={[activeRecording]}
					playheadWallMs={recordingTimeline.playheadWallMs}
					onSeekWallMs={recordingTimeline.seekToWallMs}
				/>

				<Flex
					justify='space-between'
					align='center'
					wrap='wrap'
					gap={3}
					p={4}
					borderWidth='1px'
					borderColor='gray.200'
					borderRadius='2xl'
					bg='white'
				>
					<Box>
						<Text fontSize='sm' color='gray.600'>
							Начата: {formatRecordingDateTime(activeRecording.createdAt)}
						</Text>
						<Text fontSize='sm' color='gray.600'>
							Закончена:{' '}
							{formatRecordingDateTime(
								activeRecording.finishedAt,
								activeRecording.status === 0
									? 'Еще идет запись'
									: 'Нет данных',
							)}
						</Text>
					</Box>

					<RecordingStatus status={activeRecording.status} />
				</Flex>

				<CameraHlsPlayer
					playlistUrl={playlistUrl}
					onVideoElement={recordingTimeline.onVideoElement}
				/>
			</Stack>
		</Flex>
	)
}
