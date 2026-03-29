import { QueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@api/utils/getApiErrorMessage'
import { toaster } from '@app/ui/toaster'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
		mutations: {
			onError: error => {
				toaster.create({
					type: 'error',
					description: getApiErrorMessage(error),
					closable: true,
				})
			},
		},
	},
})
