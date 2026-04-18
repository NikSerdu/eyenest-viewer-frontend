import type { FC } from 'react'
import { Flex } from '@chakra-ui/react'
import { CameraWidget } from '../widgets'

export const CameraPage: FC = () => {
	return (
		<Flex direction='column' gap={{ base: 4, md: 6 }}>
			<CameraWidget />
		</Flex>
	)
}
