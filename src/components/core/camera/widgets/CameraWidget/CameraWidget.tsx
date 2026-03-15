import type { FC } from 'react'
import { Box, Heading, Stack } from '@chakra-ui/react'
import { CameraGrid } from '../../features'

export const CameraWidget: FC = ({}) => {
	return (
		<Box w='full'>
			<Stack gap={6}>
				<Heading size='3xl'>Камеры</Heading>
				<CameraGrid />
			</Stack>
		</Box>
	)
}
