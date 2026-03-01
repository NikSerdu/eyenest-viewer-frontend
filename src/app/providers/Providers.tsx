import { QueryClientProvider } from '@tanstack/react-query'
import type { FC, PropsWithChildren } from 'react'
import { queryClient } from '../configs'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from './../theme/theme'

const Providers: FC<PropsWithChildren> = ({ children }) => {
	return (
		<ChakraProvider value={system}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ChakraProvider>
	)
}

export default Providers
