import type { FC } from 'react'
import { Box, Heading, Stack } from '@chakra-ui/react'
import { CameraGrid } from '../../features'

export const CameraWidget: FC = ({}) => {
	return (
		<Box w='full'>
			<Stack gap={{ base: 4, md: 6 }}>
				<Heading size={{ base: 'xl', md: '3xl' }}>Камеры</Heading>
				<CameraGrid />
			</Stack>
		</Box>
	)
}
