import type { FC } from 'react'
import { Flex } from '@chakra-ui/react'
import { LocationsWidget } from '../widgets'

export const LocationsPage: FC = () => {
	return (
		<Flex direction='column' gap={{ base: 4, md: 6 }}>
			<LocationsWidget />
		</Flex>
	)
}
