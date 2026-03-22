import { Stack } from '@chakra-ui/react'
import type { FC } from 'react'

import { CameraRecordingsTimeline } from '../../features/CameraRecordingsTimeline'

interface CameraRecordingsWidgetProps {
	cameraId: string
}

export const CameraRecordingsWidget: FC<CameraRecordingsWidgetProps> = ({
	cameraId,
}) => {
	return (
		<Stack gap={{ base: 4, md: 6 }}>
			<CameraRecordingsTimeline cameraId={cameraId} />
		</Stack>
	)
}
