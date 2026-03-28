import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { FC } from 'react'

import {
	formatRecordingDateTime,
	RecordingStatus,
} from '@/components/core/camera/entities'
import { CameraHlsPlayer } from '@/components/core/camera/features/CameraHlsPlayer'

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

	const showPlayer =
		!playback.isLoading &&
		!playback.isError &&
		playback.hasRecordings &&
		Boolean(playback.playlistUrl)

	return (
		<Stack gap={{ base: 4, md: 6 }}>
			{!playback.isLoading &&
				!playback.isError &&
				playback.realRecordings.length > 0 && (
					<RecordingsDayTimeline
						cameraId={cameraId}
						recordings={playback.realRecordings}
						playheadWallMs={playback.playheadWallMs}
						onSeekWallMs={playback.seekToWallMs}
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
									{formatRecordingDateTime(
										playback.activeRecording.createdAt,
									)}
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
							p={{ base: 3, md: 4 }}
							borderWidth='1px'
							borderColor='gray.100'
							borderRadius='xl'
							bg='gray.50'
						>
							<Flex
								align='center'
								justify='space-between'
								gap={2}
								wrap='nowrap'
							>
								<Button
									variant='solid'
									colorPalette='blue'
									size='lg'
									minW='48px'
									minH='48px'
									px={3}
									onClick={playback.goPrev}
									disabled={!playback.canPrev}
									aria-label='Предыдущая запись'
								>
									<ChevronLeft size={22} />
								</Button>
								<Text
									fontSize='sm'
									fontWeight='semibold'
									color='gray.700'
									textAlign='center'
									flex='1'
								>
									Запись {playback.currentChapterIndex + 1} из{' '}
									{playback.chapterTotal}
								</Text>
								<Button
									variant='solid'
									colorPalette='blue'
									size='lg'
									minW='48px'
									minH='48px'
									px={3}
									onClick={playback.goNext}
									disabled={!playback.canNext}
									aria-label='Следующая запись'
								>
									<ChevronRight size={22} />
								</Button>
							</Flex>

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

			<CameraRecordingsTimeline
				cameraId={cameraId}
				embed={{
					selectedId: playback.uiSelectedId,
					onSelectRecording: playback.selectRecording,
				}}
			/>
		</Stack>
	)
}
