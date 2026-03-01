import { Box, Flex } from '@chakra-ui/react'
import type { FC } from 'react'

export const Logo: FC = () => {
	return (
		<Flex
			w='16'
			h='16'
			rounded='2xl'
			align='center'
			justify='center'
			bg='blue.500'
			boxShadow='xl'
		>
			<Box w='10' h='10' border='3px solid white' rounded='full' />
		</Flex>
	)
}
