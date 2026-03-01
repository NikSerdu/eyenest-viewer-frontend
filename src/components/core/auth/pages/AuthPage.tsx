import type { FC } from 'react'
import { Flex } from '@chakra-ui/react'
import { AuthWidget } from '../widgets'

export const AuthPage: FC = () => {
	return (
		<Flex minH='100vh' align='center' justify='center' bg='bg.DEFAULT' p='6'>
			<AuthWidget />
		</Flex>
	)
}
