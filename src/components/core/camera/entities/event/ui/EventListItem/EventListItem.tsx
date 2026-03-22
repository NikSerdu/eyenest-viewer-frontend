import { Box, Flex, Text } from '@chakra-ui/react'
import type { FC } from 'react'

import type { EventResponse } from '@api/generated'

import { formatRecordingDateTime } from '../../../model/lib/recording.utils'
import { getEventTypeLabelRu } from '../../model/lib/eventTypeLabel'

interface EventListItemProps {
	event: EventResponse
}

export const EventListItem: FC<EventListItemProps> = ({ event }) => {
	return (
		<Flex
			align='flex-start'
			justify='space-between'
			gap={3}
			py={2}
			px={1}
			borderRadius='md'
			_hover={{ bg: 'gray.50' }}
		>
			<Box minW={0}>
				<Text fontSize='sm' fontWeight='semibold' color='gray.800'>
					{getEventTypeLabelRu(event.eventType)}
				</Text>
			</Box>
			<Text fontSize='sm' color='gray.600' flexShrink={0} textAlign='right'>
				{formatRecordingDateTime(event.createdAt)}
			</Text>
		</Flex>
	)
}
