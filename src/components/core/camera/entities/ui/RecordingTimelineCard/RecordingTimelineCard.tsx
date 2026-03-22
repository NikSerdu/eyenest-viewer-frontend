import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { ChevronRight, PlayCircle, Trash2 } from 'lucide-react'
import type { FC } from 'react'

import type { CameraRecording } from '../../model/types/recording.types'
import { formatRecordingDateTime } from '../../model/lib/recording.utils'
import { RecordingStatus } from '../RecordingStatus/RecordingStatus'

interface RecordingTimelineCardProps {
	recording: CameraRecording
	isSelected: boolean
	onClick: () => void
	onDeletePress?: () => void
}

export const RecordingTimelineCard: FC<RecordingTimelineCardProps> = ({
	recording,
	isSelected,
	onClick,
	onDeletePress,
}) => {
	return (
		<Flex
			w='full'
			align='stretch'
			gap={1}
			borderRadius='lg'
			bg={isSelected ? 'blue.50' : 'transparent'}
			borderWidth='1px'
			borderColor={isSelected ? 'brand.blue.200' : 'transparent'}
			_hover={{
				bg: isSelected ? 'blue.50' : 'gray.50',
			}}
			transition='background-color 0.2s ease, border-color 0.2s ease'
			p={{ base: 2.5, md: 3 }}
		>
			<Box
				as='button'
				flex='1'
				minW={0}
				textAlign='left'
				onClick={onClick}
				bg='transparent'
			>
				<Flex align='center' gap={{ base: 2.5, md: 3 }}>
					<Flex
						boxSize={{ base: 9, md: 10 }}
						borderRadius='lg'
						bg={isSelected ? 'brand.blue.500' : 'gray.100'}
						color={isSelected ? 'white' : 'gray.500'}
						align='center'
						justify='center'
						flexShrink={0}
					>
						<PlayCircle size={16} />
					</Flex>

					<Box flex='1' minW={0}>
						<Flex
							align={{ base: 'flex-start', md: 'center' }}
							justify='space-between'
							gap={2}
							direction={{ base: 'column', md: 'row' }}
						>
							<Flex
								flex='1'
								minW={0}
								gap={{ base: 1, md: 4 }}
								direction={{ base: 'column', sm: 'row' }}
								align={{ base: 'flex-start', sm: 'center' }}
							>
								<Text
									fontSize='sm'
									fontWeight='semibold'
									color='gray.900'
									whiteSpace='nowrap'
								>
									{formatRecordingDateTime(recording.createdAt)}
								</Text>
								<Text fontSize='xs' color='gray.500' whiteSpace='nowrap'>
									{formatRecordingDateTime(
										recording.finishedAt,
										recording.status === 0 ? 'Еще идет запись' : 'Нет данных',
									)}
								</Text>
							</Flex>

							<RecordingStatus status={recording.status} />
						</Flex>
					</Box>

					<Box
						color={isSelected ? 'brand.blue.500' : 'gray.400'}
						flexShrink={0}
					>
						<ChevronRight size={16} />
					</Box>
				</Flex>
			</Box>

			{onDeletePress && (
				<IconButton
					alignSelf='center'
					size='xs'
					variant='ghost'
					colorPalette='red'
					flexShrink={0}
					aria-label='Удалить запись'
					onClick={onDeletePress}
					disabled={recording.status === 0}
					title={
						recording.status === 0
							? 'Сначала остановите запись'
							: 'Удалить запись'
					}
				>
					<Trash2 size={14} />
				</IconButton>
			)}
		</Flex>
	)
}
