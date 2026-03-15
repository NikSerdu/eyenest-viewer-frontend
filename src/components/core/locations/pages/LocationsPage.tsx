import type { FC } from 'react'
import { Flex } from '@chakra-ui/react'
import { LocationsWidget } from '../widgets'

export const LocationsPage: FC = () => {
	return (
		<Flex direction='column' gap={6}>
			<LocationsWidget />
		</Flex>
	)
}
