import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { type FC, useCallback, useMemo, useState } from 'react'

import { downloadRecordingArchive } from '@/api/requests'
import { getApiErrorMessage } from '@/api/utils/getApiErrorMessage'
import { toaster } from '@app/ui/toaster'
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

interface CameraRecordingsWidgetProps {
	cameraId: string
}

export const CameraRecordingsWidget: FC<CameraRecordingsWidgetProps> = ({
	cameraId,
}) => {
	const playback = useRecordingsPlaylistPlayback(cameraId)
	const [isDownloadingRecording, setIsDownloadingRecording] = useState(false)

	const handleDownloadRecording = useCallback(async () => {
		const rec = playback.activeRecording
		if (!rec) {
			return
		}
		setIsDownloadingRecording(true)
		try {
			const { blob, filename } = await downloadRecordingArchive(
				cameraId,
				rec.id,
			)
			const url = URL.createObjectURL(blob)
			try {
				const a = document.createElement('a')
				a.href = url
				a.download = filename
				a.rel = 'noopener'
				document.body.appendChild(a)
				a.click()
				a.remove()
			} finally {
				URL.revokeObjectURL(url)
			}
		} catch (e) {
			const description =
				e instanceof Error && e.message.trim()
					? e.message
					: getApiErrorMessage(e)
			toaster.create({
				type: 'error',
				description,
				closable: true,
			})
		} finally {
			setIsDownloadingRecording(false)
		}
	}, [playback.activeRecording, cameraId])

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

	const timelinePlaybackSync = useMemo(() => {
		const r = playback.activeRecording
		if (!r) {
			return {
				syncRecordingId: null as string | null,
				calendarDayAnchorMs: null as number | null,
				playbackWallRangeMs: null as { start: number; end: number } | null,
			}
		}
		const start = new Date(r.createdAt).getTime()
		return {
			syncRecordingId: r.id,
			calendarDayAnchorMs: start,
			playbackWallRangeMs: { start, end: recordingEndMs(r) },
		}
	}, [playback.activeRecording])

	const showPlayer =
		!playback.isLoading &&
		!playback.isError &&
		playback.hasRecordings &&
		Boolean(playback.playlistUrl)

	const showRecordingNav = playback.recordingTotal > 1

	return (
		<Stack gap={{ base: 4, md: 6 }}>
			{!playback.isLoading &&
				!playback.isError &&
				timelineRecordings.length > 0 && (
					<RecordingsDayTimeline
						cameraId={cameraId}
						recordings={timelineRecordings}
						playheadWallMs={playback.playheadWallMs}
						onSeekWallMs={playback.seekToWallMs}
						excludeEventWallRangesMs={excludeEventWallRangesMs}
						syncRecordingId={timelinePlaybackSync.syncRecordingId}
						calendarDayAnchorMs={timelinePlaybackSync.calendarDayAnchorMs}
						playbackWallRangeMs={timelinePlaybackSync.playbackWallRangeMs}
					/>
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

							<Flex align='center' gap={3} wrap='wrap' justify='flex-end'>
								<Button
									variant='outline'
									colorPalette='gray'
									size='sm'
									loading={isDownloadingRecording}
									onClick={handleDownloadRecording}
								>
									<Download size={18} />
									Скачать архив
								</Button>
								<RecordingStatus status={playback.activeRecording.status} />
							</Flex>
						</Flex>
					)}

					{showRecordingNav && (
						<Flex
							align='center'
							justify='space-between'
							gap={2}
							wrap='nowrap'
							p={{ base: 3, md: 4 }}
							borderWidth='1px'
							borderColor='gray.100'
							borderRadius='xl'
							bg='gray.50'
						>
							<Button
								variant='solid'
								colorPalette='blue'
								size='lg'
								minW='48px'
								minH='48px'
								px={3}
								onClick={playback.goOlder}
								disabled={!playback.canGoOlder}
								aria-label='Более старая запись'
							>
								<ChevronLeft size={22} />
							</Button>
							<Box flex='1' textAlign='center'>
								<Text fontSize='sm' fontWeight='semibold' color='gray.700'>
									Запись {playback.chronoRecordingNumber} из{' '}
									{playback.recordingTotal}
								</Text>
								<Text fontSize='xs' color='gray.500'>
									стрелка влево — старше, вправо — новее
								</Text>
							</Box>
							<Button
								variant='solid'
								colorPalette='blue'
								size='lg'
								minW='48px'
								minH='48px'
								px={3}
								onClick={playback.goNewer}
								disabled={!playback.canGoNewer}
								aria-label='Более новая запись'
							>
								<ChevronRight size={22} />
							</Button>
						</Flex>
					)}
				</Stack>
			)}

			<CameraRecordingsTimeline
				cameraId={cameraId}
				embed={{
					selectedId: playback.resolvedActiveId,
					onSelectRecording: playback.selectRecording,
				}}
			/>
		</Stack>
	)
}
