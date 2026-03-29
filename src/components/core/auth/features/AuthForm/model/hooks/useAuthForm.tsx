import { useState, useCallback } from 'react'
import type { AuthType } from '../types/types'
import { useLogin, useRegister } from '@/api/hooks'

type UseAuthFormOptions = {
	onAuthTypeChange?: (value: AuthType) => void
}

export const useAuthForm = (options?: UseAuthFormOptions) => {
	const { onAuthTypeChange } = options ?? {}
	const [authType, setAuthType] = useState<AuthType>('sign-in')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const handleAuthTypeChange = useCallback(
		(value: AuthType) => {
			setAuthType(value)
			onAuthTypeChange?.(value)
		},
		[onAuthTypeChange],
	)

	const togglePasswordVisibility = useCallback(() => {
		setShowPassword(prev => !prev)
	}, [])

	const toggleConfirmPasswordVisibility = useCallback(() => {
		setShowConfirmPassword(prev => !prev)
	}, [])

	const login = useLogin()
	const register = useRegister()

	return {
		data: {
			authType,
			showPassword,
			showConfirmPassword,
		},
		handlers: {
			handleAuthTypeChange,
			togglePasswordVisibility,
			toggleConfirmPasswordVisibility,
			login,
			register,
		},
		status: {},
	}
}
