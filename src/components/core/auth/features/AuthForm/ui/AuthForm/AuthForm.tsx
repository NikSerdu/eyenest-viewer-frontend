import type { FC } from 'react'
import { VStack } from '@chakra-ui/react'
import { AuthTabs } from '../AuthTabs/AuthTabs'
import { useAuthForm } from '../../model/hooks'
import type { AuthType } from '../../model/types/types'
import type { LoginFormValues, RegisterFormValues } from '@auth/features'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

interface AuthFormProps {
	onLogin: (data: LoginFormValues) => void
	onRegister: (data: RegisterFormValues) => void
	onAuthTypeChange?: (value: AuthType) => void
}

export const AuthForm: FC<AuthFormProps> = ({
	onLogin,
	onRegister,
	onAuthTypeChange,
}) => {
	const {
		data: { authType, showConfirmPassword, showPassword },
		handlers: {
			handleAuthTypeChange,
			toggleConfirmPasswordVisibility,
			togglePasswordVisibility,
		},
	} = useAuthForm({ onAuthTypeChange })

	return (
		<VStack gap='5'>
			<AuthTabs value={authType} onChange={handleAuthTypeChange} />
			{authType === 'sign-in' && (
				<LoginForm
					onSubmit={onLogin}
					showPassword={showPassword}
					onTogglePassword={togglePasswordVisibility}
				/>
			)}
			{authType === 'sign-up' && (
				<RegisterForm
					onSubmit={onRegister}
					showPassword={showPassword}
					showConfirmPassword={showConfirmPassword}
					onTogglePassword={togglePasswordVisibility}
					onToggleConfirmPassword={toggleConfirmPasswordVisibility}
				/>
			)}
		</VStack>
	)
}
