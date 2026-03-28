import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type FC, useMemo } from 'react'
import { Link } from 'react-router-dom'

import {
	formatRecordingDateTime,
	RecordingStatus,
} from '@/components/core/camera/entities'
import { CameraHlsPlayer } from '@/components/core/camera/features/CameraHlsPlayer'
import { recordingEndMs } from '@/components/core/camera/features/CameraRecordingsTimeline/model/lib/recordingsDayTimeline'

import {
	CameraRecordingsTimeline,
	RecordingsDayTimeline,
} from '../../features/CameraRecordingsTimeline'
import { useRecordingsPlaylistPlayback } from './model/hooks'
import { RecordingsChapterStrip } from './ui/RecordingsChapterStrip'

interface CameraRecordingsWidgetProps {
	cameraId: string
}

export const CameraRecordingsWidget: FC<CameraRecordingsWidgetProps> = ({
	cameraId,
}) => {
	const playback = useRecordingsPlaylistPlayback(cameraId)

	const activeInProgressRecording = useMemo(
		() => playback.realRecordings.find(r => r.status === 0) ?? null,
		[playback.realRecordings],
	)

	const timelineRecordings = useMemo(
		() => playback.realRecordings.filter(r => r.status !== 0),
		[playback.realRecordings],
	)

	const excludeEventWallRangesMs = useMemo(() => {
		if (!activeInProgressRecording) {
			return undefined
		}
		const start = new Date(activeInProgressRecording.createdAt).getTime()
		const end = recordingEndMs(activeInProgressRecording)
		return [{ start, end }]
	}, [activeInProgressRecording])

	const showPlayer =
		!playback.isLoading &&
		!playback.isError &&
		playback.hasRecordings &&
		Boolean(playback.playlistUrl)

	return (
		<Stack gap={{ base: 4, md: 6 }}>
			{!playback.isLoading &&
				!playback.isError &&
				activeInProgressRecording && (
					<Box
						p={3}
						borderRadius='lg'
						bg='blue.50'
						borderWidth='1px'
						borderColor='blue.100'
					>
						<Text fontSize='sm' color='blue.900'>
							Текущая запись на общей шкале не отображается; события движения
							за этот период здесь тоже скрыты.{' '}
							<Link
								to={`/${cameraId}/${activeInProgressRecording.id}`}
								style={{ fontWeight: 600, textDecoration: 'underline' }}
							>
								Открыть страницу этой записи
							</Link>
							, чтобы смотреть поток и отметки на таймлайне.
						</Text>
					</Box>
				)}

			{!playback.isLoading &&
				!playback.isError &&
				timelineRecordings.length > 0 && (
					<RecordingsDayTimeline
						cameraId={cameraId}
						recordings={timelineRecordings}
						playheadWallMs={playback.playheadWallMs}
						onSeekWallMs={playback.seekToWallMs}
						excludeEventWallRangesMs={excludeEventWallRangesMs}
					/>
				)}

			{playback.chaptersError && playback.hasStitchedEntry && (
				<Box
					p={3}
					borderRadius='lg'
					bg='orange.50'
					borderWidth='1px'
					borderColor='orange.200'
				>
					<Text fontSize='sm' color='orange.800'>
						Не удалось загрузить разметку записей в общем плеере. Просмотр
						доступен, переключение по таймкодам — после обновления страницы.
					</Text>
				</Box>
			)}

			{showPlayer && (
				<Stack gap={4}>
					<CameraHlsPlayer
						playlistUrl={playback.playlistUrl}
						onVideoElement={playback.onVideoElement}
					/>

					{playback.activeRecording && (
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
					)}

					{playback.chapterNavReady && (
						<Stack
							gap={4}
							borderWidth='1px'
							borderColor='gray.100'
							borderRadius='xl'
							bg='gray.50'
						>
							<RecordingsChapterStrip
								chapters={playback.orderedChapters}
								recordings={playback.recordings}
								activeRecordingId={playback.activeRecording?.id ?? null}
								onSelectChapter={id => {
									const r = playback.recordings.find(x => x.id === id)
									if (r) {
										playback.selectRecording(r)
									}
								}}
							/>
						</Stack>
					)}

					{playback.showLegacyNav && (
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
								disabled={!playback.canPrev}
							>
								<ChevronLeft size={18} />
								Предыдущая
							</Button>
							<Text fontSize='sm' fontWeight='medium' color='gray.700'>
								Запись из списка
							</Text>
							<Button
								variant='outline'
								size='sm'
								onClick={playback.goNext}
								disabled={!playback.canNext}
							>
								Следующая
								<ChevronRight size={18} />
							</Button>
						</Flex>
					)}
				</Stack>
			)}

			<CameraRecordingsTimeline cameraId={cameraId} />
		</Stack>
	)
}
