import {
	Box,
	Flex,
	Heading,
	IconButton,
	Input,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import {
	type FC,
	type MouseEvent,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react'

import { useGetEventsByCameraId } from '@/api/hooks'

import type { CameraRecording } from '../../../entities'
import {
	buildDayTimelineModel,
	buildViewTickLabels,
	formatWallClockRange,
	formatWallClockShort,
	localDayKey,
	parseLocalDayKey,
} from '../model/lib/recordingsDayTimeline'

interface RecordingsDayTimelineProps {
	cameraId: string
	recordings: CameraRecording[]
	playheadWallMs: number | null
	onSeekWallMs: (wallMs: number) => void
}

const MINOR_TICKS = 12

export const RecordingsDayTimeline: FC<RecordingsDayTimelineProps> = ({
	cameraId,
	recordings,
	playheadWallMs,
	onSeekWallMs,
}) => {
	const [selectedDay, setSelectedDay] = useState(() => new Date())
	const timelineRef = useRef<HTMLDivElement>(null)

	const { data: eventsData, isLoading: eventsLoading } =
		useGetEventsByCameraId(cameraId)
	const events = eventsData ?? []

	const model = useMemo(
		() => buildDayTimelineModel(recordings, events, selectedDay),
		[recordings, events, selectedDay],
	)

	const tickLabels = useMemo(
		() => buildViewTickLabels(model.viewStartMs, model.viewEndMs, 5),
		[model.viewStartMs, model.viewEndMs],
	)

	const playheadPct = useMemo(() => {
		if (playheadWallMs == null) {
			return null
		}
		if (
			playheadWallMs < model.calendarDayStartMs ||
			playheadWallMs > model.calendarDayEndMs
		) {
			return null
		}
		if (
			playheadWallMs < model.viewStartMs ||
			playheadWallMs > model.viewEndMs
		) {
			return null
		}
		return (
			((playheadWallMs - model.viewStartMs) / model.viewSpanMs) * 100
		)
	}, [playheadWallMs, model])

	const playheadOnCalendarDay =
		playheadWallMs != null &&
		playheadWallMs >= model.calendarDayStartMs &&
		playheadWallMs <= model.calendarDayEndMs

	const playheadOutsideView =
		playheadOnCalendarDay &&
		playheadPct == null &&
		!model.isFullDayFallback

	const handleTrackClick = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			const el = timelineRef.current
			if (!el) {
				return
			}
			const rect = el.getBoundingClientRect()
			const x = e.clientX - rect.left
			const ratio = Math.max(0, Math.min(1, x / rect.width))
			const wallMs = model.viewStartMs + ratio * model.viewSpanMs
			onSeekWallMs(wallMs)
		},
		[model.viewStartMs, model.viewSpanMs, onSeekWallMs],
	)

	const shiftDay = useCallback((delta: number) => {
		setSelectedDay(prev => {
			const d = new Date(prev)
			d.setDate(d.getDate() + delta)
			return d
		})
	}, [])

	const dateLabel = selectedDay.toLocaleDateString('ru-RU', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})

	return (
		<Box
			borderRadius='xl'
			bg='whiteAlpha.700'
			backdropFilter='blur(12px)'
			borderWidth='1px'
			borderColor='gray.200'
			boxShadow='md'
			p={{ base: 3, md: 4 }}
		>
			<Flex
				justify='space-between'
				align={{ base: 'flex-start', sm: 'center' }}
				gap={3}
				mb={4}
				direction={{ base: 'column', sm: 'row' }}
			>
				<Box>
					<Heading size='xs' mb={1}>
						Временная шкала записей
					</Heading>
					<Flex align='center' gap={2} flexWrap='wrap'>
						<Text fontSize='sm' color='gray.500'>
							{dateLabel}
						</Text>
						{eventsLoading ? <Spinner size='xs' /> : null}
					</Flex>
				</Box>

				<Flex align='center' gap={1} flexShrink={0} flexWrap='wrap'>
					<IconButton
						variant='outline'
						size='sm'
						borderRadius='lg'
						aria-label='Предыдущий день'
						onClick={() => shiftDay(-1)}
					>
						<ChevronLeft size={18} />
					</IconButton>
					<IconButton
						variant='outline'
						size='sm'
						borderRadius='lg'
						aria-label='Следующий день'
						onClick={() => shiftDay(1)}
					>
						<ChevronRight size={18} />
					</IconButton>
					<Box position='relative'>
						<Input
							type='date'
							value={localDayKey(selectedDay)}
							onChange={e => {
								const v = e.target.value
								if (!v) {
									return
								}
								setSelectedDay(parseLocalDayKey(v))
							}}
							position='absolute'
							inset={0}
							opacity={0}
							cursor='pointer'
							w='full'
							h='full'
							minW='140px'
							aria-label='Выбрать дату'
						/>
						<Flex
							as='button'
							type='button'
							align='center'
							gap={2}
							px={3}
							py={2}
							borderRadius='xl'
							bg='white'
							borderWidth='1px'
							borderColor='gray.200'
							fontSize='sm'
							color='gray.700'
							_hover={{ bg: 'gray.50' }}
							pointerEvents='none'
						>
							<Calendar size={16} />
							<Text>Выбрать дату</Text>
						</Flex>
					</Box>
				</Flex>
			</Flex>

			<Stack gap={3}>
				<Flex justify='space-between' fontSize='xs' color='gray.500' px={0.5}>
					{tickLabels.map((label, i) => (
						<Text key={i} as='span' whiteSpace='nowrap'>
							{label}
						</Text>
					))}
				</Flex>

				<Box
					ref={timelineRef}
					onClick={handleTrackClick}
					position='relative'
					h='16'
					borderRadius='xl'
					bgGradient='to-br'
					gradientFrom='gray.100'
					gradientTo='gray.50'
					borderWidth='1px'
					borderColor='gray.200'
					cursor='pointer'
					overflow='hidden'
					touchAction='manipulation'
					role='slider'
					aria-label='Шкала записей: нажмите, чтобы перейти ко времени'
				>
					{model.segments.map((seg, segIdx) => (
						<Box
							key={`${seg.recordingId}-${segIdx}`}
							position='absolute'
							top={0}
							bottom={0}
							borderTopWidth='2px'
							borderTopColor={seg.hasMotion ? 'blue.500' : 'gray.400'}
							borderRadius='md'
							bg={
								seg.hasMotion
									? 'linear-gradient(to right, rgba(59, 130, 246, 0.35), rgba(99, 102, 241, 0.35))'
									: 'linear-gradient(to right, rgba(148, 163, 184, 0.35), rgba(100, 116, 139, 0.35))'
							}
							style={{
								left: `${seg.leftPct}%`,
								width: `${seg.widthPct}%`,
							}}
						/>
					))}

					{model.motionMarkers.map(m => (
						<Box
							key={m.id}
							position='absolute'
							top={1}
							w='10px'
							h='10px'
							borderRadius='full'
							bg='yellow.400'
							boxShadow='sm'
							borderWidth='2px'
							borderColor='white'
							transform='translateX(-50%)'
							style={{ left: `${m.leftPct}%` }}
							pointerEvents='none'
							title='Движение'
						/>
					))}

					{playheadPct != null && (
						<Box
							position='absolute'
							top={0}
							bottom={0}
							w='0.5'
							bgGradient='to-b'
							gradientFrom='red.500'
							gradientTo='red.600'
							boxShadow='md'
							transform='translateX(-50%)'
							style={{ left: `${playheadPct}%` }}
							pointerEvents='none'
						>
							<Box
								position='absolute'
								top='-4px'
								left='50%'
								transform='translateX(-50%)'
								w='10px'
								h='10px'
								borderRadius='full'
								bg='red.500'
								borderWidth='2px'
								borderColor='white'
								boxShadow='md'
							/>
						</Box>
					)}

					<Box
						position='absolute'
						inset={0}
						bgGradient='to-r'
						gradientFrom='transparent'
						gradientVia='whiteAlpha.400'
						gradientTo='transparent'
						opacity={0}
						_hover={{ opacity: 0.15 }}
						pointerEvents='none'
						transition='opacity 0.2s'
					/>
				</Box>

				<Box position='relative' h='2'>
					{Array.from({ length: MINOR_TICKS + 1 }).map((_, i) => (
						<Box
							key={i}
							position='absolute'
							top={0}
							w='1px'
							h='2'
							bg='gray.300'
							style={{ left: `${(i / MINOR_TICKS) * 100}%` }}
						/>
					))}
				</Box>
			</Stack>

			<Flex
				mt={4}
				pt={4}
				borderTopWidth='1px'
				borderColor='gray.200'
				justify='space-between'
				align={{ base: 'flex-start', md: 'center' }}
				gap={3}
				direction={{ base: 'column', md: 'row' }}
				flexWrap='wrap'
			>
				<Text fontSize='sm' color='gray.600'>
					{playheadWallMs != null && playheadPct != null ? (
						<>
							<Text as='span' fontFamily='mono' fontWeight='semibold'>
								{formatWallClockShort(playheadWallMs)}
							</Text>
							<Text as='span' color='gray.400' mx={2}>
								·
							</Text>
							<Text as='span' fontFamily='mono' color='gray.500'>
								{formatWallClockRange(
									model.viewStartMs,
									model.viewEndMs,
								)}
							</Text>
						</>
					) : playheadOutsideView ? (
						<Text as='span' color='gray.500'>
							Воспроизведение в этот день, но вне отрезка на шкале (
							{formatWallClockRange(
								model.viewStartMs,
								model.viewEndMs,
							)}
							)
						</Text>
					) : (
						<Text as='span' color='gray.500'>
							Воспроизведение не на этом дне — смените дату или
							перемотайте плеер
						</Text>
					)}
				</Text>

				<Flex gap={4} align='center' flexWrap='wrap'>
					<Flex align='center' gap={2}>
						<Box
							w={3}
							h={3}
							borderRadius='sm'
							bgGradient='to-r'
							gradientFrom='blue.500'
							gradientTo='indigo.500'
						/>
						<Text fontSize='xs' color='gray.600'>
							Было движение в записи
						</Text>
					</Flex>
					<Flex align='center' gap={2}>
						<Box
							w={3}
							h={3}
							borderRadius='sm'
							bgGradient='to-r'
							gradientFrom='gray.400'
							gradientTo='gray.500'
						/>
						<Text fontSize='xs' color='gray.600'>
							Запись без отметок
						</Text>
					</Flex>
					<Flex align='center' gap={2}>
						<Box w={2.5} h={2.5} borderRadius='full' bg='yellow.400' />
						<Text fontSize='xs' color='gray.600'>
							Событие движения
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}
