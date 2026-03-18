import { Box, Text } from '@chakra-ui/react'
import type { FC } from 'react'

import { getRecordingStatusMeta } from '../../model/lib/recording.utils'

interface RecordingStatusProps {
	status: number
}

export const RecordingStatus: FC<RecordingStatusProps> = ({ status }) => {
	const meta = getRecordingStatusMeta(status)

	return (
		<Box
			px={2}
			py={1}
			borderRadius='full'
			bg={meta.accentBg}
			borderWidth='1px'
			borderColor={meta.accentBorder}
		>
			<Text fontSize='10px' fontWeight='semibold' color={meta.accentColor}>
				{meta.label}
			</Text>
		</Box>
	)
}
