import type { FC } from 'react'
import { Box } from '@chakra-ui/react'

export const Logo: FC = () => {
	return (
		<Box
			display='inline-flex'
			alignItems='center'
			justifyContent='center'
			w='64px'
			h='64px'
			borderRadius='2xl'
			bgGradient='to-br'
			gradientFrom={'brand.blue.500'}
			gradientTo={'brand.blue.700'}
			boxShadow='0 20px 40px rgba(59,130,246,0.5)'
			mb={4}
		>
			<Box w='40px' h='40px' border='4px solid white' borderRadius='full' />
		</Box>
	)
}
