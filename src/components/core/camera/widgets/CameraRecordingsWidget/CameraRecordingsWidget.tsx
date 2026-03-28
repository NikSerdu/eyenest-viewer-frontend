import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { FC } from 'react'

import {
	formatRecordingDateTime,
	RecordingStatus,
} from '@/components/core/camera/entities'
import { CameraHlsPlayer } from '@/components/core/camera/features/CameraHlsPlayer'

import { CameraRecordingsTimeline } from '../../features/CameraRecordingsTimeline'
import { useRecordingsPlaylistPlayback } from './model/hooks'

interface CameraRecordingsWidgetProps {
	cameraId: string
}

export const CameraRecordingsWidget: FC<CameraRecordingsWidgetProps> = ({
	cameraId,
}) => {
	const playback = useRecordingsPlaylistPlayback(cameraId)

	const showPlayer =
		!playback.isLoading &&
		!playback.isError &&
		playback.hasRecordings &&
		Boolean(playback.activeRecording && playback.playlistUrl)

	return (
		<Stack gap={{ base: 4, md: 6 }}>
			{showPlayer && playback.activeRecording && (
				<Stack gap={4}>
					<CameraHlsPlayer playlistUrl={playback.playlistUrl} />

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
								Начата:{' '}
								{formatRecordingDateTime(playback.activeRecording.createdAt)}
							</Text>
							<Text fontSize='sm' color='gray.600'>
								Закончена:{' '}
								{formatRecordingDateTime(
									playback.activeRecording.finishedAt,
									playback.activeRecording.status === 0
										? 'Еще идет запись'
										: 'Нет данных',
								)}
							</Text>
						</Box>

						<RecordingStatus status={playback.activeRecording.status} />
					</Flex>

					<Flex
						justify='center'
						align='center'
						gap={{ base: 3, md: 6 }}
						flexWrap='wrap'
						p={3}
						borderWidth='1px'
						borderColor='gray.100'
						borderRadius='xl'
						bg='gray.50'
					>
						<Button
							variant='outline'
							size='sm'
							onClick={playback.goPrev}
							disabled={playback.activeIndex <= 0}
						>
							<ChevronLeft size={18} />
							Предыдущая
						</Button>
						<Text fontSize='sm' fontWeight='medium' color='gray.700'>
							Запись {playback.activeIndex + 1} из {playback.recordings.length}
						</Text>
						<Button
							variant='outline'
							size='sm'
							onClick={playback.goNext}
							disabled={
								playback.activeIndex < 0 ||
								playback.activeIndex >= playback.recordings.length - 1
							}
						>
							Следующая
							<ChevronRight size={18} />
						</Button>
					</Flex>
				</Stack>
			)}

			<CameraRecordingsTimeline
				cameraId={cameraId}
				embed={{
					selectedId: playback.activeRecording?.id ?? null,
					onSelectRecording: playback.selectRecording,
				}}
			/>
		</Stack>
	)
}
