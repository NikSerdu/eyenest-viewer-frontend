import type { FC } from 'react'
import { Flex } from '@chakra-ui/react'
import { CameraWidget } from '../widgets'

export const CameraPage: FC = () => {
	return (
		<Flex direction='column' gap={6}>
			<CameraWidget />
		</Flex>
	)
}
