import { Stack } from '@chakra-ui/react'
import type { FC } from 'react'

import { CameraEventsFeed } from '../../features/CameraEventsFeed'

interface CameraEventsWidgetProps {
	cameraId: string
}

export const CameraEventsWidget: FC<CameraEventsWidgetProps> = ({ cameraId }) => {
	return (
		<Stack gap={{ base: 4, md: 6 }}>
			<CameraEventsFeed cameraId={cameraId} />
		</Stack>
	)
}
