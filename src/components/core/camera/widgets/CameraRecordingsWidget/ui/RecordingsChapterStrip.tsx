import { Box, Button, Flex, Text } from '@chakra-ui/react'
import type { FC } from 'react'

import type { StitchedChapterDto } from '@/api/requests/video/video'

import {
	formatRecordingDateTime,
	type CameraRecording,
} from '@/components/core/camera/entities'

type RecordingsChapterStripProps = {
	chapters: StitchedChapterDto[]
	recordings: CameraRecording[]
	activeRecordingId: string | null
	onSelectChapter: (recordingId: string) => void
}

export const RecordingsChapterStrip: FC<RecordingsChapterStripProps> = ({
	chapters,
	recordings,
	activeRecordingId,
	onSelectChapter,
}) => {
	return (
		<Box w='full'>
			<Text fontSize='xs' fontWeight='semibold' color='gray.600' mb={2}>
				Перейти к записи
			</Text>
			<Flex
				gap={2}
				overflowX='auto'
				pb={1}
				style={{
					WebkitOverflowScrolling: 'touch',
					scrollSnapType: 'x proximity',
				}}
			>
				{chapters.map(ch => {
					const rec = recordings.find(r => r.id === ch.recordingId)
					const label = rec
						? formatRecordingDateTime(rec.createdAt)
						: ch.recordingId.slice(0, 8)
					const active = activeRecordingId === ch.recordingId

					return (
						<Button
							key={ch.recordingId}
							flexShrink={0}
							size='sm'
							minH='44px'
							px={4}
							scrollSnapAlign='start'
							variant={active ? 'solid' : 'outline'}
							colorPalette={active ? 'blue' : 'gray'}
							onClick={() => onSelectChapter(ch.recordingId)}
						>
							<Text fontSize='xs' fontWeight='medium' whiteSpace='nowrap'>
								{label}
							</Text>
						</Button>
					)
				})}
			</Flex>
		</Box>
	)
}
