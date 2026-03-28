import { useQueryClient } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { useLogout } from '@/api/hooks'
import type { LogoutResponse } from '@api/requests/auth/auth'
import { ROUTES } from '@/app/constants/routes'
import { authStore } from '@auth/entities/model/store'

export const useLogoutUser = (
	options?: Omit<
		UseMutationOptions<LogoutResponse, unknown, void>,
		'mutationKey' | 'mutationFn'
	>,
) => {
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const { setUser, setLoading } = authStore()

	return useLogout({
		...options,
		onSuccess: (data, variables, context) => {
			setUser(null)
			setLoading(false)
			queryClient.clear()
			navigate(ROUTES.AUTH, { replace: true })
			options?.onSuccess?.(data, variables, context)
		},
	})
}
