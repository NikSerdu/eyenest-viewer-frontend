import { Stack } from '@chakra-ui/react'
import type { FC } from 'react'

import { CameraRecordingsTimeline } from '../../features'
import { CameraVideo } from '../../features/CameraVideo/ui/CameraVideo'

interface CameraDetailsWidgetProps {
	cameraId: string
}

export const CameraDetailsWidget: FC<CameraDetailsWidgetProps> = ({ cameraId }) => {
	return (
		<Stack gap={{ base: 4, md: 6 }}>
			<CameraVideo roomID={cameraId} />
			<CameraRecordingsTimeline cameraId={cameraId} />
		</Stack>
	)
}
